-- Fixed Evidence Migration: Proper NULL handling and validation
-- Phase 1: Create improved conversion function with correct NULL handling
CREATE OR REPLACE FUNCTION convert_evidence_to_jsonb(evidence_text TEXT)
RETURNS JSONB AS $$
DECLARE
    lines TEXT[];
    line TEXT;
    result JSONB := '{}'::JSONB;
    temp_json JSONB;
BEGIN
    -- Handle NULL input properly - return NULL, not empty JSON
    IF evidence_text IS NULL OR trim(evidence_text) = '' THEN
        RETURN NULL;
    END IF;

    -- Try parsing as existing JSON first
    BEGIN
        RETURN evidence_text::JSONB;
    EXCEPTION WHEN OTHERS THEN
        -- Continue with conversion logic
    END;

    -- Cookie parsing with E'\n' escaping
    IF evidence_text ~* E'cookie.*=.*;\s*(secure|httponly|samesite)' THEN
        result := jsonb_build_object(
            'category', 'cookies',
            'raw_text', evidence_text,
            'parsed_data', jsonb_build_object(
                'has_secure', evidence_text ~* 'secure',
                'has_httponly', evidence_text ~* 'httponly',
                'has_samesite', evidence_text ~* 'samesite'
            )
        );
        RETURN result;
    END IF;

    -- Security header parsing with proper newline escaping
    IF evidence_text ~* E'(x-frame-options|content-security-policy|strict-transport-security|x-content-type-options)' THEN
        lines := string_to_array(evidence_text, E'\n');
        temp_json := '{}'::JSONB;
        
        FOREACH line IN ARRAY lines LOOP
            IF line ~* E'([^:]+):\s*(.+)' THEN
                -- Extract header name and value safely
                temp_json := temp_json || jsonb_build_object(
                    trim(split_part(line, ':', 1)),
                    trim(substring(line from position(':' in line) + 1))
                );
            END IF;
        END LOOP;
        
        result := jsonb_build_object(
            'category', 'headers',
            'raw_text', evidence_text,
            'parsed_headers', temp_json
        );
        RETURN result;
    END IF;

    -- URL/File detection
    IF evidence_text ~* E'https?://|\.env|\.git|\.config|wp-config\.php' THEN
        result := jsonb_build_object(
            'category', 'urls_files',
            'raw_text', evidence_text,
            'detected_files', ARRAY(
                SELECT DISTINCT unnest(regexp_split_to_array(evidence_text, E'\\s+'))
                WHERE unnest(regexp_split_to_array(evidence_text, E'\\s+')) ~* E'(https?://|\\.[a-z]{2,4}$)'
            )
        );
        RETURN result;
    END IF;

    -- Raw text fallback
    result := jsonb_build_object(
        'category', 'raw_text',
        'raw_text', evidence_text
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Phase 2: Add temporary evidence_jsonb column
ALTER TABLE scan_findings ADD COLUMN IF NOT EXISTS evidence_jsonb JSONB;

-- Phase 3: Perform batch conversion
UPDATE scan_findings 
SET evidence_jsonb = convert_evidence_to_jsonb(evidence);

-- Phase 4: Enhanced validation with correct NULL handling logic
DO $$
DECLARE
    total_rows INTEGER;
    null_evidence_rows INTEGER;
    converted_rows INTEGER;
    failed_conversions INTEGER;
    null_to_null_rows INTEGER;
    nonnull_to_nonnull_rows INTEGER;
    nonnull_to_null_rows INTEGER;
BEGIN
    -- Get comprehensive statistics
    SELECT COUNT(*) INTO total_rows FROM scan_findings;
    SELECT COUNT(*) INTO null_evidence_rows FROM scan_findings WHERE evidence IS NULL;
    SELECT COUNT(*) INTO converted_rows FROM scan_findings WHERE evidence_jsonb IS NOT NULL;
    
    -- Critical check: Only count actual conversion failures (non-NULL evidence → NULL evidence_jsonb)
    SELECT COUNT(*) INTO failed_conversions 
    FROM scan_findings 
    WHERE evidence IS NOT NULL AND evidence_jsonb IS NULL;
    
    -- Detailed breakdown for reporting
    SELECT COUNT(*) INTO null_to_null_rows 
    FROM scan_findings 
    WHERE evidence IS NULL AND evidence_jsonb IS NULL;
    
    SELECT COUNT(*) INTO nonnull_to_nonnull_rows 
    FROM scan_findings 
    WHERE evidence IS NOT NULL AND evidence_jsonb IS NOT NULL;
    
    SELECT COUNT(*) INTO nonnull_to_null_rows 
    FROM scan_findings 
    WHERE evidence IS NOT NULL AND evidence_jsonb IS NULL;

    -- Report detailed conversion statistics
    RAISE NOTICE 'EVIDENCE CONVERSION REPORT:';
    RAISE NOTICE '========================';
    RAISE NOTICE 'Total rows: %', total_rows;
    RAISE NOTICE 'NULL evidence → NULL evidence_jsonb: % (SUCCESS)', null_to_null_rows;
    RAISE NOTICE 'Non-NULL evidence → Non-NULL evidence_jsonb: % (SUCCESS)', nonnull_to_nonnull_rows;
    RAISE NOTICE 'Non-NULL evidence → NULL evidence_jsonb: % (FAILURE)', nonnull_to_null_rows;
    RAISE NOTICE '========================';
    
    -- Show evidence type breakdown after conversion
    RAISE NOTICE 'EVIDENCE TYPE BREAKDOWN:';
    FOR rec IN 
        SELECT 
            CASE 
                WHEN evidence IS NULL THEN 'NULL_evidence'
                WHEN evidence_jsonb IS NULL THEN 'FAILED_conversion' 
                WHEN evidence_jsonb->>'category' IS NOT NULL THEN evidence_jsonb->>'category'
                ELSE 'unknown_category'
            END as evidence_type,
            COUNT(*) as count
        FROM scan_findings 
        GROUP BY evidence_type
        ORDER BY count DESC
    LOOP
        RAISE NOTICE '% evidence: % rows', rec.evidence_type, rec.count;
    END LOOP;

    -- Abort if any actual conversion failures
    IF failed_conversions > 0 THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: % rows with non-NULL evidence failed to convert to JSONB', failed_conversions;
    END IF;

    -- Success validation
    IF (null_to_null_rows + nonnull_to_nonnull_rows) = total_rows THEN
        RAISE NOTICE 'SUCCESS: All conversions completed correctly!';
        RAISE NOTICE 'Expected NULLs preserved: %', null_to_null_rows;
        RAISE NOTICE 'Evidence successfully converted: %', nonnull_to_nonnull_rows;
    ELSE
        RAISE EXCEPTION 'VALIDATION FAILED: Conversion counts do not match total rows';
    END IF;
END $$;

-- Phase 5: Replace evidence column (preserving NULLs)
ALTER TABLE scan_findings DROP COLUMN evidence;
ALTER TABLE scan_findings RENAME COLUMN evidence_jsonb TO evidence;

-- Phase 6: Add GIN index for JSONB performance
CREATE INDEX IF NOT EXISTS idx_scan_findings_evidence_gin ON scan_findings USING GIN(evidence);

-- Phase 7: Add cvss_vector column
ALTER TABLE scan_findings ADD COLUMN IF NOT EXISTS cvss_vector TEXT;

-- Phase 8: Cleanup conversion function
DROP FUNCTION convert_evidence_to_jsonb(TEXT);

-- Final validation report
DO $$
DECLARE
    final_total INTEGER;
    final_null INTEGER;
    final_jsonb INTEGER;
BEGIN
    SELECT COUNT(*) INTO final_total FROM scan_findings;
    SELECT COUNT(*) INTO final_null FROM scan_findings WHERE evidence IS NULL;
    SELECT COUNT(*) INTO final_jsonb FROM scan_findings WHERE evidence IS NOT NULL;
    
    RAISE NOTICE 'FINAL MIGRATION REPORT:';
    RAISE NOTICE '======================';
    RAISE NOTICE 'Total rows: %', final_total;
    RAISE NOTICE 'NULL evidence (preserved): %', final_null;
    RAISE NOTICE 'JSONB evidence (converted): %', final_jsonb;
    RAISE NOTICE 'Migration completed successfully!';
END $$;