import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Scan, History, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useUserStats } from '@/hooks/useUserStats';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalProjects, totalScans, averageGrade, recentScans, isLoading } = useUserStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          {/* Welcome Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome back, {user?.email}!</CardTitle>
              <CardDescription>
                Your VibeAudit security dashboard is ready. Manage your projects and track security scans from here.
              </CardDescription>
            </CardHeader>
          </Card>
        
        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : totalProjects}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active projects
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : totalScans}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Security scans completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : averageGrade}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalScans === 0 ? "No scans yet" : "Across all scans"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        {!isLoading && recentScans.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Your latest security scan results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.slice(0, 3).map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{scan.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        scan.grade === 'A' ? 'text-green-600' :
                        scan.grade === 'B' ? 'text-blue-600' :
                        scan.grade === 'C' ? 'text-yellow-600' :
                        scan.grade === 'D' ? 'text-orange-600' :
                        scan.grade === 'F' ? 'text-red-600' : 'text-muted-foreground'
                      }`}>
                        {scan.grade || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/projects')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Manage Projects and Scans</CardTitle>
                  <CardDescription>
                    Create and organize your scan projects and start new scans
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate('/projects'); }}>
                View Projects
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/scans')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>Scan History</CardTitle>
                  <CardDescription>
                    View and analyze past scans
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); navigate('/scans'); }}>
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;