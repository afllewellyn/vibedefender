-- Create RPC function to check guest scan rate limit
CREATE OR REPLACE FUNCTION public.check_guest_scan_limit(check_ip TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  scan_count INTEGER;
BEGIN
  -- Count scans from this IP in the last 24 hours (guest scans only)
  SELECT COUNT(*) INTO scan_count
  FROM scans
  WHERE metadata->>'client_ip' = check_ip
    AND created_at > NOW() - INTERVAL '24 hours'
    AND user_id IS NULL;
  
  -- Return true if under the limit (5 scans per 24 hours)
  RETURN scan_count < 5;
END;
$$;