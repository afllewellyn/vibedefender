import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Temporarily disabled CSP headers for development to fix Lovable workspace iframe issues
    // headers: mode === 'development' ? {
    //   'X-Frame-Options': 'SAMEORIGIN',
    //   'Content-Security-Policy': "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://hkpwhzhbrxbhxypyslmw.supabase.co wss://hkpwhzhbrxbhxypyslmw.supabase.co; frame-ancestors 'self' https://lovable.dev https://*.lovable.dev; base-uri 'self'; form-action 'self'"
    // } : {},
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
