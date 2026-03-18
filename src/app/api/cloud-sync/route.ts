/**
 * app/api/cloud-sync/route.ts
 *
 * Server-side proxy for the ingestVaultNow Cloud Function.
 * The browser calls /api/cloud-sync (same origin — no CORS).
 * This server then calls the Cloud Function — no browser CORS restriction.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const url = process.env.INGEST_VAULT_URL; // ← server-only (no NEXT_PUBLIC_)

  if (!url) {
    return NextResponse.json(
      { ok: false, error: 'INGEST_VAULT_URL is not set in environment variables.' },
      { status: 500 },
    );
  }

  try {
    const r = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      // Server-side fetch has no CORS restriction — no special headers needed
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { ok: false, error: `Cloud Function returned HTTP ${r.status}: ${text}` },
        { status: 502 },
      );
    }

    const data = await r.json();
    return NextResponse.json({ ok: true, ...data });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
