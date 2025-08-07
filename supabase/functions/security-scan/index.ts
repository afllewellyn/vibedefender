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
  reference_links?: string[];
  cvss_score: number;
  owasp_category: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scanId } = await req.json();
    console.log('[security-scan] Edge function invoked with scanId:', scanId);
    
    if (!scanId) {
      console.error('[security-scan] No scanId provided in request');
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
      console.error('[security-scan] Failed to fetch scan:', scanError);
      return new Response(JSON.stringify({ error: 'Scan not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[security-scan] Scan fetched successfully:', scan.url);

    // Update scan status to running
    console.log('[security-scan] Updating scan status to running...');
    await supabase
      .from('scans')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', scanId);

    console.log(`[security-scan] Starting security scan for: ${scan.url}`);

    const findings: SecurityCheck[] = [];

    try {
      // Run security checks
      const securityHeadersResults = await checkSecurityHeaders(scan.url);
      findings.push(...securityHeadersResults.findings);

      const exposedFilesResults = await checkExposedFiles(scan.url);
      findings.push(...exposedFilesResults.findings);

      const platformResults = await detectPlatform(scan.url);
      findings.push(...platformResults.findings);

      const xssResults = await checkXSS(scan.url);
      findings.push(...xssResults.findings);

      const csrfResults = await checkCSRF(scan.url);
      findings.push(...csrfResults.findings);

      const cookieResults = await checkInsecureCookies(scan.url);
      findings.push(...cookieResults.findings);

      const redirectResults = await checkOpenRedirect(scan.url);
      findings.push(...redirectResults.findings);

      const sqlResults = await checkBasicSQLInjection(scan.url);
      findings.push(...sqlResults.findings);

      // Check for PII and API key exposure in homepage HTML
      const piiResults = await checkPIIAndAPIKeys(scan.url);
      findings.push(...piiResults.findings);

      // Remove duplicates based on title and category
      const uniqueFindings = deduplicateFindings(findings);
      console.log(`[security-scan] Removed ${findings.length - uniqueFindings.length} duplicate findings`);

      // Calculate CVSS-based score
      const totalScore = calculateCVSSScore(uniqueFindings);

      // Save findings to database
      for (const finding of uniqueFindings) {
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
            element_selector: finding.evidence,
            reference_links: finding.reference_links || [],
            cvss_score: finding.cvss_score,
            owasp_category: finding.owasp_category,
            evidence: finding.evidence
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

      console.log(`[security-scan] Scan completed. Score: ${totalScore}, Findings: ${uniqueFindings.length}`);

      return new Response(JSON.stringify({ 
        success: true, 
        score: totalScore,
        findings: uniqueFindings.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('[security-scan] Scan execution error:', error);
      
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
    console.error('[security-scan] Security scan error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Security Headers Check
async function checkSecurityHeaders(url: string) {
  const findings: SecurityCheck[] = [];

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;

    // Check for HSTS
    if (!headers.get('strict-transport-security')) {
      findings.push({
        id: 'missing-hsts',
        title: 'Missing HTTP Strict Transport Security (HSTS)',
        description: 'The site does not enforce HTTPS connections, allowing potential man-in-the-middle attacks',
        severity: 'high',
        category: 'Security Headers',
        recommendation: 'Add the Strict-Transport-Security header: "Strict-Transport-Security: max-age=31536000; includeSubDomains"',
        impact_score: 15,
        confidence: 'high',
        cvss_score: 7.5,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
          'https://owasp.org/www-community/controls/HTTP_Strict_Transport_Security',
          'https://hstspreload.org/'
        ]
      });
    }

    // Check for CSP
    if (!headers.get('content-security-policy')) {
      findings.push({
        id: 'missing-csp',
        title: 'Missing Content Security Policy',
        description: 'No Content Security Policy header found, leaving the site vulnerable to XSS attacks',
        severity: 'medium',
        category: 'Security Headers',
        recommendation: 'Implement a Content Security Policy header to control resource loading and prevent XSS',
        impact_score: 10,
        confidence: 'high',
        cvss_score: 6.1,
        owasp_category: 'A3: Injection',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          'https://csp-evaluator.withgoogle.com/',
          'https://content-security-policy.com/'
        ]
      });
    }

    // Check for X-Frame-Options
    if (!headers.get('x-frame-options')) {
      findings.push({
        id: 'missing-frame-options',
        title: 'Missing X-Frame-Options Header',
        description: 'Site may be vulnerable to clickjacking attacks through iframe embedding',
        severity: 'medium',
        category: 'Security Headers',
        recommendation: 'Add X-Frame-Options header: "X-Frame-Options: DENY" or "X-Frame-Options: SAMEORIGIN"',
        impact_score: 8,
        confidence: 'high',
        cvss_score: 5.4,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options',
          'https://owasp.org/www-community/attacks/Clickjacking'
        ]
      });
    }

    // Check for X-Content-Type-Options
    if (!headers.get('x-content-type-options')) {
      findings.push({
        id: 'missing-content-type-options',
        title: 'Missing X-Content-Type-Options Header',
        description: 'Browser may perform MIME type sniffing, potentially executing malicious content',
        severity: 'medium',
        category: 'Security Headers',
        recommendation: 'Add X-Content-Type-Options header: "X-Content-Type-Options: nosniff"',
        impact_score: 6,
        confidence: 'high',
        cvss_score: 4.3,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options',
          'https://owasp.org/www-project-secure-headers/#x-content-type-options'
        ]
      });
    }

    // Check for Referrer-Policy
    if (!headers.get('referrer-policy')) {
      findings.push({
        id: 'missing-referrer-policy',
        title: 'Missing Referrer-Policy Header',
        description: 'Referrer information may leak sensitive data to external sites',
        severity: 'low',
        category: 'Security Headers',
        recommendation: 'Add Referrer-Policy header: "Referrer-Policy: strict-origin-when-cross-origin"',
        impact_score: 3,
        confidence: 'high',
        cvss_score: 3.7,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy',
          'https://web.dev/referrer-best-practices/'
        ]
      });
    }

    // Check for X-XSS-Protection (legacy but still relevant)
    if (!headers.get('x-xss-protection')) {
      findings.push({
        id: 'missing-xss-protection',
        title: 'Missing X-XSS-Protection Header',
        description: 'Legacy XSS protection not enabled (still useful for older browsers)',
        severity: 'low',
        category: 'Security Headers',
        recommendation: 'Add X-XSS-Protection header: "X-XSS-Protection: 1; mode=block"',
        impact_score: 2,
        confidence: 'medium',
        cvss_score: 3.1,
        owasp_category: 'A3: Injection',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection',
          'https://owasp.org/www-project-secure-headers/#x-xss-protection'
        ]
      });
    }

    // Check for Permissions-Policy
    if (!headers.get('permissions-policy')) {
      findings.push({
        id: 'missing-permissions-policy',
        title: 'Missing Permissions-Policy Header',
        description: 'No control over browser features and APIs that can be used',
        severity: 'low',
        category: 'Security Headers',
        recommendation: 'Add Permissions-Policy header to control browser features: "Permissions-Policy: camera=(), microphone=(), geolocation=()"',
        impact_score: 2,
        confidence: 'medium',
        cvss_score: 2.7,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy',
          'https://www.w3.org/TR/permissions-policy-1/'
        ]
      });
    }

  } catch (error) {
    console.error('Error checking security headers:', error);
  }

  return { findings };
}

// Exposed Files Check
async function checkExposedFiles(url: string) {
  const findings: SecurityCheck[] = [];

  const sensitiveFiles = [
    { path: '/.env', severity: 'critical' as const, impact: 30, description: 'Environment variables may contain database passwords, API keys, and other secrets', cvss: 9.5 },
    { path: '/.git/config', severity: 'critical' as const, impact: 25, description: 'Git configuration may expose repository information and access credentials', cvss: 9.0 },
    { path: '/config.json', severity: 'high' as const, impact: 20, description: 'Configuration files may contain sensitive application settings', cvss: 7.5 },
    { path: '/wp-config.php', severity: 'critical' as const, impact: 30, description: 'WordPress configuration contains database credentials and security keys', cvss: 9.5 },
    { path: '/.htaccess', severity: 'medium' as const, impact: 10, description: 'Apache configuration may reveal server setup details', cvss: 5.3 },
    { path: '/admin', severity: 'high' as const, impact: 15, description: 'Admin interface should not be publicly accessible without authentication', cvss: 7.1 },
    { path: '/phpmyadmin', severity: 'high' as const, impact: 20, description: 'Database administration tool should be restricted or removed', cvss: 8.2 }
  ];

  for (const file of sensitiveFiles) {
    try {
      const response = await fetch(`${url}${file.path}`);
      if (response.status === 200) {
        const fileType = file.path.includes('.env') ? 'environment' : 
                        file.path.includes('.git') ? 'git' :
                        file.path.includes('wp-config') ? 'wordpress' : 'general';
        
        findings.push({
          id: `exposed-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}`,
          title: `Exposed Sensitive File: ${file.path}`,
          description: file.description,
          severity: file.severity,
          category: 'Exposed Files',
          recommendation: `Immediately restrict access to ${file.path} or remove it from the web root`,
          impact_score: file.impact,
          evidence: `File accessible at: ${url}${file.path}`,
          confidence: 'high',
          cvss_score: file.cvss,
          owasp_category: 'A6: Security Misconfiguration',
          reference_links: fileType === 'environment' ? [
            'https://owasp.org/www-community/vulnerabilities/Improper_Error_Handling',
            'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'
          ] : fileType === 'git' ? [
            'https://owasp.org/www-community/attacks/Forced_browsing',
            'https://git-scm.com/docs/git-config'
          ] : fileType === 'wordpress' ? [
            'https://wordpress.org/support/article/hardening-wordpress/',
            'https://owasp.org/www-project-web-security-testing-guide/'
          ] : [
            'https://owasp.org/www-community/attacks/Forced_browsing'
          ]
        });
      }
    } catch (error) {
      // File not accessible, which is good
    }
  }

  return { findings };
}

// Platform Detection
async function detectPlatform(url: string) {
  const findings: SecurityCheck[] = [];

  try {
    const response = await fetch(url);
    const html = await response.text();
    const headers = response.headers;

    // WordPress detection
    if (html.includes('wp-content') || headers.get('x-powered-by')?.includes('WordPress')) {
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
          confidence: 'high',
          cvss_score: 3.1,
          owasp_category: 'A6: Security Misconfiguration',
          reference_links: [
            'https://wordpress.org/support/article/hardening-wordpress/',
            'https://owasp.org/www-project-web-security-testing-guide/'
          ]
        });
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
        confidence: 'high',
        cvss_score: 2.7,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://owasp.org/www-project-secure-headers/#server',
          'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html'
        ]
      });
    }

  } catch (error) {
    console.error('Error in platform detection:', error);
  }

  return { findings };
}

