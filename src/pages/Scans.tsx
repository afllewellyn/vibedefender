import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Search, Plus, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Scan {
  id: string;
  url: string;
  status: string;
  score: number;
  grade: string;
  created_at: string;
  completed_at: string;
  project?: {
    name: string;
  };
}

const Scans = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchScans();
    }
  }, [user, isLoading, navigate]);

  const fetchScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select(`
          *,
          projects (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scans.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredScans = scans.filter(scan =>
    scan.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we load your scans.</p>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Security Scans</h1>
            <p className="text-muted-foreground">
              View and manage your security scan history
            </p>
          </div>
          <Button onClick={() => navigate('/projects')}>
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2 mb-6">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scans by URL or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Shield className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading scans...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredScans.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No scans found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No scans match your search criteria.' : 'You haven\'t run any security scans yet.'}
              </p>
              <Button onClick={() => navigate('/projects')}>
                <Plus className="mr-2 h-4 w-4" />
                Start Your First Scan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Scans Grid */}
        {!loading && filteredScans.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredScans.map((scan) => (
              <Card key={scan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      {getStatusIcon(scan.status)}
                      <CardTitle className="text-lg truncate min-w-0">{scan.url}</CardTitle>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant={getStatusColor(scan.status)}>
                        {scan.status}
                      </Badge>
                    </div>
                  </div>
                  {scan.project && (
                    <CardDescription className="mt-1">
                      Project: {scan.project.name}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="space-y-4">
                    {scan.status === 'completed' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Grade:</span>
                        <span className={`font-bold text-lg ${getGradeColor(scan.grade)}`}>
                          {scan.grade}
                        </span>
                      </div>
                    )}
                    
                    {scan.status === 'completed' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Score:</span>
                        <span className="font-semibold">{scan.score}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Started:</span>
                      <span>{formatDate(scan.created_at)}</span>
                    </div>
                    
                    {scan.completed_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{formatDate(scan.completed_at)}</span>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => navigate(`/scans/${scan.id}`)}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Scans;