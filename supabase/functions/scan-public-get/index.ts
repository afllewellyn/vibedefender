import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { access_token } = await req.json();

    if (!access_token) {
      return new Response(JSON.stringify({ error: 'Access token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching scan with access token:', access_token);

    // Fetch scan data using access token (bypassing RLS)
    const { data: scanData, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('access_token', access_token)
      .gt('token_expires_at', new Date().toISOString())
      .single();

    if (scanError || !scanData) {
      console.log('Scan not found or expired:', scanError);
      return new Response(JSON.stringify({ error: 'Scan not found or expired' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch findings for this scan (bypassing RLS)
    const { data: findingsData, error: findingsError } = await supabase
      .from('scan_findings')
      .select('*')
      .eq('scan_id', scanData.id);

    if (findingsError) {
      console.log('Error fetching findings:', findingsError);
    }

    console.log('Successfully fetched scan and findings');

    return new Response(JSON.stringify({
      scan: scanData,
      findings: findingsData || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scan-public-get function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});