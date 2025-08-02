-- Add new fields to scan_findings table for CVSS scoring and enhanced data
ALTER TABLE public.scan_findings 
ADD COLUMN cvss_score numeric,
ADD COLUMN owasp_category text,
ADD COLUMN evidence text;