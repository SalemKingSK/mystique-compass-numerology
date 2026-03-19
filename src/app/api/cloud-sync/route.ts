import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // ── 1. Resolve the Cloud Function URL ────────────────────────────────────────
  //    For Firebase App Hosting  → set in apphosting.yaml  (INGEST_VAULT_URL)
  //    For Firebase Studio preview → set in .env            (INGEST_VAULT_URL)
  let url = process.env.INGEST_VAULT_URL?.trim();

  // ── 2. Fallback: use the current origin if no URL is configured ─────────────
  if (!url) {
    const origin = req.headers.get('origin') ||
                   req.headers.get('x-forwarded-host') ||
                   req.headers.get('host');
    if (origin) {
      const base = origin.startsWith('http') ? origin : `https://${origin}`;
      url = `${base}/ingestVaultNow`;
    }
  }

  if (!url) {
    return NextResponse.json(
      { ok: false, error: 'INGEST_VAULT_URL is not configured.' },
      { status: 500 }
    );
  }

  // ── 3. Call the Cloud Function ────────────────────────────────────────────────
  try {
    const controller = new AbortController();
    // Timeout set to 55 minutes to match Cloud Function maximum run time
    const timer = setTimeout(() => controller.abort(), 55 * 60 * 1000);

    const r = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal:  controller.signal,
    });

    clearTimeout(timer);

    if (!r.ok) {
      const body = await r.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Cloud Function returned HTTP ${r.status}. ${
            r.status === 404
              ? 'Function not found — confirm it is deployed.'
              : body.slice(0, 300)
          }`,
        },
        { status: 502 }
      );
    }

    const data = await r.json();
    return NextResponse.json({ ok: true, ...data });

  } catch (e: unknown) {
    const isAbort = e instanceof Error && e.name === 'AbortError';
    const msg = isAbort
      ? 'Request timed out — function is still running in the background.'
      : (e instanceof Error ? e.message : String(e));

    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
