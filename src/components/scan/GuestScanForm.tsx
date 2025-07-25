import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

interface GuestScanFormProps {
  onScanCreated: (scanId: string) => void;
}

export const GuestScanForm = ({ onScanCreated }: GuestScanFormProps) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const sanitizeUrl = (url: string): string => {
    // Remove potential XSS vectors
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

    setIsScanning(true);

    try {
      // Create anonymous scan
      const { data: scan, error } = await supabase
        .from('scans')
        .insert({
          url: sanitizedUrl,
          status: 'pending',
          user_id: null // Anonymous scan
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Scan Started",
        description: "Your security scan has been initiated. This may take a few minutes.",
      });

      onScanCreated(scan.id);
      setUrl('');
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Free Security Scan</CardTitle>
        <CardDescription>
          Get an instant security assessment of your website
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Start Free Scan
              </>
            )}
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>No registration required • Results available for 24 hours</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};