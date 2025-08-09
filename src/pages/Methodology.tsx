import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Globe, Eye, Key, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect } from 'react';
const Methodology = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Security Scanning Methodology & Scoring | Vibe Defender';
  }, []);
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Security Scanning Methodology &amp; Scoring</h1>
          <p className="text-xl text-muted-foreground">
            Learn about our comprehensive security scanning methodology
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Our Security Assessment Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vibe Defender performs comprehensive security assessments using industry-standard CVSS v3.1 scoring methodology and automated scanning techniques. Our real-time scanning engine evaluates multiple aspects of your website's security posture, providing immediate, actionable insights.
            </p>
            <p className="text-muted-foreground mt-3">
              <strong>Scope:</strong> We perform non-authenticated scanning of publicly accessible pages and resources. We do not crawl authenticated areas, perform destructive testing, or test POST request flows. For comprehensive penetration testing or authenticated security assessments, engage a qualified security consultant.
            </p>
          </CardContent>
        </Card>

        {/* Scanning Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Headers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  HTTP Strict Transport Security (HSTS)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Content Security Policy (CSP)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  X-Frame-Options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  X-Content-Type-Options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  X-XSS-Protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Referrer-Policy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Permissions-Policy
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Vulnerability Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cross-Site Scripting (XSS)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  SQL Injection Testing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cross-Site Request Forgery (CSRF)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Open Redirect Detection
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Exposed Files & Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Environment Files (.env, .htaccess)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Git Configuration Files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  WordPress & CMS Config Files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Admin & Debug Interfaces
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Backup & Log Files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Database Dumps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Source Code Exposure
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cookie & Platform Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secure Cookie Flags
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  HttpOnly Cookie Protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  SameSite Cookie Attributes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Platform Detection & Versioning
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                PII & Credential Exposure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Email Address Exposure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  API Key Detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Database Connection Strings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Secret Token Patterns
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Information Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Server Version Disclosure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Technology Stack Fingerprinting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Error Message Analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Directory Listing Detection
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CVSS Methodology */}
        <Card>
          <CardHeader>
            <CardTitle>Context-Aware Scoring (Two-Tier + Bonuses)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We use CVSS v3.1 to score findings, then apply context-aware adjustments and universal positive bonuses. No new network requests—only the page HTML and response headers are analyzed.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border">
                <div className="font-semibold">Context Detection</div>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Training (CTF/challenge keywords or known training platforms)</li>
                  <li>• Business (privacy/terms/payment/login indicators)</li>
                  <li>• General (treated as production)</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="font-semibold">Baselines & Multipliers</div>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Training: base 85, multiplier ×4</li>
                  <li>• Production (business/general): base 90, multiplier ×7</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="font-semibold">Contextual CVSS</div>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Training: missing_headers ×0.2</li>
                  <li>• Training: intentional xss/sqli/csrf/file_exposure ×0.1</li>
                  <li>• Production: standard CVSS (no reduction)</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Final score formula: <strong>final = clamp[0–100](base − (highestContextualCVSS × multiplier) + positiveBonus)</strong>. 
              Grades: A ≥ 90, B 80–89, C 70–79, D 60–69, F &lt; 60.
            </p>
          </CardContent>
        </Card>

        {/* Positive Bonuses */}
        <Card>
          <CardHeader>
            <CardTitle>Positive Bonuses &amp; API &amp; PII Hygiene</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2">Headers/Site Bonuses (max +8)</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• HSTS present</li>
                  <li>• CSP present</li>
                  <li>• X-Frame-Options present</li>
                  <li>• HTTPS links used</li>
                  <li>• Server/X-Powered-By hidden</li>
                  <li>• Privacy Policy present</li>
                  <li>• Permissions-Policy present</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-2">API &amp; PII Hygiene (max +6)</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All in-page API references use HTTPS</li>
                  <li>• Tight CORS (Access-Control-Allow-Origin not *)</li>
                  <li>• Rate-limit headers present (X-RateLimit-*)</li>
                  <li>• Anti-CSRF token detected in forms</li>
                  <li>• Secure cookies (Secure + HttpOnly + SameSite=Lax/Strict)</li>
                  <li>• Email obfuscated and/or contact form without mailto</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <strong>Bonus Breakdown:</strong> Headers/Site up to +8, API/PII up to +6 — Max +14
            </div>
            <p className="text-xs text-muted-foreground mt-2">No penalties here — these are universal positives you should maintain.</p>
          </CardContent>
        </Card>

        {/* Grading System */}
        <Card>
          <CardHeader>
            <CardTitle>Security Grading System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">A</div>
                <div className="text-sm text-muted-foreground">90-100</div>
                <div className="text-xs">No high-risk vulnerabilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">B</div>
                <div className="text-sm text-muted-foreground">80-89</div>
                <div className="text-xs">Medium-risk issues only</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">C</div>
                <div className="text-sm text-muted-foreground">70-79</div>
                <div className="text-xs">High-risk vulnerabilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">D</div>
                <div className="text-sm text-muted-foreground">60-69</div>
                <div className="text-xs">Critical vulnerabilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">F</div>
                <div className="text-sm text-muted-foreground">0-59</div>
                <div className="text-xs">Multiple critical issues</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Low CVSS (0.1–3.9): typically Grades A/B (configuration tweaks)</li>
                <li>• Medium CVSS (4.0–6.9): usually Grades B/C/D (security gaps needing attention)</li>
                <li>• High CVSS (7.0–8.9): typically Grade F (real vulnerabilities)</li>
                <li>• Critical CVSS (9.0+): Grade F (urgent issues)</li>
                <li>• Score uses the highest CVSS finding (worst-case), not a sum of all findings</li>
                <li>• This automated assessment complements but doesn't replace manual security testing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle>Disclaimers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold">Training context:</span> This is a security training platform. Vulnerabilities may be intentional; focus on non-intentional issues.
              </div>
              <div>
                <span className="font-semibold">Production context:</span> This assessment provides a comprehensive security overview. Consider professional penetration testing for critical applications.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Ready to Scan Your Website?</h3>
            <p className="text-muted-foreground mb-6">
              Get a comprehensive security assessment of your website in just a few minutes.
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              Start Free Scan
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Methodology;