// Basic XSS Check
async function checkXSS(url: string) {
  const findings: SecurityCheck[] = [];

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
        confidence: 'medium',
        cvss_score: 8.8,
        owasp_category: 'A3: Injection',
        reference_links: [
          'https://owasp.org/www-community/attacks/xss/',
          'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'
        ]
      });
    }

  } catch (error) {
    console.error('Error checking XSS:', error);
  }

  return { findings };
}

// CSRF Check
async function checkCSRF(url: string) {
  const findings: SecurityCheck[] = [];

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
          category: 'CSRF Protection',
          recommendation: 'Implement CSRF tokens for all state-changing forms',
          impact_score: 12,
          confidence: 'medium',
          cvss_score: 6.5,
          owasp_category: 'A8: Cross-Site Request Forgery (CSRF)',
          reference_links: [
            'https://owasp.org/www-community/attacks/csrf',
            'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'
          ]
        });
      }
    }

  } catch (error) {
    console.error('Error checking CSRF:', error);
  }

  return { findings };
}

// Insecure Cookies Check
async function checkInsecureCookies(url: string) {
  const findings: SecurityCheck[] = [];

  try {
    const response = await fetch(url);
    const setCookieHeaders = response.headers.getSetCookie();
    
    for (const cookieHeader of setCookieHeaders) {
      const isSecure = cookieHeader.toLowerCase().includes('secure');
      const isHttpOnly = cookieHeader.toLowerCase().includes('httponly');
      const hasSameSite = cookieHeader.toLowerCase().includes('samesite');
      
      if (!isSecure) {
        findings.push({
          id: 'insecure-cookie',
          title: 'Insecure Cookie Configuration',
          description: 'Cookies are not marked with Secure flag, allowing transmission over HTTP',
          severity: 'medium',
          category: 'Cookie Security',
          recommendation: 'Add Secure flag to all cookies: Set-Cookie: name=value; Secure',
          impact_score: 8,
          evidence: cookieHeader,
          confidence: 'high',
          cvss_score: 5.4,
          owasp_category: 'A6: Security Misconfiguration',
          reference_links: [
            'https://owasp.org/www-community/controls/SecureCookieAttribute',
            'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies'
          ]
        });
      }
      
      if (!isHttpOnly) {
        findings.push({
          id: 'missing-httponly',
          title: 'Missing HttpOnly Cookie Flag',
          description: 'Cookies are accessible via JavaScript, increasing XSS risk',
          severity: 'medium',
          category: 'Cookie Security',
          recommendation: 'Add HttpOnly flag to cookies: Set-Cookie: name=value; HttpOnly',
          impact_score: 6,
          evidence: cookieHeader,
          confidence: 'high',
          cvss_score: 4.3,
          owasp_category: 'A3: Injection',
          reference_links: [
            'https://owasp.org/www-community/HttpOnly',
            'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies'
          ]
        });
      }
      
      if (!hasSameSite) {
        findings.push({
          id: 'missing-samesite',
          title: 'Missing SameSite Cookie Attribute',
          description: 'Cookies lack SameSite protection against CSRF attacks',
          severity: 'low',
          category: 'Cookie Security',
          recommendation: 'Add SameSite attribute: Set-Cookie: name=value; SameSite=Strict',
          impact_score: 4,
          evidence: cookieHeader,
          confidence: 'high',
          cvss_score: 3.5,
          owasp_category: 'A8: Cross-Site Request Forgery (CSRF)',
          reference_links: [
            'https://owasp.org/www-community/SameSite',
            'https://web.dev/samesite-cookies-explained/'
          ]
        });
      }
    }
  } catch (error) {
    console.error('Error checking cookies:', error);
  }

  return { findings };
}

