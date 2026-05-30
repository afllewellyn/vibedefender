# { Vibe Defender }

Security scanning for no-code websites in 60 seconds.

Vibe Defender checks your homepage for missing security headers, exposed credentials, and common misconfigurations — then grades each finding against the OWASP Top 10 and CVSS v3.1. Built for vibe-coders, no-code builders, and anyone who ships fast and wants to know where they stand.

No signup required for a guest scan. Create an account to save projects, track history, and monitor remediation progress.

---

## What gets scanned

Vibe Defender performs passive, read-only checks against your homepage and select public endpoints. Nothing on your site is modified.

- **Security headers** — HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Vulnerability testing** — XSS vectors, SQL injection patterns, CSRF exposure, open redirect detection
- **Exposed files & data** — `.env` files, Git config, CMS configs, admin interfaces, backup files, database dumps
- **Cookie & platform security** — Secure/HttpOnly/SameSite flags, platform version detection
- **PII & credential exposure** — Email addresses, API keys, database connection strings, secret tokens in HTML/JS
- **Information disclosure** — Server version banners, tech-stack fingerprinting, directory listing, verbose error messages

---

## Scoring & grading

Scores are context-aware. Vibe Defender detects whether your site looks like a training/CTF environment or a live production site, and adjusts severity multipliers accordingly so you're not penalised for intentional vulnerabilities in learning contexts.

- **Formula:** `score = clamp(0–100, baseline − (highest contextual CVSS × multiplier) + positive bonuses)`
- **Positive bonuses** (up to +10) for good practices: HSTS, CSP, hidden server info, HTTPS APIs, anti-CSRF tokens, secure cookies, obfuscated emails, privacy policy present
- **Grade scale:** A (90–100) · B (80–89) · C (70–79) · D (60–69) · F (0–59)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React + TypeScript |
| UI | Tailwind CSS + shadcn/ui (Radix primitives) |
| Fonts | Hanken Grotesk + JetBrains Mono |
| Icons | Lucide React |
| Data fetching | TanStack React Query |
| Backend / auth | Supabase (Postgres + Auth) |
| Deployment | Netlify / Vercel (configs included) |

---

## Local development

```sh
git clone https://github.com/afllewellyn/vibedefender.git
cd vibedefender
npm install
cp .env.example .env   # fill in your Supabase credentials
npm run dev
```

The dev server runs at `http://localhost:8080`.

### Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |

---

## Project structure

```
src/
  pages/
    Index.tsx          # marketing homepage + guest scan form
    Dashboard.tsx      # authenticated overview
    Projects.tsx       # project management
    Scans.tsx          # scan history
    ScanProgress.tsx   # live scan view
    ScanReport.tsx     # full findings report
    PublicScanResults.tsx  # shareable report (no auth)
    Methodology.tsx    # scoring & methodology explainer
  components/
    layout/            # Header, Footer, Layout
    scan/              # GuestScanForm, ScanResults
    projects/          # ProjectForm, ProjectScanDialog
    ui/                # shadcn/ui primitives
  hooks/
    useAuth.tsx        # Supabase auth context
    useUserStats.tsx   # dashboard stats
  utils/
    securityEnforcement.ts  # client-side header injection
  integrations/
    supabase/          # client + generated types
supabase/
  migrations/          # database schema history
```

---

## Deployment

The repo includes both `netlify.toml` and `vercel.json`. Push to either platform and set the three environment variables above.

For Lovable-managed hosting, open the project at [lovable.dev/projects/24bb6de0-621d-4025-a2cf-8a685b05ee2a](https://lovable.dev/projects/24bb6de0-621d-4025-a2cf-8a685b05ee2a) and use Share → Publish.

---

> Vibe Defender scans only the homepage and select public endpoints for visible issues. For in-depth, authenticated, or full-site testing, consult a professional security auditor.
