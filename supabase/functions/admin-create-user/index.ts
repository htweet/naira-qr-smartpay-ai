import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !adminUser) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", adminUser.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Not authorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { email, password, user_type, full_name, business_name, phone } = body;

    // Validate inputs
    if (!email || !password || !user_type) {
      return new Response(
        JSON.stringify({ error: "email, password, and user_type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["merchant", "customer"].includes(user_type)) {
      return new Response(
        JSON.stringify({ error: "user_type must be 'merchant' or 'customer'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitize = (s: string, max: number) => String(s || "").trim().slice(0, max).replace(/[<>]/g, "");

    // Create auth user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: sanitize(email, 255),
      password,
      email_confirm: true,
      user_metadata: {
        user_type,
        business_name: sanitize(business_name || "", 200),
        full_name: sanitize(full_name || "", 200),
      },
    });

    if (createError || !newUser.user) {
      return new Response(
        JSON.stringify({ error: createError?.message || "Failed to create user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = newUser.user.id;

    // Assign role
    await supabase.from("user_roles").insert({
      user_id: userId,
      role: user_type,
    });

    // Create corresponding record
    if (user_type === "merchant") {
      await supabase.from("merchants").insert({
        user_id: userId,
        business_name: sanitize(business_name || email.split("@")[0], 200),
        business_email: sanitize(email, 255),
        business_phone: sanitize(phone || "", 20),
        status: "active",
      });
    } else {
      await supabase.from("customers").insert({
        user_id: userId,
        email: sanitize(email, 255),
        full_name: sanitize(full_name || "", 200),
        phone: sanitize(phone || "", 20),
        status: "active",
      });
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in admin-create-user:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
