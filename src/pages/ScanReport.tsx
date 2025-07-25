import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Shield, Download, Share2, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ScanFinding {
  id: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  recommendation: string;
  impact_score: number;
}

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number;
  grade: string;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  user_id: string | null;
}

const ScanReport = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!scanId) {
      navigate('/');
      return;
    }

    fetchScanData();
  }, [scanId]);

  const fetchScanData = async () => {
    try {
      // Fetch scan data
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();

      if (scanError) throw scanError;

      setScan(scanData);

      // Fetch findings
      const { data: findingsData, error: findingsError } = await supabase
        .from('scan_findings')
        .select('*')
        .eq('scan_id', scanId)
        .order('impact_score', { ascending: false });

      if (findingsError) throw findingsError;

      setFindings(findingsData || []);
    } catch (error) {
      console.error('Error fetching scan data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch scan report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-green-500';
      case 'C':
        return 'text-yellow-500';
      case 'D':
        return 'text-orange-500';
      case 'F':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <p>Loading scan report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">The scan report you're looking for doesn't exist.</p>
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
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Scan Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Security Scan Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Scanned URL</h3>
                <p className="text-muted-foreground break-all">{scan.url}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Security Grade</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${getGradeColor(scan.grade)}`}>
                    {scan.grade}
                  </span>
                  <span className="text-muted-foreground">({scan.score}/100)</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Scan Completed</h3>
                <p className="text-muted-foreground">
                  {scan.completed_at ? formatDate(scan.completed_at) : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Issues Found</h3>
                <p className="text-2xl font-bold text-muted-foreground">{findings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest User Call-to-Action */}
        {!user && scan.status === 'completed' && (
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <User className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Want to save your results?</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a free account to save your scan results, track improvements, and set up monitoring.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => navigate('/signup')}>
                      Create Account
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      Sign In
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Issues */}
        {findings.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Security Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{finding.title}</h4>
                          <Badge variant={getSeverityColor(finding.severity) as any}>
                            {finding.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {finding.description}
                        </p>
                        <div className="text-sm">
                          <span className="font-medium">Category: </span>
                          <span className="text-muted-foreground">{finding.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <h5 className="font-medium text-sm mb-1">Recommendation:</h5>
                      <p className="text-sm text-muted-foreground">{finding.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">Great Security!</h3>
                <p className="text-muted-foreground">
                  No security issues were found during the scan. Your website appears to be well-secured.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScanReport;