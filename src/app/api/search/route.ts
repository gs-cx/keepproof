import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '24';
  const page = searchParams.get('page') || '1';

  if (!query) {
    return NextResponse.json({ hits: [], error: "Aucune recherche demandée" });
  }

  const apiKey = process.env.CREAGUARD_API_KEY || '';
  const host = 'https://api.creaguard.com';
  const paths = ['/api/search', '/search', '/api/search/', '/search/'];
  
  let lastError = "";

  for (const path of paths) {
    // 🛡️ TENTATIVE 1 : On essaie avec la pagination
    let urlFull = `${host}${path}?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;
    try {
      let res = await fetch(urlFull, {
        headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        let finalHits = Array.isArray(data) ? data : (data.hits || data.results || [data]);
        return NextResponse.json({ hits: finalHits, success: true });
      }
    } catch(e) {}

    // 🛡️ TENTATIVE 2 : SURVIE (Si Python refuse la pagination, on lui donne la formule d'hier)
    let urlPure = `${host}${path}?q=${encodeURIComponent(query)}`;
    try {
      let res = await fetch(urlPure, {
        headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        let finalHits = Array.isArray(data) ? data : (data.hits || data.results || [data]);
        return NextResponse.json({ hits: finalHits, success: true });
      } else {
        lastError = `[${urlPure} -> Code HTTP ${res.status}]`;
      }
    } catch(e) {
        lastError = `[${urlPure} -> Erreur réseau]`;
    }
  }

  return NextResponse.json({ hits: [], error: `Refus total du serveur OVH. Dernier test: ${lastError}` });
}
