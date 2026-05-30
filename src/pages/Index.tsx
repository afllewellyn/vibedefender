import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Zap, BarChart3, ArrowRight, FileText, Lock, ShieldCheck, Activity, Layers, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GuestScanForm } from '@/components/scan/GuestScanForm';
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

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <p className="font-mono font-bold text-5xl tracking-tight" aria-hidden="true">
              <span className="text-primary">{'{'}</span>
              <span className="text-foreground">{' Vibe Defender '}</span>
              <span className="text-primary">{'}'}</span>
            </p>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-foreground">Vibe Defender — Security scanning for no-code websites in 60 seconds</h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">Instantly check your homepage for missing security headers, exposed PII, and common website misconfigurations. Designed for modern no-code, low-code, and AI-generated web apps.  All results mapped to OWASP Top 10 and graded using the CVSS v3.1 standard.</p>
          
          {/* Main CTA - Guest Scan Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <GuestScanForm onScanCreated={handleScanCreated} />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Real-time results</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span>Instant security insights</span>
              </div>
            </div>

          {/* Metric-led stats strip */}
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted-foreground mb-4">
              {'// why builders trust it'}
            </p>
            <div className="grid grid-cols-3 gap-0">
              {[
                { num: '60', unit: 's', title: 'Quick OWASP scan', desc: 'Homepage checked for headers, PII & misconfigs.', active: true },
                { num: 'A', unit: '–F', title: 'Graded & mapped', desc: 'Every finding scored with CVSS v3.1.', active: false },
                { num: '0', unit: '∆', title: 'Read-only', desc: 'Passive checks — nothing changes on your site.', active: false },
              ].map(({ num, unit, title, desc, active }) => (
                <div
                  key={title}
                  className="py-1 pr-4 pl-4"
                  style={{ borderLeft: `2px solid ${active ? 'hsl(var(--primary))' : 'hsl(var(--border))'}` }}
                >
                  <div
                    className="font-mono font-bold text-[38px] leading-none tracking-tight tabular-nums flex items-baseline gap-[2px]"
                    style={{ color: active ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
                  >
                    {num}
                    <span className="text-[18px] font-semibold text-primary">{unit}</span>
                  </div>
                  <div className="font-bold text-sm mt-3 mb-1 tracking-tight">{title}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

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

        {/* Features Section — spec rows */}
        <div className="mb-16">
          <div className="border-t border-border">
            {[
              {
                idx: '01',
                Icon: Zap,
                title: 'Quick OWASP scan',
                meta: '~60s',
                desc: 'Scans your homepage for missing security headers, exposed PII, and common misconfigurations.',
              },
              {
                idx: '02',
                Icon: Layers,
                title: 'Graded & mapped',
                meta: 'OWASP · CVSS',
                desc: 'Every finding mapped to the OWASP Top 10 and scored with CVSS v3.1 — prioritized, not dumped.',
              },
              {
                idx: '03',
                Icon: CheckCircle,
                title: 'Plain-English fixes',
                meta: 'read-only',
                desc: "Passive, non-intrusive checks with clear remediation steps — even if you're not a security expert.",
              },
            ].map(({ idx, Icon, title, meta, desc }) => (
              <div
                key={idx}
                className="grid gap-5 py-[18px] px-1 border-b border-border items-start"
                style={{ gridTemplateColumns: 'auto 1fr' }}
              >
                <div className="font-mono font-bold text-sm text-primary tabular-nums tracking-wide pt-[3px]">
                  {idx}
                </div>
                <div>
                  <div className="flex items-center gap-[9px] font-bold text-[17px] tracking-tight mb-[3px]">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    {title}
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground tracking-wide font-medium">
                      {meta}
                    </span>
                  </div>
                  <p className="text-[13.5px] leading-[1.55] text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
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
          </div>
        </div>
      </div>

      {/* Built for Vibe-Coders Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">For no-code & AI builders</Badge>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Built for Vibe-Coders</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're using no-code platforms, AI tools, or low-code builders, 
            Vibe Defender helps you ensure your websites follow <strong>Modern Web Security Best Practices</strong> and 
            <strong> Reduce Vulnerability Exposure</strong>—even if you're not a security expert. 
            Get clear, actionable guidance tailored for fast-moving product teams.
          </p>
        </div>
      </div>

    </div>;
};
export default Index;