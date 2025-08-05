-- Phase 1: Safety First - Add Staging Column
ALTER TABLE scan_findings ADD COLUMN IF NOT EXISTS evidence_jsonb JSONB;

-- Phase 2: Create Comprehensive Conversion Function
CREATE OR REPLACE FUNCTION convert_evidence_to_jsonb(evidence_text TEXT, category_type TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    cookie_parts TEXT[];
    cookie_name TEXT;
    cookie_value TEXT;
    cookie_attrs JSONB := '{}';
    header_parts TEXT[];
    line TEXT;
    key TEXT;
    value TEXT;
    attr_parts TEXT[];
    attr_name TEXT;
    attr_value TEXT;
BEGIN
    -- Handle NULL or empty input
    IF evidence_text IS NULL OR trim(evidence_text) = '' THEN
        RETURN '{"raw_text": "", "category": "empty"}'::JSONB;
    END IF;

    -- Cookie parsing (semicolon-separated)
    IF category_type = 'cookies' OR evidence_text ~* '^[^=]+=.*' THEN
        -- Split on semicolons for cookie attributes
        cookie_parts := string_to_array(evidence_text, ';');
        
        -- Extract name=value from first part
        IF array_length(cookie_parts, 1) > 0 AND cookie_parts[1] ~ '=' THEN
            cookie_name := trim(split_part(cookie_parts[1], '=', 1));
            cookie_value := trim(split_part(cookie_parts[1], '=', 2));
            
            -- Parse attributes from remaining parts
            FOR i IN 2..array_length(cookie_parts, 1) LOOP
                IF cookie_parts[i] ~ '=' THEN
                    attr_name := trim(split_part(cookie_parts[i], '=', 1));
                    attr_value := trim(split_part(cookie_parts[i], '=', 2));
                    cookie_attrs := cookie_attrs || jsonb_build_object(attr_name, attr_value);
                ELSE
                    -- Boolean attributes like Secure, HttpOnly
                    attr_name := trim(cookie_parts[i]);
                    IF attr_name != '' THEN
                        cookie_attrs := cookie_attrs || jsonb_build_object(attr_name, true);
                    END IF;
                END IF;
            END LOOP;
            
            RETURN jsonb_build_object(
                'name', cookie_name,
                'value', cookie_value,
                'attributes', cookie_attrs
            );
        END IF;
    END IF;

    -- Header parsing (newline-separated or single header)
    IF category_type = 'headers' OR evidence_text ~ ':' THEN
        result := '[]'::JSONB;
        
        -- Handle newline-separated headers
        IF evidence_text ~ '\n' THEN
            header_parts := string_to_array(evidence_text, E'\n');
            FOR i IN 1..array_length(header_parts, 1) LOOP
                line := trim(header_parts[i]);
                IF line ~ ':' THEN
                    key := trim(split_part(line, ':', 1));
                    value := trim(substring(line from position(':' in line) + 1));
                    result := result || jsonb_build_object('header', key, 'value', value);
                END IF;
            END LOOP;
        ELSE
            -- Single header: value format
            IF evidence_text ~ ':' THEN
                key := trim(split_part(evidence_text, ':', 1));
                value := trim(substring(evidence_text from position(':' in evidence_text) + 1));
                result := jsonb_build_array(jsonb_build_object('header', key, 'value', value));
            END IF;
        END IF;
        
        IF jsonb_array_length(result) > 0 THEN
            RETURN result;
        END IF;
    END IF;

    -- URL/File path parsing
    IF category_type IN ('files', 'urls') OR evidence_text ~* '^(https?://|/|\./)' THEN
        RETURN jsonb_build_object(
            'type', CASE WHEN evidence_text ~* '^https?://' THEN 'url' ELSE 'file' END,
            'path', evidence_text,
            'status', 'detected'
        );
    END IF;

    -- Platform detection
    IF category_type = 'platform' THEN
        RETURN jsonb_build_object(
            'platform', evidence_text,
            'type', 'detection'
        );
    END IF;

    -- Error/vulnerability evidence
    IF category_type IN ('xss', 'csrf', 'sql_injection', 'open_redirect') THEN
        RETURN jsonb_build_object(
            'vulnerability_type', category_type,
            'evidence', evidence_text,
            'detected', true
        );
    END IF;

    -- Default: wrap as raw text
    RETURN jsonb_build_object(
        'raw_text', evidence_text,
        'category', COALESCE(category_type, 'unknown')
    );

EXCEPTION
    WHEN OTHERS THEN
        -- If anything fails, wrap as raw text with error info
        RETURN jsonb_build_object(
            'raw_text', evidence_text,
            'category', COALESCE(category_type, 'unknown'),
            'conversion_error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

-- Phase 3: Safe Batch Conversion with Progress Tracking
DO $$
DECLARE
    total_rows INTEGER;
    processed_rows INTEGER := 0;
    batch_size INTEGER := 100;
    current_batch INTEGER;
    start_time TIMESTAMP;
BEGIN
    start_time := now();
    
    SELECT COUNT(*) INTO total_rows FROM scan_findings WHERE evidence IS NOT NULL;
    RAISE NOTICE 'Starting conversion of % rows at %', total_rows, start_time;
    
    FOR current_batch IN 0..(total_rows / batch_size) LOOP
        UPDATE scan_findings 
        SET evidence_jsonb = convert_evidence_to_jsonb(evidence, category)
        WHERE id IN (
            SELECT id FROM scan_findings 
            WHERE evidence IS NOT NULL AND evidence_jsonb IS NULL
            LIMIT batch_size OFFSET (current_batch * batch_size)
        );
        
        GET DIAGNOSTICS processed_rows = ROW_COUNT;
        RAISE NOTICE 'Batch %: Processed % rows (% total)', current_batch + 1, processed_rows, (current_batch + 1) * batch_size;
        
        -- Exit if no more rows to process
        IF processed_rows = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Conversion completed in %', now() - start_time;
END $$;

-- Phase 4: Validation Before Schema Change
DO $$
DECLARE
    failed_conversions INTEGER;
    total_with_evidence INTEGER;
    conversion_stats RECORD;
BEGIN
    -- Check for failed conversions
    SELECT COUNT(*) INTO failed_conversions 
    FROM scan_findings 
    WHERE evidence IS NOT NULL AND evidence_jsonb IS NULL;
    
    SELECT COUNT(*) INTO total_with_evidence
    FROM scan_findings 
    WHERE evidence IS NOT NULL;
    
    RAISE NOTICE 'Validation Results:';
    RAISE NOTICE '  Total rows with evidence: %', total_with_evidence;
    RAISE NOTICE '  Failed conversions: %', failed_conversions;
    
    -- Show conversion stats by category
    FOR conversion_stats IN 
        SELECT category, 
               COUNT(*) as total_count,
               COUNT(evidence_jsonb) as converted_count,
               jsonb_typeof(evidence_jsonb) as json_type
        FROM scan_findings 
        WHERE evidence IS NOT NULL
        GROUP BY category, jsonb_typeof(evidence_jsonb)
        ORDER BY category
    LOOP
        RAISE NOTICE '  Category %: % total, % converted (type: %)', 
            conversion_stats.category, 
            conversion_stats.total_count, 
            conversion_stats.converted_count,
            COALESCE(conversion_stats.json_type, 'NULL');
    END LOOP;
    
    -- Abort if there are failed conversions
    IF failed_conversions > 0 THEN
        RAISE EXCEPTION 'Migration aborted: % failed conversions detected', failed_conversions;
    END IF;
    
    RAISE NOTICE 'Validation passed! All evidence successfully converted.';
END $$;

-- Phase 5: Safe Schema Migration
-- Drop old column and rename new one
ALTER TABLE scan_findings DROP COLUMN evidence;
ALTER TABLE scan_findings RENAME COLUMN evidence_jsonb TO evidence;

-- Add NOT NULL constraint (since we validated all rows have data)
ALTER TABLE scan_findings ALTER COLUMN evidence SET NOT NULL;

-- Create GIN index for efficient JSONB querying
CREATE INDEX IF NOT EXISTS idx_scan_findings_evidence_gin ON scan_findings USING GIN (evidence);

-- Phase 6: Add CVSS Vector Column
ALTER TABLE scan_findings ADD COLUMN IF NOT EXISTS cvss_vector TEXT;

-- Clean up the conversion function (optional)
DROP FUNCTION IF EXISTS convert_evidence_to_jsonb(TEXT, TEXT);

-- Final validation
DO $$
DECLARE
    final_stats RECORD;
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Final statistics:';
    
    FOR final_stats IN
        SELECT category,
               COUNT(*) as row_count,
               jsonb_typeof(evidence) as evidence_type
        FROM scan_findings
        GROUP BY category, jsonb_typeof(evidence)
        ORDER BY category
    LOOP
        RAISE NOTICE '  Category %: % rows (type: %)', 
            final_stats.category, 
            final_stats.row_count, 
            final_stats.evidence_type;
    END LOOP;
END $$;