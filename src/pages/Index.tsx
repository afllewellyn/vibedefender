import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { GuestScanForm } from '@/components/scan/GuestScanForm';
import { ScanResults } from '@/components/scan/ScanResults';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeScanId, setActiveScanId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we check your authentication status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">VibeSecure</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive website security scanning and monitoring. Get detailed security reports
            and actionable recommendations to protect your online presence.
          </p>
          
          {/* Guest Scan Form */}
          <div className="max-w-md mx-auto mb-8">
            <GuestScanForm onScanCreated={setActiveScanId} />
          </div>

          {/* Show scan results if a scan is active */}
          {activeScanId && (
            <div className="mt-8">
              <ScanResults scanId={activeScanId} onCreateAccount={() => navigate('/signup')} />
            </div>
          )}

          {/* Call to Action Buttons */}
          {!activeScanId && (
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          )}
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
              <CardDescription>
                Get comprehensive security analysis of your website in minutes, not hours.
                Our automated scanning engine checks for common vulnerabilities and configuration issues.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-accent border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-foreground" />
                Real-time Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your website's security posture with automated scans and instant alerts
                when new vulnerabilities are discovered.
              </CardDescription>
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
              <CardDescription>
                Receive actionable security reports with clear recommendations and prioritized
                fixes to improve your website's security.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
