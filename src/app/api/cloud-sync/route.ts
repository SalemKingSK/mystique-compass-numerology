/**
 * app/api/cloud-sync/route.ts
 *
 * Server-side proxy → ingestVaultNow Cloud Function.
 * Browser calls /api/cloud-sync (same origin, no CORS).
 * Server calls the Cloud Function — no browser restrictions apply.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // ── 1. Resolve the Cloud Function URL ────────────────────────────────────────
  //    For Firebase App Hosting  → set in apphosting.yaml  (INGEST_VAULT_URL)
  //    For Firebase Studio preview → set in .env            (INGEST_VAULT_URL)
  //    Format: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/ingestVaultNow
  let url = process.env.INGEST_VAULT_URL?.trim();

  // ── 2. Fallback: use the firebase.json hosting rewrite ────────────────────────
  //    firebase.json rewrites /ingestVaultNow → function ingestVaultNow
  //    So calling the hosting origin + /ingestVaultNow works as a fallback.
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
      {
        ok: false,
        error:
          'INGEST_VAULT_URL is not configured. ' +
          'Add it to apphosting.yaml (production) or .env (Studio preview). ' +
          'Value: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/ingestVaultNow',
      },
      { status: 500 },
    );
  }

  // ── 3. Call the Cloud Function ────────────────────────────────────────────────
  try {
    const controller = new AbortController();
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
          error: `Cloud Function returned HTTP ${r.status}. ` +
                 (r.status === 404
                   ? 'Function not found — verify your Project ID in INGEST_VAULT_URL and confirm the function is deployed (firebase deploy --only functions).'
                   : body.slice(0, 300)),
        },
        { status: 502 },
      );
    }

    const data = await r.json();
    return NextResponse.json({ ok: true, ...data });

  } catch (e: unknown) {
    const isAbort = e instanceof Error && e.name === 'AbortError';
    const msg = isAbort
      ? 'Request timed out — the function is still running in the background.'
      : (e instanceof Error ? e.message : String(e));

    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
