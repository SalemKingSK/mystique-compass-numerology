import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let url = process.env.INGEST_VAULT_URL?.trim();

  if (!url) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    if (host) url = `https://${host}/ingestVaultNow`;
  }

  if (!url) {
    return NextResponse.json({ ok: false, error: 'INGEST_VAULT_URL not configured.' }, { status: 500 });
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!r.ok) {
      const body = await r.text();
      return NextResponse.json({ ok: false, error: `HTTP ${r.status}: ${body.slice(0, 200)}` }, { status: 502 });
    }

    const data = await r.json();
    return NextResponse.json({ ok: true, ...data });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
