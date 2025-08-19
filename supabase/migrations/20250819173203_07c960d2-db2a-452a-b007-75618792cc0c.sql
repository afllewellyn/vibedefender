-- Add access token and expiration to scans table
ALTER TABLE public.scans 
ADD COLUMN access_token UUID DEFAULT gen_random_uuid() UNIQUE,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '48 hours');

-- Update existing scans to have access tokens
UPDATE public.scans 
SET access_token = gen_random_uuid(), 
    token_expires_at = (now() + INTERVAL '48 hours')
WHERE access_token IS NULL;

-- Make access_token not nullable after updating existing records
ALTER TABLE public.scans ALTER COLUMN access_token SET NOT NULL;

-- Drop existing RLS policies for scans
DROP POLICY IF EXISTS "Users can view their own scans or guest scans" ON public.scans;

-- Create new RLS policies for scans
CREATE POLICY "Users can view their own scans" 
ON public.scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create scans" 
ON public.scans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own scans" 
ON public.scans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans" 
ON public.scans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop existing RLS policies for scan_findings
DROP POLICY IF EXISTS "Users can view findings for their scans or guest scans" ON public.scan_findings;

-- Create new RLS policies for scan_findings
CREATE POLICY "Users can view findings for their own scans" 
ON public.scan_findings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM scans 
  WHERE scans.id = scan_findings.scan_id 
  AND scans.user_id = auth.uid()
));

CREATE POLICY "Anyone can create scan findings" 
ON public.scan_findings 
FOR INSERT 
WITH CHECK (true);