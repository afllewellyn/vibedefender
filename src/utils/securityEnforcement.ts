// Runtime security enforcement utilities
export const enforceSecurityPolicies = () => {
  // Frame-busting protection
  if (window.top !== window.self) {
    try {
      window.top.location.href = window.self.location.href;
    } catch (e) {
      document.body.style.display = 'none';
    }
  }

  // XSS Protection via Content Security Policy injection
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://hkpwhzhbrxbhxypyslmw.supabase.co wss://hkpwhzhbrxbhxypyslmw.supabase.co; frame-ancestors 'self' https://lovable.dev https://*.lovable.dev; base-uri 'self'; form-action 'self'";
  document.head.appendChild(meta);

  // Permissions Policy enforcement
  const permissionsMeta = document.createElement('meta');
  permissionsMeta.httpEquiv = 'Permissions-Policy';
  permissionsMeta.content = 'camera=(), microphone=(), geolocation=(), interest-cohort=()';
  document.head.appendChild(permissionsMeta);

  // X-Frame-Options simulation
  const frameMeta = document.createElement('meta');
  frameMeta.httpEquiv = 'X-Frame-Options';
  frameMeta.content = 'SAMEORIGIN';
  document.head.appendChild(frameMeta);

  // X-XSS-Protection simulation
  const xssMeta = document.createElement('meta');
  xssMeta.httpEquiv = 'X-XSS-Protection';
  xssMeta.content = '1; mode=block';
  document.head.appendChild(xssMeta);
};

// Service Worker registration for header injection
export const registerSecurityServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Security Service Worker registered:', registration);
      
      // Force refresh on first install to apply headers
      if (!navigator.serviceWorker.controller) {
        window.location.reload();
      }
    } catch (error) {
      console.warn('Security Service Worker registration failed:', error);
    }
  }
};

// Initialize security enforcement
export const initializeSecurity = () => {
  enforceSecurityPolicies();
  registerSecurityServiceWorker();
};