// Open Redirect Check
async function checkOpenRedirect(url: string) {
  const findings: SecurityCheck[] = [];

  try {
    const testUrls = [
      `${url}?redirect=https://evil.com`,
      `${url}?url=https://evil.com`,
      `${url}?return_to=https://evil.com`,
      `${url}?next=https://evil.com`
    ];

    for (const testUrl of testUrls) {
      try {
        const response = await fetch(testUrl, { 
          method: 'HEAD',
          redirect: 'manual'
        });
        
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location && location.includes('evil.com')) {
            findings.push({
              id: 'open-redirect',
              title: 'Open Redirect Vulnerability',
              description: 'Application redirects to external URLs without validation',
              severity: 'medium',
              category: 'Open Redirect',
              recommendation: 'Validate redirect URLs against a whitelist of allowed domains',
              impact_score: 12,
              evidence: `Redirect to: ${location}`,
              confidence: 'high',
              cvss_score: 6.1,
              owasp_category: 'A1: Unvalidated Redirects and Forwards',
              reference_links: [
                'https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/11-Client-side_Testing/04-Testing_for_Client-side_URL_Redirect',
                'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html'
              ]
            });
            break; // Found one, no need to test more
          }
        }
      } catch (error) {
        // Skip individual URL test errors
      }
    }
  } catch (error) {
    console.error('Error checking open redirects:', error);
  }

  return { findings };
}

