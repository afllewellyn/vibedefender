-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "scans_insert_public" ON public.scans;

-- Create a new INSERT policy that requires authentication for direct DB access
-- The edge function using service_role key will bypass RLS entirely for guest scans
CREATE POLICY "scans_insert_authenticated" ON public.scans
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);