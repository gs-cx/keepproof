import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) return new NextResponse('Nom manquant', { status: 400 });

  const apiKey = process.env.CREAGUARD_API_KEY || '';
  const urlFull = `https://api.creaguard.com/image/marque/${name}`;

  try {
    const res = await fetch(urlFull, {
      method: 'GET',
      headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      const txt = await res.text();
      return new NextResponse(`Refus OVH ${res.status}: ${txt}`, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400'
      },
    });
  } catch (error: any) {
    return new NextResponse(`Crash Cloudflare: ${error.message}`, { status: 500 });
  }
}
