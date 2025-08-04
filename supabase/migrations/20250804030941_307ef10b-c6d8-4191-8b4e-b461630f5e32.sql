-- Add missing database fields for enhanced scanning methodology
ALTER TABLE scan_findings ADD COLUMN IF NOT EXISTS cvss_vector TEXT;
ALTER TABLE scan_findings ALTER COLUMN evidence TYPE JSONB USING evidence::JSONB;