// Basic SQL Injection Check
async function checkBasicSQLInjection(url: string) {
  const findings: SecurityCheck[] = [];

  try {
    const sqlPayloads = [
      "'",
      "1'",
      "1' OR '1'='1",
      "'; DROP TABLE users; --"
    ];

    for (const payload of sqlPayloads) {
      try {
        const testUrl = `${url}?id=${encodeURIComponent(payload)}`;
        const response = await fetch(testUrl);
        const html = await response.text();
        
        // Look for common SQL error messages
        const sqlErrors = [
          'mysql_fetch_array',
          'ORA-01756',
          'Microsoft OLE DB Provider',
          'ODBC SQL Server Driver',
          'SQLServer JDBC Driver',
          'PostgreSQL query failed',
          'Warning: mysql_',
          'valid MySQL result',
          'MySqlClient\\.'
        ];
        
        for (const errorPattern of sqlErrors) {
          if (html.toLowerCase().includes(errorPattern.toLowerCase())) {
            findings.push({
              id: 'sql-injection-error',
              title: 'Potential SQL Injection Vulnerability',
              description: 'Database error messages suggest potential SQL injection vulnerability',
              severity: 'high',
              category: 'SQL Injection',
              recommendation: 'Use parameterized queries and input validation to prevent SQL injection',
              impact_score: 25,
              evidence: `Error pattern found: ${errorPattern}`,
              confidence: 'medium',
              cvss_score: 8.8,
              owasp_category: 'A3: Injection',
              reference_links: [
                'https://owasp.org/www-community/attacks/SQL_Injection',
                'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
              ]
            });
            return { findings }; // Exit early if found
          }
        }
      } catch (error) {
        // Skip individual payload test errors
      }
    }
  } catch (error) {
    console.error('Error checking SQL injection:', error);
  }

  return { findings };
}

