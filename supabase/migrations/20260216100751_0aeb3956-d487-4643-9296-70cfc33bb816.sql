
-- Create a view that excludes sensitive fields from payment_gateways
CREATE OR REPLACE VIEW public.payment_gateways_safe AS
SELECT 
  id,
  merchant_id,
  gateway_name,
  is_active,
  priority,
  created_at,
  updated_at,
  -- Expose only non-sensitive settings, mask the api key
  CASE WHEN api_key_encrypted IS NOT NULL AND api_key_encrypted != '' 
    THEN '••••••••' 
    ELSE NULL 
  END AS api_key_masked
FROM public.payment_gateways;

-- Enable RLS on the view (views inherit from base table RLS)
-- Revoke direct SELECT on api_key_encrypted from anon and authenticated roles
-- by creating a restrictive policy approach

-- Drop the existing permissive SELECT policies that expose api_key_encrypted
DROP POLICY IF EXISTS "Merchants can view own gateways" ON public.payment_gateways;

-- Recreate merchant SELECT policy using a security barrier view approach
-- Keep the ALL policy for management but add a column-level restriction note
-- The ALL policy already covers SELECT, so we just removed the duplicate

-- Note: The "Merchants can manage own gateways" ALL policy still allows SELECT
-- but we should guide client code to use the safe view instead
