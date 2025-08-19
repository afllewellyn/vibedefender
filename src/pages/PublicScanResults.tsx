import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  BookOpen,
  Copy,
  User
} from 'lucide-react';

interface ScanFinding {
  id: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  recommendation: string;
  impact_score: number;
  reference_links?: string[];
}

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number;
  grade: string;
  started_at: string;
  completed_at: string;
  error_message: string;
  user_id: string | null;
  access_token: string;
  token_expires_at: string;
}

export default function PublicScanResults() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScanData = async () => {
    if (!accessToken) {
      setError('No access token provided');
      setLoading(false);
      return;
    }

    try {
      console.log('[PublicScanResults] Fetching scan data with access token:', accessToken);
      
      const { data, error: functionError } = await supabase.functions.invoke('scan-public-get', {
        body: { access_token: accessToken }
      });

      if (functionError) {
        console.error('[PublicScanResults] Function error:', functionError);
        throw functionError;
      }

      if (!data || !data.scan) {
        throw new Error('Scan not found or expired');
      }

      console.log('[PublicScanResults] Scan data fetched:', data);
      setScan(data.scan);
      setFindings(data.findings || []);
    } catch (error) {
      console.error('[PublicScanResults] Error fetching scan data:', error);
      setError('Scan not found or has expired');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scan results. The scan may have expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScanData();
    
    // Poll for updates if scan is not completed
    const interval = setInterval(() => {
      if (scan?.status === 'pending' || scan?.status === 'running') {
        console.log('[PublicScanResults] Polling for scan updates, current status:', scan.status);
        fetchScanData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [accessToken, scan?.status]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running': return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = () => {
    if (!scan?.token_expires_at) return '';
    
    const now = new Date();
    const expires = new Date(scan.token_expires_at);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 animate-pulse" />
                <span>Loading scan results...</span>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Scan Not Found</h3>
                  <p className="text-sm text-muted-foreground">
                    This scan result has expired or the link is invalid.
                  </p>
                </div>
                <Button onClick={() => navigate('/')}>
                  Start New Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Scan Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(scan.status)}
                  <CardTitle>Security Scan Results</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={copyShareLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Badge variant="outline">{scan.status}</Badge>
                </div>
              </div>
              <CardDescription>
                Scan of {scan.url}
                {scan.token_expires_at && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    {getTimeRemaining()}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scan.status === 'completed' && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getGradeColor(scan.grade)}`}>
                      {scan.grade}
                    </div>
                    <div className="text-sm text-muted-foreground">Security Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                      {scan.score}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                      {findings.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Issues Found</div>
                  </div>
                </div>
              )}
              
              {scan.status === 'running' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scanning in progress...</span>
                    <span>This may take a few minutes</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
              
              {scan.status === 'failed' && (
                <div className="text-center text-red-600">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Scan failed: {scan.error_message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Results CTA */}
          {scan.status === 'completed' && (
            <Card className="border-primary">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Save Your Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Create an account to save these results and track your security improvements over time.
                    </p>
                  </div>
                  <Button onClick={() => navigate('/signup')}>
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Findings */}
          {scan.status === 'completed' && findings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Security Issues</CardTitle>
                <CardDescription>
                  Detailed findings from your security scan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.map((finding) => (
                    <div key={finding.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{finding.title}</h4>
                        <Badge variant={getSeverityColor(finding.severity)}>
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {finding.description}
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">Category:</span> {finding.category}
                      </div>
                      {finding.recommendation && (
                        <div className="mt-2 p-2 bg-muted rounded">
                          <span className="font-medium text-sm">Recommendation:</span>
                          <p className="text-sm mt-1">{finding.recommendation}</p>
                        </div>
                      )}
                      
                      {finding.reference_links && finding.reference_links.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium text-sm">Learn How to Fix:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {finding.reference_links.map((link, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => window.open(link, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Documentation
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {scan.status === 'completed' && findings.length === 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Shield className="h-12 w-12 mx-auto text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-600">Great Job!</h3>
                    <p className="text-sm text-muted-foreground">
                      No security issues were found in your scan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}