// PII and API Key Detection
async function checkPIIAndAPIKeys(url: string) {
  const findings: SecurityCheck[] = [];
  
  try {
    console.log('[security-scan] Fetching homepage HTML for PII/API key analysis...');
    const response = await fetch(url);
    const html = await response.text();
    
    // Email detection pattern
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = html.match(emailPattern);
    
    if (emailMatches && emailMatches.length > 0) {
      const uniqueEmails = [...new Set(emailMatches)];
      findings.push({
        id: 'pii-email-exposure',
        title: 'Email Addresses Exposed in HTML',
        description: `Found ${uniqueEmails.length} email address(es) exposed in the webpage source`,
        severity: 'high',
        category: 'PII Exposure',
        recommendation: 'Remove email addresses from HTML source. Use contact forms or obfuscation techniques.',
        impact_score: 20,
        evidence: uniqueEmails.slice(0, 3).join(', ') + (uniqueEmails.length > 3 ? '...' : ''),
        confidence: 'high',
        cvss_score: 7.5,
        owasp_category: 'A6: Security Misconfiguration',
        reference_links: [
          'https://owasp.org/www-community/vulnerabilities/Information_exposure_through_directory_listing',
          'https://cheatsheetseries.owasp.org/cheatsheets/Information_Exposure_Prevention_Cheat_Sheet.html'
        ]
      });
    }
    
    // API Key patterns
    const apiKeyPatterns = [
      { name: 'Google/Firebase API Key', pattern: /AIza[0-9A-Za-z-_]{35}/g, cvss: 9.0 },
      { name: 'OpenAI API Key', pattern: /sk-[A-Za-z0-9]{32,}/g, cvss: 9.5 },
      { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, cvss: 9.5 },
      { name: 'Supabase API Key', pattern: /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g, cvss: 8.5 },
      { name: 'Stripe API Key', pattern: /sk_live_[0-9a-zA-Z]{24}/g, cvss: 9.0 },
      { name: 'GitHub Token', pattern: /ghp_[A-Za-z0-9]{36}/g, cvss: 8.0 }
    ];
    
    for (const apiPattern of apiKeyPatterns) {
      const matches = html.match(apiPattern.pattern);
      if (matches && matches.length > 0) {
        const uniqueKeys = [...new Set(matches)];
        findings.push({
          id: `credential-exposure-${apiPattern.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`,
          title: `${apiPattern.name} Exposed in HTML`,
          description: `Found ${uniqueKeys.length} ${apiPattern.name}(s) exposed in the webpage source`,
          severity: 'critical',
          category: 'Credential Exposure',
          recommendation: 'IMMEDIATELY revoke and rotate exposed API keys. Never expose API keys in client-side code.',
          impact_score: 30,
          evidence: uniqueKeys[0].substring(0, 20) + '...',
          confidence: 'high',
          cvss_score: apiPattern.cvss,
          owasp_category: 'A6: Security Misconfiguration',
          reference_links: [
            'https://owasp.org/www-project-api-security/',
            'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'
          ]
        });
      }
    }
    
    console.log(`[security-scan] PII/API key check completed. Found ${findings.length} issues.`);
    
  } catch (error) {
    console.error('Error checking PII and API keys:', error);
  }
  
  return { findings };
}

// Deduplicate findings based on title and category
function deduplicateFindings(findings: SecurityCheck[]): SecurityCheck[] {
  const seen = new Set<string>();
  const uniqueFindings: SecurityCheck[] = [];
  
  for (const finding of findings) {
    const key = `${finding.title}|${finding.category}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFindings.push(finding);
    }
  }
  
  return uniqueFindings;
}

// CVSS v3.1 based scoring system
function calculateCVSSScore(findings: SecurityCheck[]): number {
  if (findings.length === 0) {
    return 100; // Perfect score if no findings
  }
  
  // Find the highest CVSS score among all findings
  const maxCVSSScore = Math.max(...findings.map(f => f.cvss_score || 0));
  console.log(`[security-scan] Max CVSS Score found: ${maxCVSSScore}`);
  
  // Score formula: 100 - (Highest CVSS Score × 10)
  let finalScore = Math.max(0, 100 - (maxCVSSScore * 10));
  console.log(`[security-scan] Calculated base score: ${finalScore}`);
  
  // Cap at F grade (59) or below if any critical finding (CVSS >= 9.0)
  const hasCriticalFinding = findings.some(f => (f.cvss_score || 0) >= 9.0);
  if (hasCriticalFinding) {
    finalScore = Math.min(finalScore, 59);
    console.log(`[security-scan] Critical finding detected, score capped at: ${finalScore}`);
  }
  
  return Math.round(finalScore);
}