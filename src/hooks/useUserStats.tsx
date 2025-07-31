import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  totalProjects: number;
  totalScans: number;
  averageGrade: string;
  recentScans: any[];
  isLoading: boolean;
  error: string | null;
}

export const useUserStats = (): UserStats => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalProjects: 0,
    totalScans: 0,
    averageGrade: '-',
    recentScans: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setStats(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchUserStats = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true, error: null }));

        // Fetch projects count
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (projectsError) throw projectsError;

        // Fetch scans count and average grade
        const { data: scansData, error: scansError } = await supabase
          .from('scans')
          .select('score, grade, url, created_at, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (scansError) throw scansError;

        const totalScans = scansData?.length || 0;
        
        // Calculate average grade
        const validScores = scansData?.filter(scan => scan.score !== null).map(scan => scan.score) || [];
        const averageScore = validScores.length > 0 
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length 
          : 0;
        
        let averageGrade = '-';
        if (averageScore > 0) {
          if (averageScore >= 90) averageGrade = 'A';
          else if (averageScore >= 80) averageGrade = 'B';
          else if (averageScore >= 70) averageGrade = 'C';
          else if (averageScore >= 60) averageGrade = 'D';
          else averageGrade = 'F';
        }

        // Get recent scans (last 5)
        const recentScans = scansData?.slice(0, 5) || [];

        setStats({
          totalProjects: projectsCount || 0,
          totalScans,
          averageGrade,
          recentScans,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch stats',
        }));
      }
    };

    fetchUserStats();
  }, [user]);

  return stats;
};