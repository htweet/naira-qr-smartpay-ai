import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FLW_BASE = "https://api.flutterwave.com/v3";

// Input validation helpers
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

function sanitizeString(str: string, maxLength: number): string {
  return String(str).trim().slice(0, maxLength).replace(/[<>]/g, "");
}

function validateAmount(amount: unknown): { valid: boolean; value?: number; error?: string } {
  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) return { valid: false, error: "Amount must be a positive number" };
  if (num > 10_000_000) return { valid: false, error: "Amount exceeds maximum limit (10,000,000)" };
  if (num < 1) return { valid: false, error: "Amount must be at least 1" };
  return { valid: true, value: Math.round(num * 100) / 100 };
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]{0,20}$/.test(phone);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const FLW_SECRET_KEY = Deno.env.get("FLW_SECRET_KEY");
  if (!FLW_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Payment service is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    const body = await req.json();
    const { action, ...params } = body;

    if (!action || typeof action !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      const { amount, email, fullname, phone, description, tx_ref, merchant_id } = params;

      // Validate amount (required)
      const amountResult = validateAmount(amount);
      if (!amountResult.valid) {
        return new Response(JSON.stringify({ error: amountResult.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate email if provided
      if (email && !validateEmail(email)) {
        return new Response(JSON.stringify({ error: "Invalid email format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate phone if provided
      if (phone && !validatePhone(phone)) {
        return new Response(JSON.stringify({ error: "Invalid phone number format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate merchant_id belongs to authenticated user
      if (merchant_id) {
        const { data: merchant, error: merchantErr } = await supabase
          .from("merchants")
          .select("id")
          .eq("id", merchant_id)
          .eq("user_id", userId)
          .maybeSingle();

        if (merchantErr || !merchant) {
          return new Response(JSON.stringify({ error: "Invalid or unauthorized merchant" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      // Sanitize string inputs
      const safeFullname = fullname ? sanitizeString(fullname, 100) : "PayQR Customer";
      const safeDescription = description ? sanitizeString(description, 200) : "NQR Payment";
      const safeEmail = email ? sanitizeString(email, 255) : "customer@payqr.com";
      const safePhone = phone ? sanitizeString(phone, 20) : "";
      const safeTxRef = tx_ref ? sanitizeString(tx_ref, 50) : `PayQR-${Date.now()}`;

      const payload = {
        tx_ref: safeTxRef,
        amount: amountResult.value,
        currency: "NGN",
        email: safeEmail,
        fullname: safeFullname,
        phone_number: safePhone,
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
          JSON.stringify({ error: "Failed to generate NQR payment" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Store the transaction reference
      if (merchant_id) {
        await supabase.from("transactions").insert({
          merchant_id,
          amount: amountResult.value,
          description: safeDescription,
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

      // Validate transaction_id
      if (!transaction_id || typeof transaction_id !== "string" || transaction_id.length > 100) {
        return new Response(JSON.stringify({ error: "Invalid transaction ID" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Only allow alphanumeric, hyphens, underscores
      if (!/^[\w\-]+$/.test(transaction_id)) {
        return new Response(JSON.stringify({ error: "Invalid transaction ID format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const flwResponse = await fetch(`${FLW_BASE}/transactions/${encodeURIComponent(transaction_id)}/verify`, {
        headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
      });

      const flwData = await flwResponse.json();

      if (!flwResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Verification failed" }),
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
      JSON.stringify({ error: "An internal error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
