
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  currency: string;
  interval: 'month' | 'year';
  popular?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential tools for small businesses",
    price: 4999,
    currency: "NGN",
    interval: "month",
    features: [
      "Static QR code generation",
      "Basic transaction history",
      "Email support",
      "Standard security features",
      "Up to 3 payment methods"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced tools and analytics",
    price: 9999,
    currency: "NGN",
    interval: "month",
    popular: true,
    features: [
      "Dynamic QR codes",
      "Basic AI analytics",
      "Customer behavior insights",
      "Integration with 1 accounting software",
      "Priority email support",
      "Advanced security",
      "Up to 5 payment methods"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for large merchants",
    price: 29999,
    currency: "NGN",
    interval: "month",
    features: [
      "All Premium features",
      "Full AI-powered analytics",
      "User segmentation",
      "Advanced funnel analysis",
      "Multi-gateway routing optimization",
      "Integration with all supported accounting software",
      "Dedicated account manager",
      "Custom branding options",
      "Enterprise-grade security",
      "Unlimited payment methods"
    ]
  }
];

export const createCheckoutSession = async (priceId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId }
    });

    if (error) throw error;
    
    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error: any) {
    toast({
      title: "Checkout failed",
      description: error.message || "Could not initiate checkout",
      variant: "destructive",
    });
    console.error("Checkout error:", error);
  }
};

export const getCustomerPortal = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');

    if (error) throw error;
    
    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No portal URL returned');
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Could not open customer portal",
      variant: "destructive",
    });
    console.error("Portal error:", error);
  }
};

export const getCurrentSubscription = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription');

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Subscription check error:", error);
    return { subscribed: false };
  }
};
