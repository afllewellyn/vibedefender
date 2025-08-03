import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { GuestScanForm } from '@/components/scan/GuestScanForm';
import { ScanResults } from '@/components/scan/ScanResults';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const Index = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  console.log('[Index.tsx] Component rendered, activeScanId:', activeScanId);
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
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">Instantly check your homepage for missing security headers and common website misconfigurations. Designed for modern no-code, low-code, and AI-generated web apps.  All results mapped to OWASP Top 10 and scored with CVSS - inspired grades.</p>
          
          {/* Main CTA - Guest Scan Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <GuestScanForm onScanCreated={setActiveScanId} />
          </div>

          {/* Trust Indicators */}
          {!activeScanId && <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Real-time results</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-secondary" />
                <span>Instant security insights</span>
              </div>
            </div>}

          {/* Show scan results if a scan is active */}
          {activeScanId && <ScanResults scanId={activeScanId} onCreateAccount={() => navigate('/signup')} />}

          {/* Secondary Call to Action Buttons */}
          {!activeScanId && <div className="flex gap-4 justify-center">
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
            </div>}
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
      </div>
      
      <Footer />
    </div>;
};
export default Index;