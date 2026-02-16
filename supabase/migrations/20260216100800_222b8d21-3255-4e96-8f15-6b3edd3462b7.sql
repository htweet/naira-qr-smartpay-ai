
-- Fix the security definer view by making it a security invoker view
DROP VIEW IF EXISTS public.payment_gateways_safe;

CREATE VIEW public.payment_gateways_safe 
WITH (security_invoker = true) AS
SELECT 
  id,
  merchant_id,
  gateway_name,
  is_active,
  priority,
  created_at,
  updated_at,
  CASE WHEN api_key_encrypted IS NOT NULL AND api_key_encrypted != '' 
    THEN '••••••••' 
    ELSE NULL 
  END AS api_key_masked
FROM public.payment_gateways;
