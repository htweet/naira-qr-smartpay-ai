-- Enable realtime for qr_codes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.qr_codes;

-- Add multi-currency support columns to transactions
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS original_currency TEXT DEFAULT 'NGN',
ADD COLUMN IF NOT EXISTS original_amount NUMERIC,
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC DEFAULT 1.0;

-- Create invoices table for invoice generation feature
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'NGN',
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  recurring BOOLEAN DEFAULT false,
  recurring_interval TEXT CHECK (recurring_interval IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recurring payments table
CREATE TABLE IF NOT EXISTS public.recurring_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  interval TEXT NOT NULL CHECK (interval IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  next_payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'completed')),
  total_payments INTEGER DEFAULT 0,
  max_payments INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create split payments table for advanced payment features
CREATE TABLE IF NOT EXISTS public.split_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  recipient_merchant_id UUID REFERENCES public.merchants(id),
  recipient_account TEXT,
  recipient_bank TEXT,
  amount NUMERIC NOT NULL,
  percentage NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create escrow table
CREATE TABLE IF NOT EXISTS public.escrow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'held' CHECK (status IN ('held', 'released', 'disputed', 'refunded')),
  release_conditions TEXT,
  release_date TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  dispute_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disputes table
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  reason TEXT NOT NULL CHECK (reason IN ('fraud', 'not_received', 'not_as_described', 'duplicate', 'other')),
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved_merchant', 'resolved_customer', 'closed')),
  amount NUMERIC NOT NULL,
  evidence JSONB DEFAULT '[]'::jsonb,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create currency_rates table for multi-currency
CREATE TABLE IF NOT EXISTS public.currency_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'NGN',
  target_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(base_currency, target_currency)
);

-- Insert default currency rates
INSERT INTO public.currency_rates (base_currency, target_currency, rate) VALUES
  ('NGN', 'USD', 0.00065),
  ('NGN', 'EUR', 0.00059),
  ('NGN', 'GBP', 0.00051),
  ('NGN', 'GHS', 0.0078),
  ('NGN', 'KES', 0.083),
  ('USD', 'NGN', 1550.00),
  ('EUR', 'NGN', 1700.00),
  ('GBP', 'NGN', 1950.00)
ON CONFLICT (base_currency, target_currency) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.split_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- RLS policies for invoices
CREATE POLICY "Merchants can manage own invoices" ON public.invoices
  FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all invoices" ON public.invoices
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for recurring_payments
CREATE POLICY "Merchants can manage own recurring payments" ON public.recurring_payments
  FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all recurring payments" ON public.recurring_payments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for split_payments
CREATE POLICY "Merchants can view own split payments" ON public.split_payments
  FOR SELECT USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()) OR
    recipient_merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

CREATE POLICY "Merchants can create split payments" ON public.split_payments
  FOR INSERT WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all split payments" ON public.split_payments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for escrow
CREATE POLICY "Merchants can manage own escrow" ON public.escrow
  FOR ALL USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all escrow" ON public.escrow
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for disputes
CREATE POLICY "Merchants can view own disputes" ON public.disputes
  FOR SELECT USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can create disputes" ON public.disputes
  FOR INSERT WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all disputes" ON public.disputes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for currency_rates (read-only for all)
CREATE POLICY "Anyone can view currency rates" ON public.currency_rates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage currency rates" ON public.currency_rates
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers for new tables
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_recurring_payments_updated_at BEFORE UPDATE ON public.recurring_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_escrow_updated_at BEFORE UPDATE ON public.escrow
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recurring_payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disputes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.escrow;