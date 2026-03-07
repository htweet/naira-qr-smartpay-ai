
-- Replace overly permissive merchant SELECT with a scoped one
DROP POLICY IF EXISTS "Authenticated can view merchant names" ON public.merchants;

-- Allow authenticated users to view only basic merchant info (needed for customer transaction views)
CREATE POLICY "Authenticated users can view merchants" ON public.merchants
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin')
    OR id IN (
      SELECT merchant_id FROM public.transactions WHERE customer_id IN (
        SELECT id FROM public.customers WHERE user_id = auth.uid()
      )
    )
    OR id IN (
      SELECT merchant_id FROM public.qr_codes
    )
  );
