-- =============================================
-- Phase 1: Create Missing Database Tables
-- =============================================

-- 1.1 QR Codes Table
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  qr_code_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'static' CHECK (type IN ('static', 'dynamic')),
  amount NUMERIC,
  description TEXT DEFAULT 'Payment Request',
  reference TEXT,
  gateway_id UUID,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  logo_enabled BOOLEAN DEFAULT false,
  eye_style TEXT DEFAULT 'square',
  pattern TEXT DEFAULT 'squares',
  frame_style TEXT DEFAULT 'none',
  error_correction TEXT DEFAULT 'M',
  scans INTEGER DEFAULT 0,
  payments INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on qr_codes
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for qr_codes
CREATE POLICY "Merchants can view own QR codes"
  ON public.qr_codes FOR SELECT
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Merchants can create own QR codes"
  ON public.qr_codes FOR INSERT
  WITH CHECK (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Merchants can update own QR codes"
  ON public.qr_codes FOR UPDATE
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Merchants can delete own QR codes"
  ON public.qr_codes FOR DELETE
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all QR codes"
  ON public.qr_codes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 1.2 User Behavior Analytics Table
CREATE TABLE public.user_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on user_behavior
ALTER TABLE public.user_behavior ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_behavior (public insert, admin read)
CREATE POLICY "Anyone can insert behavior events"
  ON public.user_behavior FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all behavior events"
  ON public.user_behavior FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 1.3 Conversion Events Table
CREATE TABLE public.conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  source TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on conversion_events
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversion_events
CREATE POLICY "Anyone can insert conversion events"
  ON public.conversion_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all conversion events"
  ON public.conversion_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 1.4 Payment Gateways Table
CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  gateway_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  api_key_encrypted TEXT,
  settings JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on payment_gateways
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_gateways
CREATE POLICY "Merchants can view own gateways"
  ON public.payment_gateways FOR SELECT
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Merchants can manage own gateways"
  ON public.payment_gateways FOR ALL
  USING (merchant_id IN (
    SELECT id FROM public.merchants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all gateways"
  ON public.payment_gateways FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at triggers
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;