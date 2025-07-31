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
  return <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="h-14 w-14 text-primary" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Vibescurity
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 text-foreground">Scan your website for security vulnerabilities in 60 seconds — no signup needed</h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">Run automated security scans to detect exposed secrets, missing security headers, and common misconfigurations. Designed for modern no-code, low-code, and AI-generated web apps.

        </p>
          
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
          <Card className="bg-secondary border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary-foreground" />
                Quick Scanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Instantly scan your site for common vulnerabilities, misconfigurations, and exposed files — with results in under 60 seconds.</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-accent border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-foreground" />
                Deep Security Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Uncover critical security risks including misconfigurations, exposed files, missing headers, and more — built for modern no-code and AI-built sites.</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-tertiary border-tertiary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-tertiary-foreground" />
                Detailed Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Receive actionable security reports and grades with clear recommendations and prioritized fixes to improve your website's security.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>;
};
export default Index;