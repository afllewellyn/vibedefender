import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Globe, Eye, Key, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const Methodology = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
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
            <CardTitle>CVSS v3.1 Scoring Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We use the industry-standard Common Vulnerability Scoring System (CVSS) v3.1 to evaluate security findings. Each vulnerability is assigned a CVSS score from 0.0 to 10.0 based on exploitability, impact, and environmental factors.
            </p>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="font-semibold text-green-700 dark:text-green-300">Low</div>
                <div className="text-sm text-muted-foreground">0.1 - 3.9</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="font-semibold text-yellow-700 dark:text-yellow-300">Medium</div>
                <div className="text-sm text-muted-foreground">4.0 - 6.9</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="font-semibold text-orange-700 dark:text-orange-300">High</div>
                <div className="text-sm text-muted-foreground">7.0 - 8.9</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="font-semibold text-red-700 dark:text-red-300">Critical</div>
                <div className="text-sm text-muted-foreground">9.0 - 10.0</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your final security score is calculated as: <strong>100 - (Highest CVSS Score × 7)</strong>. This "worst-case scenario" approach ensures that critical vulnerabilities significantly impact the overall grade, encouraging immediate remediation of high-risk issues.
            </p>
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