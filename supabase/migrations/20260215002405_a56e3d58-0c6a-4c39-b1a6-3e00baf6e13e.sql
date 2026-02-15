
-- Add recipient fields to invoices
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS recipient_name text;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS recipient_email text;

-- Add merchant response fields to disputes
ALTER TABLE public.disputes ADD COLUMN IF NOT EXISTS merchant_response text;
ALTER TABLE public.disputes ADD COLUMN IF NOT EXISTS merchant_response_at timestamp with time zone;

-- Add profile fields for address and notification preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email_payments": true, "email_disputes": true, "email_invoices": true}'::jsonb;

-- Add UPDATE policy for disputes so merchants can respond
CREATE POLICY "Merchants can update own disputes"
ON public.disputes
FOR UPDATE
USING (merchant_id IN (SELECT merchants.id FROM merchants WHERE merchants.user_id = auth.uid()));
