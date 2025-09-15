// Security Headers Service Worker
const SECURITY_HEADERS = {
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
};

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      const newHeaders = new Headers(response.headers);
      
      // Add security headers
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }).catch(() => {
      // Fallback response
      return new Response('Network error', { status: 503 });
    })
  );
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});