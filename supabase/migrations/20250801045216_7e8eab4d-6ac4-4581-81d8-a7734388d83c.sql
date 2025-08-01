-- Add reference_links column to scan_findings table for help documentation
ALTER TABLE public.scan_findings 
ADD COLUMN reference_links TEXT[];

-- Add a comment to describe the column
COMMENT ON COLUMN public.scan_findings.reference_links IS 'Array of helpful documentation links for fixing the security issue';