import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Shield, Clock, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ScanFinding {
  id: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  recommendation: string;
  impact_score: number;
  element_selector: string;
  reference_links?: string[];
}

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number;
  grade: string;
  created_at: string;
  completed_at: string;
  started_at: string;
  error_message: string;
  project?: {
    name: string;
  };
}

const ScanDetails = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (scanId && user) {
      fetchScanDetails();
    }
  }, [scanId, user, isLoading, navigate]);

  const fetchScanDetails = async () => {
    try {
      // Fetch scan details
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select(`
          *,
          projects (
            name
          )
        `)
        .eq('id', scanId)
        .eq('user_id', user?.id)
        .single();

      if (scanError) throw scanError;
      setScan(scanData);

      // Fetch findings if scan is completed
      if (scanData.status === 'completed') {
        const { data: findingsData, error: findingsError } = await supabase
          .from('scan_findings')
          .select('id, title, description, severity, category, recommendation, impact_score, element_selector, reference_links')
          .eq('scan_id', scanId)
          .order('impact_score', { ascending: false });

        if (findingsError) throw findingsError;
        setFindings(findingsData || []);
      }
    } catch (error) {
      console.error('Error fetching scan details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scan details.",
      });
      navigate('/scans');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (!scan || findings.length === 0) return;

    const headers = [
      'Title',
      'Description', 
      'Severity',
      'Category',
      'Recommendation',
      'Impact Score',
      'Element Selector',
      'Reference Links'
    ];

    const csvData = findings.map(finding => [
      `"${finding.title.replace(/"/g, '""')}"`,
      `"${finding.description?.replace(/"/g, '""') || ''}"`,
      `"${finding.severity}"`,
      `"${finding.category}"`,
      `"${finding.recommendation?.replace(/"/g, '""') || ''}"`,
      `"${finding.impact_score || ''}"`,
      `"${finding.element_selector || ''}"`,
      `"${finding.reference_links?.join('|') || ''}"`
    ]);

    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const urlDomain = new URL(scan.url).hostname;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `scan-report-${urlDomain}-${date}.csv`);
      
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Scan report has been downloaded as CSV.",
      });
    }
  };

  const filteredFindings = severityFilter === 'all' 
    ? findings 
    : findings.filter(finding => finding.severity.toLowerCase() === severityFilter);

  const severityCounts = findings.reduce((acc, finding) => {
    const severity = finding.severity.toLowerCase();
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <Shield className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
            <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we load the scan details.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <h1 className="text-2xl font-semibold mb-2">Scan Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested scan could not be found.</p>
            <Button onClick={() => navigate('/scans')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scans
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/scans')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scans
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Scan Details</h1>
            <p className="text-muted-foreground">{scan.url}</p>
          </div>
        </div>

        {/* Scan Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(scan.status)}
                <CardTitle>Security Scan Overview</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{scan.status}</Badge>
                {scan.status === 'completed' && (
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                )}
              </div>
            </div>
            {scan.project && (
              <CardDescription>
                Project: {scan.project.name}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {scan.status === 'completed' && (
                <>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getGradeColor(scan.grade)}`}>
                      {scan.grade}
                    </div>
                    <div className="text-sm text-muted-foreground">Security Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground">
                      {scan.score}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground">
                      {findings.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Issues Found</div>
                  </div>
                </>
              )}
              
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {formatDate(scan.created_at)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {scan.status === 'completed' ? 'Completed' : 'Started'}
                </div>
              </div>
            </div>
            
            {scan.status === 'failed' && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-semibold">Scan Failed</span>
                </div>
                <p className="text-sm mt-1">{scan.error_message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Findings Section */}
        {scan.status === 'completed' && findings.length > 0 && (
          <>
            {/* Severity Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Issues by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={severityFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSeverityFilter('all')}
                  >
                    All ({findings.length})
                  </Button>
                  {Object.entries(severityCounts).map(([severity, count]) => (
                    <Button
                      key={severity}
                      variant={severityFilter === severity ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSeverityFilter(severity)}
                    >
                      {severity.charAt(0).toUpperCase() + severity.slice(1)} ({count})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Findings List */}
            <Card>
              <CardHeader>
                <CardTitle>Security Issues</CardTitle>
                <CardDescription>
                  Detailed findings from your security scan
                  {severityFilter !== 'all' && ` (${severityFilter} severity)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFindings.map((finding) => (
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
                      <div className="grid gap-2 text-sm">
                        <div>
                          <span className="font-medium">Category:</span> {finding.category}
                        </div>
                        {finding.impact_score && (
                          <div>
                            <span className="font-medium">Impact Score:</span> {finding.impact_score}
                          </div>
                        )}
                        {finding.element_selector && (
                          <div>
                            <span className="font-medium">Element:</span> 
                            <code className="ml-1 text-xs bg-muted px-1 rounded">
                              {finding.element_selector}
                            </code>
                          </div>
                        )}
                      </div>
                      {finding.recommendation && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <span className="font-medium text-sm">Recommendation:</span>
                          <p className="text-sm mt-1">{finding.recommendation}</p>
                        </div>
                      )}
                      {finding.reference_links && finding.reference_links.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <span className="font-medium text-sm">Reference Links:</span>
                          <div className="flex flex-wrap gap-2">
                            {finding.reference_links.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
                              >
                                {new URL(link).hostname}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {scan.status === 'completed' && findings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
              <p className="text-muted-foreground">
                Congratulations! This scan didn't detect any security issues.
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScanDetails;