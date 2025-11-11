import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield } from 'lucide-react';

interface ProjectScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  projectUrl: string;
  onScanCreated: () => void;
}

export const ProjectScanDialog = ({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName,
  projectUrl,
  onScanCreated 
}: ProjectScanDialogProps) => {
  const [url, setUrl] = useState(projectUrl);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Update URL when projectUrl prop changes (different project selected)
  useEffect(() => {
    setUrl(projectUrl);
  }, [projectUrl]);

  const validateUrl = (url: string): boolean => {
    // Check length limit
    if (!url || url.length > 2048) {
      return false;
    }
    
    // Reject protocol-relative URLs
    if (url.startsWith('//')) {
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols explicitly
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const sanitizeUrl = (url: string): string => {
    return url.trim().toLowerCase().replace(/[<>'"]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a URL to scan.",
      });
      return;
    }

    const sanitizedUrl = sanitizeUrl(url);
    
    if (!validateUrl(sanitizedUrl)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid HTTP or HTTPS URL.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to create scans.",
      });
      return;
    }

    setIsScanning(true);

    try {
      // Create authenticated scan linked to project
      const { data: scan, error } = await supabase
        .from('scans')
        .insert({
          url: sanitizedUrl,
          status: 'pending',
          user_id: user.id,
          project_id: projectId
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger the security scan
      try {
        const { error: scanError } = await supabase.functions.invoke('security-scan', {
          body: { scanId: scan.id }
        });

        if (scanError) {
          console.error('Error starting scan:', scanError);
        }
      } catch (scanInvokeError) {
        console.error('Error invoking scan function:', scanInvokeError);
      }

      toast({
        title: "Scan Started",
        description: `Security scan initiated for ${projectName}`,
      });

      setUrl(projectUrl);
      onOpenChange(false);
      onScanCreated();
    } catch (error) {
      console.error('Scan creation error:', error);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Unable to start the security scan. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Security Scan</DialogTitle>
          <DialogDescription>
            Start a security scan for {projectName}. You can modify the URL below if needed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scan-url">Website URL</Label>
            <Input
              id="scan-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isScanning}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Start Scan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};