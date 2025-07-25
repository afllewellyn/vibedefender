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
        description: "Your security scan has been initiated.",
      });

      // Navigate to scan progress page
      window.location.href = `/scan/${scan.id}`;
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="flex-1">
            <Input
              id="scan-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
              className="h-14 text-lg px-6 rounded-2xl border-2 focus:border-primary/50 bg-background/50 backdrop-blur"
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            disabled={isScanning}
            className="h-14 px-8 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Scan Now
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>No registration required • Results available for 24 hours</span>
        </div>
      </form>
    </div>
  );
};