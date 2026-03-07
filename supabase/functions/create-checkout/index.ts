import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FLW_BASE = "https://api.flutterwave.com/v3";

const PLANS: Record<string, { name: string; amount: number }> = {
  basic: { name: "Basic Plan", amount: 4999 },
  premium: { name: "Premium Plan", amount: 9999 },
  enterprise: { name: "Enterprise Plan", amount: 29999 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const FLW_SECRET_KEY = Deno.env.get("FLW_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    const body = await req.json();
    const { plan_id, email, redirect_url } = body;

    if (!plan_id || !PLANS[plan_id]) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plan = PLANS[plan_id];
    const txRef = `SUB-${plan_id}-${user.id.slice(0, 8)}-${Date.now()}`;
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Create subscription directly (demo mode or when Flutterwave processes)
    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      plan_id,
      amount: plan.amount,
      currency: "NGN",
      interval: "monthly",
      status: "active",
      flutterwave_tx_ref: txRef,
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd,
    }, { onConflict: "user_id" });

    await supabase.from("billing_history").insert({
      user_id: user.id,
      amount: plan.amount,
      currency: "NGN",
      status: "paid",
      description: `${plan.name} - Monthly Subscription`,
      payment_reference: txRef,
      paid_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, plan_id, message: "Subscription activated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
