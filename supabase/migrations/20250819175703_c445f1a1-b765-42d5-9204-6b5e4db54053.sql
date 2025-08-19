-- Add access token and expiration to scans table
ALTER TABLE public.scans 
ADD COLUMN IF NOT EXISTS access_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '48 hours');

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'scans_access_token_key') THEN
        ALTER TABLE public.scans ADD CONSTRAINT scans_access_token_key UNIQUE (access_token);
    END IF;
END $$;

-- Update existing scans to have access tokens
UPDATE public.scans 
SET access_token = gen_random_uuid(), 
    token_expires_at = (now() + INTERVAL '48 hours')
WHERE access_token IS NULL;

-- Make access_token not nullable after updating existing records
ALTER TABLE public.scans ALTER COLUMN access_token SET NOT NULL;

-- Drop all existing RLS policies for scans
DROP POLICY IF EXISTS "Users can view their own scans or guest scans" ON public.scans;
DROP POLICY IF EXISTS "Anyone can create scans" ON public.scans;
DROP POLICY IF EXISTS "Users can update their own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can delete their own scans" ON public.scans;

-- Create new RLS policies for scans
CREATE POLICY "scans_select_own" 
ON public.scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "scans_insert_public" 
ON public.scans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "scans_update_own" 
ON public.scans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "scans_delete_own" 
ON public.scans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop all existing RLS policies for scan_findings
DROP POLICY IF EXISTS "Users can view findings for their scans or guest scans" ON public.scan_findings;
DROP POLICY IF EXISTS "Anyone can create scan findings" ON public.scan_findings;

-- Create new RLS policies for scan_findings
CREATE POLICY "findings_select_own_scans" 
ON public.scan_findings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM scans 
  WHERE scans.id = scan_findings.scan_id 
  AND scans.user_id = auth.uid()
));

CREATE POLICY "findings_insert_public" 
ON public.scan_findings 
FOR INSERT 
WITH CHECK (true);