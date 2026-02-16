
-- System settings table for admin
CREATE TABLE public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage system settings"
  ON public.system_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read system settings"
  ON public.system_settings FOR SELECT
  USING (true);

-- Seed default settings
INSERT INTO public.system_settings (key, value) VALUES
  ('general', '{"maintenance_mode": false, "session_timeout": 30, "platform_name": "PayQR", "support_email": "support@payqr.com"}'),
  ('security', '{"auto_approve_transactions": false, "max_transaction_limit": 1000000, "fraud_detection_level": "medium", "two_factor_enabled": false}'),
  ('notifications', '{"email_notifications": true, "sms_notifications": false, "admin_alerts": true, "merchant_alerts": true}'),
  ('features', '{"qr_payments": true, "invoicing": true, "recurring_payments": true, "split_payments": true, "escrow": true, "disputes": true, "currency_conversion": true, "ai_analytics": true}');

-- Admin update policy for merchants (needed for admin to update merchant status)
CREATE POLICY "Admins can update merchants"
  ON public.merchants FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin update policy for customers
CREATE POLICY "Admins can update customers"
  ON public.customers FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin insert policy for customers
CREATE POLICY "Admins can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin insert policy for merchants
CREATE POLICY "Admins can insert merchants"
  ON public.merchants FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage transactions (update status)
CREATE POLICY "Admins can update transactions"
  ON public.transactions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin view profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
