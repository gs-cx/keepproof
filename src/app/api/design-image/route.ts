import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return new NextResponse('Nom d\'image manquant', { status: 400 });
  }

  const apiKey = process.env.CREAGUARD_API_KEY || '';
  const host = 'https://api.creaguard.com';
  const urlFull = `${host}/image/marque/${name}`;

  try {
    const res = await fetch(urlFull, {
      method: 'GET',
      headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}` },
      cache: 'public'
    });

    if (!res.ok) {
      return new NextResponse('Image introuvable', { status: 404 });
    }

    // 🚀 Streaming ultra-rapide de l'image (zéro crash mémoire)
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400'
      },
    });
  } catch (error: any) {
    return new NextResponse('Erreur proxy', { status: 500 });
  }
}
