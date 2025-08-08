-- Add metadata to scans and contextual_cvss to scan_findings
-- Ensure existing data remains valid by providing defaults

-- Add metadata JSONB column to scans to store context, bonuses, and disclaimers
ALTER TABLE public.scans
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add contextual_cvss to scan_findings to store adjusted severity per context
ALTER TABLE public.scan_findings
ADD COLUMN IF NOT EXISTS contextual_cvss NUMERIC;
