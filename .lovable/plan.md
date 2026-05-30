## Goal

Evaluate using Firecrawl to augment (or replace) the raw `fetch()`-based scraping inside `supabase/functions/security-scan/index.ts` so scans see what real users see — including JS-rendered SPAs.

## Current scraper — what it does and where it falls short

The scanner uses Deno's built-in `fetch()` ~10 times across these checks:

- `checkSecurityHeaders` — `HEAD` request for headers
- `checkOutdatedSoftware` — body sniff for WordPress / generators
- `checkXSSVulnerabilities` — reflected-payload test
- `checkCSRFProtection` — looks for `<form>` + csrf tokens in HTML
- `checkOpenRedirects` — follows redirect params
- `checkSQLInjection` — error-pattern probes
- `checkInformationDisclosure` — scrapes emails, comments, paths
- `checkExposedAPIKeys` — regex-scans body for secrets
- `detectContext` / `buildBusinessContext` — keyword scan of HTML

**Limitations today**

1. **No JS execution.** React/Vue/Next CSR sites return an empty `<div id="root">`, so XSS, CSRF, info-disclosure, exposed-keys, and context detection all silently underperform on the modal Lovable-built site.
2. **Single page only.** No link discovery → forms, admin routes, hidden endpoints aren't seen.
3. **No screenshot / branding** for the report UI.
4. **Bot blocks / Cloudflare.** Plain fetch is often 403'd; Firecrawl handles anti-bot.
5. **No structured metadata** (title, description, OG) — currently regexed ad-hoc.

## Where Firecrawl helps

Firecrawl connector is already available in the workspace (`linkable: yes`, unmanaged). Relevant features:

| Need | Firecrawl feature |
|---|---|
| JS-rendered HTML | `scrape` with `formats: ['html','rawHtml','markdown']`, `waitFor` |
| Discover internal routes | `map` (fast) or shallow `crawl` (depth 1–2, limit ~10) |
| Screenshot in report | `scrape` `formats: ['screenshot']` |
| Brand context for "training vs business" detection | `formats: ['branding','summary']` |
| Metadata (title/desc/lang) | always returned in `metadata` |

What Firecrawl does **not** replace:
- The `HEAD` call for security headers (must hit origin directly to read real response headers — Firecrawl normalizes them).
- Active probing (XSS payload reflection, SQLi error probes, open-redirect tests) — these need to hit specific crafted URLs against the origin. Keep raw `fetch` for these.

## Recommendation: augment, don't replace

Two-tier fetch model:

```text
            ┌─ Firecrawl scrape (rendered HTML + metadata + screenshot + branding)
URL ───────┤   → drives: info-disclosure, exposed-keys, CSRF form detection,
            │     outdated-software, context detection, report screenshot
            │
            └─ Direct fetch (raw origin)
                → drives: security headers (HEAD), XSS probe, SQLi probe,
                  open-redirect probe, cookie inspection
```

Optionally add a single `map` call (limit 25) so CSRF/info-disclosure can scan a few key pages instead of just the homepage — biggest accuracy lift for the smallest cost.

## Implementation plan

### 1. Wire the connector
- Call `standard_connectors--connect` for `firecrawl` so `FIRECRAWL_API_KEY` is injected into edge function env.
- No client-side changes needed.

### 2. New helper module
Create `supabase/functions/_shared/firecrawl.ts` exposing:
- `scrapePage(url, { waitFor, formats })` → `{ html, markdown, metadata, screenshot?, branding? }`
- `mapSite(url, { limit })` → `string[]`
- All calls go to `https://api.firecrawl.dev/v2/...` with `Authorization: Bearer ${FIRECRAWL_API_KEY}`.
- Graceful fallback: if `FIRECRAWL_API_KEY` missing or call fails, return `null` so callers fall back to `fetch()`.

### 3. Refactor `security-scan/index.ts`
- At the top of the scan, do **one** Firecrawl scrape of the target URL (`formats: ['html','markdown','screenshot','branding']`, `waitFor: 2000`).
- Pass the rendered `html` into the checks that currently re-fetch it (`checkInformationDisclosure`, `checkExposedAPIKeys`, `checkCSRFProtection`, `checkOutdatedSoftware`, `detectContext`, `buildBusinessContext`) instead of each running their own `fetch`. That also cuts ~6 redundant requests.
- Keep `HEAD` + probe-based checks on direct `fetch` (security headers, XSS, SQLi, open-redirect).
- Store `screenshot` (base64) and `metadata.title/description` on the `scans` row (new optional columns `screenshot_url`, `page_title`, `page_description`) so the report UI can show them.

### 4. Optional follow-up (gated behind a flag, not in v1)
- `mapSite(url, { limit: 25 })` → scrape top 5 internal pages for CSRF/info-disclosure breadth.
- Surface "JS-rendered detected" badge when Firecrawl HTML differs significantly from raw fetch.

### 5. Cost / safety
- ~1 Firecrawl credit per scan in v1 (single scrape). Map+5 scrapes in v2 ≈ ~6 credits/scan.
- Add per-scan timeout (15s) on Firecrawl call so a slow render can't stall the scan; fall back to raw fetch.
- Guest scan rate limit (5/24h per IP) already caps abuse.

## Open questions for you

1. **Scope**: v1 = single rendered scrape only, or include the multi-page map?
2. **Screenshot in report**: store as base64 in DB row, or upload to a new Supabase storage bucket?
3. **Replace vs augment**: confirm we keep direct `fetch` for active probes (recommended) — full replacement would weaken the active checks.
