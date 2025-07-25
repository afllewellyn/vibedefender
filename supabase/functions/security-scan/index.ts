import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityCheck {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  impact_score: number;
  evidence?: string;
  confidence: 'high' | 'medium' | 'low';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scanId } = await req.json();
    
    if (!scanId) {
      return new Response(JSON.stringify({ error: 'scanId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get scan details
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError || !scan) {
      console.error('Failed to fetch scan:', scanError);
      return new Response(JSON.stringify({ error: 'Scan not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update scan status to running
    await supabase
      .from('scans')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', scanId);

    console.log(`Starting security scan for: ${scan.url}`);

    const findings: SecurityCheck[] = [];
    let totalScore = 100;

    try {
      // Run security checks
      const securityHeadersResults = await checkSecurityHeaders(scan.url);
      findings.push(...securityHeadersResults.findings);
      totalScore -= securityHeadersResults.deduction;

      const exposedFilesResults = await checkExposedFiles(scan.url);
      findings.push(...exposedFilesResults.findings);
      totalScore -= exposedFilesResults.deduction;

      const platformResults = await detectPlatform(scan.url);
      findings.push(...platformResults.findings);
      totalScore -= platformResults.deduction;

      const xssResults = await checkXSS(scan.url);
      findings.push(...xssResults.findings);
      totalScore -= xssResults.deduction;

      const csrfResults = await checkCSRF(scan.url);
      findings.push(...csrfResults.findings);
      totalScore -= csrfResults.deduction;

      // Ensure score doesn't go below 0
      totalScore = Math.max(0, totalScore);

      // Save findings to database
      for (const finding of findings) {
        await supabase
          .from('scan_findings')
          .insert({
            scan_id: scanId,
            title: finding.title,
            description: finding.description,
            severity: finding.severity,
            category: finding.category,
            recommendation: finding.recommendation,
            impact_score: finding.impact_score,
            element_selector: finding.evidence
          });
      }

      // Update scan with results
      await supabase
        .from('scans')
        .update({
          status: 'completed',
          score: totalScore,
          completed_at: new Date().toISOString()
        })
        .eq('id', scanId);

      console.log(`Scan completed. Score: ${totalScore}, Findings: ${findings.length}`);

      return new Response(JSON.stringify({ 
        success: true, 
        score: totalScore,
        findings: findings.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Scan execution error:', error);
      
      // Update scan status to failed
      await supabase
        .from('scans')
        .update({
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', scanId);

      throw error;
    }

  } catch (error) {
    console.error('Security scan error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Security Headers Check
async function checkSecurityHeaders(url: string) {
  const findings: SecurityCheck[] = [];
  let deduction = 0;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;

    // Check for HSTS
    if (!headers.get('strict-transport-security')) {
      findings.push({
        id: 'missing-hsts',
        title: 'Missing HTTP Strict Transport Security (HSTS)',
        description: 'The site does not enforce HTTPS connections',
        severity: 'high',
        category: 'Security Headers',
        recommendation: 'Add the Strict-Transport-Security header to enforce HTTPS',
        impact_score: 15,
        confidence: 'high'
      });
      deduction += 15;
    }

    // Check for CSP
    if (!headers.get('content-security-policy')) {
      findings.push({
        id: 'missing-csp',
        title: 'Missing Content Security Policy',
        description: 'No Content Security Policy header found',
        severity: 'medium',
        category: 'Security Headers',
        recommendation: 'Implement a Content Security Policy to prevent XSS attacks',
        impact_score: 10,
        confidence: 'high'
      });
      deduction += 10;
    }

    // Check for X-Frame-Options
    if (!headers.get('x-frame-options')) {
      findings.push({
        id: 'missing-frame-options',
        title: 'Missing X-Frame-Options Header',
        description: 'Site may be vulnerable to clickjacking attacks',
        severity: 'medium',
        category: 'Security Headers',
        recommendation: 'Add X-Frame-Options header to prevent framing',
        impact_score: 8,
        confidence: 'high'
      });
      deduction += 8;
    }

  } catch (error) {
    console.error('Error checking security headers:', error);
  }

  return { findings, deduction };
}

// Exposed Files Check
async function checkExposedFiles(url: string) {
  const findings: SecurityCheck[] = [];
  let deduction = 0;

  const sensitiveFiles = [
    '/.env',
    '/.git/config',
    '/config.json',
    '/wp-config.php',
    '/.htaccess',
    '/admin',
    '/phpmyadmin'
  ];

  for (const file of sensitiveFiles) {
    try {
      const response = await fetch(`${url}${file}`);
      if (response.status === 200) {
        findings.push({
          id: `exposed-${file.replace(/[^a-zA-Z0-9]/g, '-')}`,
          title: `Exposed Sensitive File: ${file}`,
          description: `Sensitive file ${file} is publicly accessible`,
          severity: 'critical',
          category: 'Exposed Files',
          recommendation: `Restrict access to ${file} or remove it from the web root`,
          impact_score: 25,
          evidence: `File accessible at: ${url}${file}`,
          confidence: 'high'
        });
        deduction += 25;
      }
    } catch (error) {
      // File not accessible, which is good
    }
  }

  return { findings, deduction };
}

// Platform Detection
async function detectPlatform(url: string) {
  const findings: SecurityCheck[] = [];
  let deduction = 0;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const headers = response.headers;

    // WordPress detection
    if (html.includes('wp-content') || headers.get('x-powered-by')?.includes('WordPress')) {
      // Check for common WordPress vulnerabilities
      const wpVersionMatch = html.match(/wp-includes.*?ver=([0-9.]+)/);
      if (wpVersionMatch) {
        findings.push({
          id: 'wordpress-version-exposed',
          title: 'WordPress Version Exposed',
          description: `WordPress version ${wpVersionMatch[1]} is exposed in HTML`,
          severity: 'low',
          category: 'Platform Security',
          recommendation: 'Hide WordPress version information to reduce attack surface',
          impact_score: 3,
          evidence: wpVersionMatch[0],
          confidence: 'high'
        });
        deduction += 3;
      }
    }

    // Check for server information disclosure
    const serverHeader = headers.get('server');
    if (serverHeader && !serverHeader.includes('cloudflare')) {
      findings.push({
        id: 'server-disclosure',
        title: 'Server Information Disclosure',
        description: `Server information exposed: ${serverHeader}`,
        severity: 'low',
        category: 'Information Disclosure',
        recommendation: 'Configure server to hide version information',
        impact_score: 2,
        evidence: `Server: ${serverHeader}`,
        confidence: 'high'
      });
      deduction += 2;
    }

  } catch (error) {
    console.error('Error in platform detection:', error);
  }

  return { findings, deduction };
}

// Basic XSS Check
async function checkXSS(url: string) {
  const findings: SecurityCheck[] = [];
  let deduction = 0;

  try {
    // Test for reflected XSS with a safe payload
    const testPayload = '<script>alert("xss")</script>';
    const testUrl = `${url}?q=${encodeURIComponent(testPayload)}`;
    
    const response = await fetch(testUrl);
    const html = await response.text();

    if (html.includes(testPayload)) {
      findings.push({
        id: 'reflected-xss',
        title: 'Potential Reflected XSS Vulnerability',
        description: 'User input appears to be reflected without proper sanitization',
        severity: 'high',
        category: 'Cross-Site Scripting',
        recommendation: 'Implement proper input validation and output encoding',
        impact_score: 20,
        confidence: 'medium'
      });
      deduction += 20;
    }

  } catch (error) {
    console.error('Error checking XSS:', error);
  }

  return { findings, deduction };
}

// CSRF Check
async function checkCSRF(url: string) {
  const findings: SecurityCheck[] = [];
  let deduction = 0;

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Look for forms without CSRF tokens
    const formMatches = html.match(/<form[^>]*>/gi);
    if (formMatches) {
      const hasCSRFToken = html.includes('csrf') || html.includes('_token');
      if (!hasCSRFToken) {
        findings.push({
          id: 'missing-csrf',
          title: 'Forms May Lack CSRF Protection',
          description: 'Forms detected but no CSRF tokens found',
          severity: 'medium',
          category: 'Cross-Site Request Forgery',
          recommendation: 'Implement CSRF tokens for all state-changing forms',
          impact_score: 12,
          confidence: 'medium'
        });
        deduction += 12;
      }
    }

  } catch (error) {
    console.error('Error checking CSRF:', error);
  }

  return { findings, deduction };
}