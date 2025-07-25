import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number;
  grade: string;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

const ScanProgress = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scan, setScan] = useState<Scan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!scanId) {
      navigate('/');
      return;
    }

    fetchScanData();
    
    // Poll for updates while scan is in progress
    const interval = setInterval(() => {
      if (scan?.status === 'pending' || scan?.status === 'running') {
        fetchScanData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [scanId, scan?.status]);

  const fetchScanData = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();

      if (error) throw error;

      setScan(data);
      
      // Calculate progress based on status
      if (data.status === 'pending') {
        setProgress(10);
      } else if (data.status === 'running') {
        setProgress(50);
      } else if (data.status === 'completed') {
        setProgress(100);
        // Auto-redirect to report after completion
        setTimeout(() => {
          navigate(`/report/${scanId}`);
        }, 2000);
      } else if (data.status === 'failed') {
        setProgress(0);
      }
    } catch (error) {
      console.error('Error fetching scan:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scan data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'running':
        return <Shield className="h-5 w-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'running':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Initializing scan...';
      case 'running':
        return 'Scanning in progress...';
      case 'completed':
        return 'Scan completed!';
      case 'failed':
        return 'Scan failed';
      default:
        return 'Unknown status';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <p>Loading scan data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Scan Not Found</h1>
          <p className="text-muted-foreground mb-6">The scan you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Security Scan in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Scanning: {scan.url}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {getStatusIcon(scan.status)}
                <Badge variant={getStatusColor(scan.status) as any}>
                  {getStatusText(scan.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {scan.status === 'running' && (
              <div className="text-center text-sm text-muted-foreground">
                <p>This may take a few minutes depending on the complexity of your website.</p>
                <p>We're analyzing security headers, SSL configuration, and potential vulnerabilities.</p>
              </div>
            )}

            {scan.status === 'completed' && (
              <div className="text-center">
                <p className="text-green-600 font-medium mb-4">
                  Scan completed successfully! Redirecting to results...
                </p>
                <Button onClick={() => navigate(`/report/${scanId}`)}>
                  View Results Now
                </Button>
              </div>
            )}

            {scan.status === 'failed' && (
              <div className="text-center">
                <p className="text-destructive font-medium mb-2">Scan failed</p>
                {scan.error_message && (
                  <p className="text-sm text-muted-foreground mb-4">{scan.error_message}</p>
                )}
                <Button onClick={() => navigate('/')}>
                  Start New Scan
                </Button>
              </div>
            )}

            <div className="text-xs text-muted-foreground text-center">
              Scan ID: {scan.id}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanProgress;