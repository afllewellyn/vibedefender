-- Remove the public INSERT policy from scan_findings
-- This ensures only the service role (used by edge functions) can insert findings
DROP POLICY IF EXISTS findings_insert_public ON public.scan_findings;

-- Verify RLS is still enabled (it should be)
-- This ensures authenticated users can still read their own scan findings via findings_select_own_scans policy