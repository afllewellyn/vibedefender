import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://hkpwhzhbrxbhxypyslmw.supabase.co wss://hkpwhzhbrxbhxypyslmw.supabase.co; frame-ancestors 'self' https://lovable.dev https://*.lovable.dev; base-uri 'self'; form-action 'self'",
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Embedder-Policy': 'unsafe-none',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'cross-origin'
}

serve(async (req) => {
  const { method } = req

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // This endpoint can be used to verify security headers are working
    const response = {
      message: 'Security headers proxy active',
      headers: securityHeaders,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { 
          ...corsHeaders,
          ...securityHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          ...securityHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400,
      },
    )
  }
})