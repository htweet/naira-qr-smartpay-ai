import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Subscription {
  id: string;
  user_id: string;
  merchant_id?: string;
  plan_id: string;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  current_period_start?: string;
  current_period_end?: string;
  flutterwave_tx_ref?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingRecord {
  id: string;
  subscription_id?: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  payment_reference?: string;
  paid_at?: string;
  created_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ qrCodes: 0, transactions: 0 });

  const fetchSubscription = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data: sub } = await client
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      setSubscription(sub || null);

      const { data: history } = await client
        .from("billing_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      setBillingHistory(history || []);

      // Fetch usage stats
      const { data: merchant } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (merchant) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const qrClient = supabase as any;
        const { count: qrCount } = await qrClient
          .from("qr_codes")
          .select("*", { count: "exact", head: true })
          .eq("merchant_id", merchant.id);
        
        const { count: txCount } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("merchant_id", merchant.id);

        setUsage({ qrCodes: qrCount || 0, transactions: txCount || 0 });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchSubscription(); }, [fetchSubscription]);

  const subscribe = async (planId: string) => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan_id: planId, email: user.email, redirect_url: window.location.href },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.success) {
        toast({ title: "Subscription Activated", description: `${planId} plan is now active` });
        fetchSubscription();
      } else {
        throw new Error(data?.error || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Subscription failed", variant: "destructive" });
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { error } = await client
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscription.id);
      if (error) throw error;
      toast({ title: "Subscription Cancelled", description: "Your subscription has been cancelled" });
      fetchSubscription();
    } catch (error) {
      console.error("Cancel error:", error);
      toast({ title: "Error", description: "Failed to cancel subscription", variant: "destructive" });
    }
  };

  const getPlanLimits = (planId: string) => {
    const limits: Record<string, { qrCodes: number; transactions: number; apiCalls: number }> = {
      basic: { qrCodes: 100, transactions: 5000, apiCalls: 50000 },
      premium: { qrCodes: 500, transactions: 25000, apiCalls: 200000 },
      enterprise: { qrCodes: -1, transactions: -1, apiCalls: -1 }, // unlimited
    };
    return limits[planId] || limits.basic;
  };

  return {
    subscription,
    billingHistory,
    loading,
    usage,
    subscribe,
    cancelSubscription,
    getPlanLimits,
    refetch: fetchSubscription,
  };
};
