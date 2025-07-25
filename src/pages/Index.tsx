import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { GuestScanForm } from '@/components/scan/GuestScanForm';
import { ScanResults } from '@/components/scan/ScanResults';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            VibeSecure
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive security scanning to protect your digital assets. 
            Detect vulnerabilities before they become threats.
          </p>
          
          {/* Guest Scan Section */}
          {!activeScanId ? (
            <div className="mb-12">
              <GuestScanForm onScanCreated={setActiveScanId} />
            </div>
          ) : (
            <div className="mb-12">
              <ScanResults 
                scanId={activeScanId} 
                onCreateAccount={() => navigate('/auth')}
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="px-8 py-3"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="px-8 py-3"
            >
              Sign In
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fast and efficient vulnerability detection with comprehensive reporting.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Continuous security monitoring to catch threats as they emerge.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive security reports with actionable insights and recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
