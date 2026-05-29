import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Scans from "./pages/Scans";
import ScanDetails from "./pages/ScanDetails";
import ScanProgress from "./pages/ScanProgress";
import ScanReport from "./pages/ScanReport";
import PublicScanResults from "./pages/PublicScanResults";
import Methodology from "./pages/Methodology";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const withSEO = (
  title: string,
  description: string,
  path: string,
  Page: React.ComponentType
) => (
  <>
    <SEO title={title} description={description} path={path} />
    <Page />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
            <Route
              path="/"
              element={withSEO(
                "Vibe Defender — OWASP Security Scanner for Websites",
                "Scan your vibe-coded website for OWASP and CVSS security scores and get fix-ready results in under 60 seconds.",
                "/",
                Index
              )}
            />
            <Route
              path="/auth"
              element={withSEO(
                "Sign in or Sign up | Vibe Defender",
                "Access your Vibe Defender account to manage projects, run OWASP scans, and review CVSS-graded vulnerability reports.",
                "/auth",
                Auth
              )}
            />
            <Route
              path="/login"
              element={withSEO(
                "Log in | Vibe Defender",
                "Log in to Vibe Defender to manage your security projects and review historical OWASP and CVSS scan reports.",
                "/login",
                Login
              )}
            />
            <Route
              path="/signup"
              element={withSEO(
                "Create your account | Vibe Defender",
                "Create a free Vibe Defender account to run unlimited OWASP security scans and track vulnerability trends over time.",
                "/signup",
                Signup
              )}
            />
            <Route
              path="/dashboard"
              element={withSEO(
                "Dashboard | Vibe Defender",
                "Your Vibe Defender dashboard with project overviews, recent scans, and average security grades at a glance.",
                "/dashboard",
                Dashboard
              )}
            />
            <Route
              path="/projects"
              element={withSEO(
                "Projects | Vibe Defender",
                "Manage the websites you monitor with Vibe Defender, group scans by project, and track remediation progress.",
                "/projects",
                Projects
              )}
            />
            <Route
              path="/scans"
              element={withSEO(
                "Scan history | Vibe Defender",
                "Browse every OWASP security scan you have run with Vibe Defender, filter by status, and revisit detailed findings.",
                "/scans",
                Scans
              )}
            />
            <Route
              path="/scans/:scanId"
              element={withSEO(
                "Scan details | Vibe Defender",
                "Inspect individual scan findings with CVSS scores, OWASP category mapping, and recommended remediation steps.",
                "/scans",
                ScanDetails
              )}
            />
            <Route
              path="/scan/:scanId"
              element={withSEO(
                "Scan in progress | Vibe Defender",
                "Watch your Vibe Defender security scan run live with real-time status updates and progress reporting.",
                "/scan",
                ScanProgress
              )}
            />
            <Route
              path="/report/:scanId"
              element={withSEO(
                "Scan report | Vibe Defender",
                "Read the full Vibe Defender security report with grades, vulnerability severities, and actionable fixes.",
                "/report",
                ScanReport
              )}
            />
            <Route
              path="/r/:accessToken"
              element={withSEO(
                "Shared scan results | Vibe Defender",
                "View shared Vibe Defender scan results with OWASP findings, CVSS scores, and security recommendations.",
                "/r",
                PublicScanResults
              )}
            />
            <Route
              path="/methodology"
              element={withSEO(
                "Security scanning methodology | Vibe Defender",
                "Learn how Vibe Defender scans websites: OWASP coverage, CVSS v3.1 scoring, and context-aware security grading.",
                "/methodology",
                Methodology
              )}
            />
            <Route
              path="/privacy"
              element={withSEO(
                "Privacy policy | Vibe Defender",
                "Read how Vibe Defender collects, processes, and protects your data when you run website security scans.",
                "/privacy",
                Privacy
              )}
            />
            <Route
              path="/terms"
              element={withSEO(
                "Terms of service | Vibe Defender",
                "The terms of service governing your use of Vibe Defender's website security scanning and reporting platform.",
                "/terms",
                Terms
              )}
            />
            <Route
              path="/contact"
              element={withSEO(
                "Contact us | Vibe Defender",
                "Get in touch with the Vibe Defender team for support, partnership inquiries, or security questions.",
                "/contact",
                Contact
              )}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={withSEO(
                "Page not found | Vibe Defender",
                "The page you are looking for does not exist. Return to Vibe Defender to scan your website for OWASP vulnerabilities.",
                "/404",
                NotFound
              )}
            />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
