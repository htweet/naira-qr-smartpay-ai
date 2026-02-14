import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FLW_BASE = "https://api.flutterwave.com/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const FLW_SECRET_KEY = Deno.env.get("FLW_SECRET_KEY");
  if (!FLW_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "FLW_SECRET_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    const { action, ...params } = await req.json();

    // Authenticate user
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

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    if (action === "create_qr_payment") {
      // Generate NQR QR code for payment
      const { amount, email, fullname, phone, description, tx_ref, merchant_id } = params;

      const payload = {
        tx_ref: tx_ref || `PayQR-${Date.now()}`,
        amount,
        currency: "NGN",
        email: email || "customer@payqr.com",
        fullname: fullname || "PayQR Customer",
        phone_number: phone || "",
        payment_type: "nibss-qr",
        is_nqr: "1",
      };

      const flwResponse = await fetch(`${FLW_BASE}/charges?type=qr`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const flwData = await flwResponse.json();

      if (!flwResponse.ok || flwData.status !== "success") {
        console.error("Flutterwave NQR error:", flwData);
        return new Response(
          JSON.stringify({ error: "Failed to generate NQR payment", details: flwData }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Store the transaction reference
      if (merchant_id) {
        await supabase.from("transactions").insert({
          merchant_id,
          amount,
          description: description || "NQR Payment",
          reference: payload.tx_ref,
          payment_method: "flutterwave_nqr",
          status: "pending",
          metadata: { flw_ref: flwData.data?.flw_ref, nqr: true },
        });
      }

      return new Response(JSON.stringify({ success: true, data: flwData.data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify_payment") {
      const { transaction_id } = params;

      const flwResponse = await fetch(`${FLW_BASE}/transactions/${transaction_id}/verify`, {
        headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
      });

      const flwData = await flwResponse.json();

      if (!flwResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Verification failed", details: flwData }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update transaction status if found
      if (flwData.data?.tx_ref) {
        await supabase
          .from("transactions")
          .update({
            status: flwData.data.status === "successful" ? "completed" : flwData.data.status,
            metadata: { flw_data: flwData.data },
          })
          .eq("reference", flwData.data.tx_ref);
      }

      return new Response(JSON.stringify({ success: true, data: flwData.data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_banks") {
      const flwResponse = await fetch(`${FLW_BASE}/banks/NG`, {
        headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
      });
      const flwData = await flwResponse.json();

      return new Response(JSON.stringify({ success: true, data: flwData.data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
