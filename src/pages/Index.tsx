import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Zap, BarChart3, ArrowRight, FileText, Lock, ShieldCheck, Activity, Layers, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GuestScanForm } from '@/components/scan/GuestScanForm';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const Index = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  
  
  const handleScanCreated = (accessToken: string) => {
    console.log('[Index.tsx] Scan created with access token:', accessToken);
    // Redirect to the public scan results page
    navigate(`/r/${accessToken}`);
  };
  // Allow authenticated users to view homepage - no automatic redirect
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we check your authentication status.</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            
            <h1 className="text-6xl font-bold text-primary">
              {"{ Vibe Defender }"}
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 text-foreground">  Scan your website for OWASP security risks — in 60 seconds</h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">Instantly check your homepage for missing security headers, exposed PII, and common website misconfigurations. Designed for modern no-code, low-code, and AI-generated web apps.  All results mapped to OWASP Top 10 and graded using the CVSS v3.1 standard.</p>
          
          {/* Main CTA - Guest Scan Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <GuestScanForm onScanCreated={handleScanCreated} />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Real-time results</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-foreground" />
                <span>Instant security insights</span>
              </div>
            </div>

          {/* Show scan results if a scan is active - this is now handled by redirect */}

          {/* Secondary Call to Action Buttons */}
          <div className="flex gap-4 justify-center">
              {user ? <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button> : <>
                  <Button variant="outline" size="lg" onClick={() => navigate('/signup')}>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </>}
            </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick OWASP Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Instantly scan your sites homepage for common vulnerabilities, misconfigurations, and exposed files — with results in under 60 seconds.</CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                   CVSS-Based Security Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Built for modern no-code and AI-built sites but any website will do.</CardDescription>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Actionable Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get an easy-to-understand security score, prioritized fixes, and links to official remediation guides. All scoring follows OWASP and CVSS standards.</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Scan in Three Simple Steps Section */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">How it works</Badge>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Scan in three simple steps</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Fast, safe, non-intrusive checks with actionable results.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  1
                </div>
                <CardTitle>Start scan</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enter your URL and click the start scan button to begin. No signup or installation required.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  2
                </div>
                <CardTitle>Scan runs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vibe Defender performs passive, read-only security checks with no site changes. Results ready in under 60 seconds.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  3
                </div>
                <CardTitle>Review results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get OWASP-mapped findings with CVSS scores, prioritized risks, and clear remediation guidance.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Benefits Section */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">Platform benefits</Badge>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Comprehensive Security Analysis</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover and fix security vulnerabilities before they become threats. Get security insights and clear remediation steps.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Results */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive scan results within 60 seconds of initiating a scan to quickly identify security issues you might have.
                </CardDescription>
              </CardContent>
            </Card>

            {/* OWASP Mapped Findings */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  OWASP Top 10 Mapped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All findings are mapped to the OWASP Top 10 framework, helping you understand and prioritize the most critical web application security risks.
                </CardDescription>
              </CardContent>
            </Card>

            {/* CVSS Scoring */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  CVSS v3.1 Scoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every vulnerability is scored using the industry-standard CVSS v3.1 system, giving you objective severity ratings for informed decision-making.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Actionable Guidance */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Actionable Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Each finding includes prioritized, clear remediation steps to help your team resolve vulnerabilities efficiently.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Security Headers Check */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Security Headers Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive checks for missing or misconfigured security headers, exposed PII, and common website misconfigurations.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Data Security & Privacy */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Data Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is stored securely - we use strict privacy policies, strong encryption and follow best data protection practices.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Built for Vibe-Coders */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Built for Vibe-Coders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Whether you're using no-code platforms, AI tools, or low-code builders, Vibe Defender helps you ensure your websites follow <strong>Modern Web Security Best Practices</strong> and <strong>Reduce Vulnerability Exposure</strong>—even if you're not a security expert. Get clear, actionable guidance tailored for fast-moving product teams.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>;
};
export default Index;