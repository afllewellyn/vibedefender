// Firecrawl helper for security-scan. Graceful: returns null when the
// connector is not configured or the request fails so callers fall back
// to raw fetch().

const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';

export interface ScrapeResult {
  html: string;
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    statusCode?: number;
    sourceURL?: string;
  };
}

export async function firecrawlScrape(
  url: string,
  opts: { waitFor?: number; timeoutMs?: number } = {}
): Promise<ScrapeResult | null> {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    console.log('[firecrawl] FIRECRAWL_API_KEY not configured, skipping rendered scrape');
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15000);

  try {
    const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['html', 'markdown'],
        onlyMainContent: false, // we need full DOM for security analysis
        waitFor: opts.waitFor ?? 2000,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.warn(`[firecrawl] Scrape failed ${res.status}: ${text.slice(0, 200)}`);
      return null;
    }

    const json = await res.json();
    // v2 returns { success, data: { html, markdown, metadata } }
    const data = json?.data ?? json;
    const html = data?.html ?? data?.rawHtml;
    if (!html || typeof html !== 'string') {
      console.warn('[firecrawl] Scrape returned no html');
      return null;
    }
    return {
      html,
      markdown: data?.markdown,
      metadata: data?.metadata,
    };
  } catch (err) {
    console.warn('[firecrawl] Scrape error:', (err as Error)?.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
