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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { type, to, subject, data } = body;

    if (!to || !type) {
      return new Response(
        JSON.stringify({ error: "to and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitize = (s: string, max: number) => String(s || "").trim().slice(0, max).replace(/[<>]/g, "");
    const recipientEmail = sanitize(to, 255);
    
    let emailSubject = "";
    let emailHtml = "";

    switch (type) {
      case "invoice_sent":
        emailSubject = subject || `Invoice ${data?.invoice_number || ""} from PayQR`;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">PayQR Invoice</h1>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p>Hello ${sanitize(data?.recipient_name || "Customer", 100)},</p>
              <p>You have received a new invoice <strong>${sanitize(data?.invoice_number || "", 50)}</strong>.</p>
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Amount:</strong> ₦${Number(data?.amount || 0).toLocaleString()}</p>
                ${data?.due_date ? `<p style="margin: 4px 0;"><strong>Due Date:</strong> ${sanitize(data.due_date, 30)}</p>` : ""}
              </div>
              <p>Please process this invoice at your earliest convenience.</p>
              <p style="color: #6b7280; font-size: 12px;">This email was sent by PayQR Payment Platform.</p>
            </div>
          </div>
        `;
        break;

      case "payment_confirmation":
        emailSubject = subject || "Payment Confirmed - PayQR";
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">✓ Payment Confirmed</h1>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p>Your payment of <strong>₦${Number(data?.amount || 0).toLocaleString()}</strong> has been confirmed.</p>
              <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #bbf7d0;">
                <p style="margin: 4px 0;"><strong>Reference:</strong> ${sanitize(data?.reference || "N/A", 50)}</p>
                <p style="margin: 4px 0;"><strong>Status:</strong> Completed</p>
              </div>
              <p style="color: #6b7280; font-size: 12px;">PayQR Payment Platform</p>
            </div>
          </div>
        `;
        break;

      case "dispute_update":
        emailSubject = subject || "Dispute Update - PayQR";
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">Dispute Update</h1>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p>There has been an update to your dispute.</p>
              <div style="background: #fffbeb; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #fde68a;">
                <p style="margin: 4px 0;"><strong>Reason:</strong> ${sanitize(data?.reason || "N/A", 200)}</p>
                <p style="margin: 4px 0;"><strong>Amount:</strong> ₦${Number(data?.amount || 0).toLocaleString()}</p>
                <p style="margin: 4px 0;"><strong>Status:</strong> ${sanitize(data?.status || "open", 20)}</p>
                ${data?.response ? `<p style="margin: 4px 0;"><strong>Response:</strong> ${sanitize(data.response, 500)}</p>` : ""}
              </div>
              <p style="color: #6b7280; font-size: 12px;">PayQR Payment Platform</p>
            </div>
          </div>
        `;
        break;

      default:
        emailSubject = subject || "Notification from PayQR";
        emailHtml = `<p>${sanitize(data?.message || "You have a new notification.", 1000)}</p>`;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "PayQR <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-notification:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
