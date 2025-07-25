import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, User } from 'lucide-react';

interface ScanResultsProps {
  scanId: string;
  onCreateAccount?: () => void;
}

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
  completed_at: string;
  error_message: string;
  user_id: string | null;
}

export const ScanResults = ({ scanId, onCreateAccount }: ScanResultsProps) => {
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchScanData = async () => {
    try {
      // Fetch scan details
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();

      if (scanError) throw scanError;
      setScan(scanData);

      // Fetch findings if scan is completed
      if (scanData.status === 'completed') {
        const { data: findingsData, error: findingsError } = await supabase
          .from('scan_findings')
          .select('*')
          .eq('scan_id', scanId)
          .order('impact_score', { ascending: false });

        if (findingsError) throw findingsError;
        setFindings(findingsData || []);
      }
    } catch (error) {
      console.error('Error fetching scan data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scan results.",
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
        fetchScanData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [scanId, scan?.status]);

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

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 animate-pulse" />
            <span>Loading scan results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scan) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Scan not found or has expired.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Scan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(scan.status)}
              <CardTitle>Security Scan Results</CardTitle>
            </div>
            <Badge variant="outline">{scan.status}</Badge>
          </div>
          <CardDescription>
            Scan of {scan.url}
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
              <Progress value={undefined} className="w-full" />
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

      {/* Save Results CTA for Guest Users */}
      {scan.status === 'completed' && !scan.user_id && onCreateAccount && (
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
              <Button onClick={onCreateAccount}>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};