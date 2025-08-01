import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Methodology = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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
              Vibescurity performs comprehensive security assessments using industry-standard techniques 
              and best practices. Our scanning engine evaluates multiple aspects of your website's 
              security posture to provide actionable insights and recommendations.
            </p>
          </CardContent>
        </Card>

        {/* Scanning Categories */}
        <div className="grid md:grid-cols-2 gap-6">
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
                  Environment Files (.env)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Git Configuration Files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  WordPress Config Files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Admin Interfaces
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
                  Server Information Disclosure
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

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
                <div className="text-xs">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">B</div>
                <div className="text-sm text-muted-foreground">80-89</div>
                <div className="text-xs">Good</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">C</div>
                <div className="text-sm text-muted-foreground">70-79</div>
                <div className="text-xs">Fair</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">D</div>
                <div className="text-sm text-muted-foreground">60-69</div>
                <div className="text-xs">Poor</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">F</div>
                <div className="text-sm text-muted-foreground">0-59</div>
                <div className="text-xs">Failing</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Our weighted grading system evaluates security based on category importance: Security Headers (35%), 
              Vulnerabilities (40%), Exposed Files (20%), and Cookie Security (5%). Each finding is scored by 
              severity and impact to provide a balanced assessment of your security posture.
            </p>
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
    </div>
  );
};

export default Methodology;