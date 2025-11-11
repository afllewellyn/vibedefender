import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function isValidHttpUrl(raw: string) {
  try {
    const u = new URL(raw);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizeUrl(raw: string) {
  return raw.trim().toLowerCase().replace(/[<>'"]/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cleaned = sanitizeUrl(url);
    if (!isValidHttpUrl(cleaned)) {
      return new Response(JSON.stringify({ error: 'invalid url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract client IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';

    console.log('[scan-public-create] Client IP:', clientIp);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check rate limit for guest scans
    const { data: canScan, error: limitError } = await supabase
      .rpc('check_guest_scan_limit', { check_ip: clientIp });

    if (limitError) {
      console.error('[scan-public-create] Rate limit check failed:', limitError);
      return new Response(JSON.stringify({ error: 'rate limit check failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!canScan) {
      console.log('[scan-public-create] Rate limit exceeded for IP:', clientIp);
      return new Response(JSON.stringify({ 
        error: 'rate limit exceeded',
        message: 'Maximum 5 scans per 24 hours for guest users. Please sign up for unlimited scans.'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert guest scan with client IP stored in metadata
    const { data, error } = await supabase
      .from('scans')
      .insert({ url: cleaned, status: 'pending', user_id: null, metadata: { client_ip: clientIp } })
      .select('id, access_token')
      .single();

    if (error || !data) {
      console.error('[scan-public-create] Insert failed:', error);
      return new Response(JSON.stringify({ error: 'failed to create scan' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[scan-public-create] Guest scan created:', data.id, 'for IP:', clientIp);

    return new Response(JSON.stringify({ id: data.id, access_token: data.access_token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e: any) {
    console.error('[scan-public-create] Error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
