
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { createCheckoutSession, SubscriptionPlan, subscriptionPlans } from "@/utils/subscription";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/utils/tracker";
import { useNavigate } from "react-router-dom";

interface PricingPlansProps {
  className?: string;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ className }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      trackEvent({
        eventType: "pricing_signup_click",
        eventData: { plan: plan.id }
      });
      navigate("/signup");
      return;
    }

    trackEvent({
      eventType: "pricing_checkout_click",
      eventData: { plan: plan.id }
    });
    
    // In a real implementation, these would be actual Stripe price IDs
    const priceMap: Record<string, string> = {
      "basic": "price_basic",
      "premium": "price_premium",
      "enterprise": "price_enterprise"
    };
    
    createCheckoutSession(priceMap[plan.id]);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {subscriptionPlans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`flex flex-col ${
            plan.popular 
              ? "border-blue-500 shadow-lg shadow-blue-100" 
              : "border-gray-200"
          }`}
        >
          {plan.popular && (
            <div className="bg-blue-500 text-white text-center text-sm py-1 font-medium">
              MOST POPULAR
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">₦{(plan.price / 100).toLocaleString()}</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  : ""
              }`}
              variant={plan.popular ? "default" : "outline"}
            >
              {isAuthenticated ? "Subscribe Now" : "Sign Up"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingPlans;
