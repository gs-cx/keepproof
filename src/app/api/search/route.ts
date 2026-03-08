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
  
  // On teste tous les formats d'URL pour être sûr de taper dans la bonne porte
  const paths = [
    '/api/search', 
    '/search', 
    '/api/v1/search',
    '/api/search/', 
    '/search/'
  ];

  let logs = [];
  let successData = null;

  for (const path of paths) {
    // 🧨 TENTATIVE 1 : Pagination + DESTRUCTEUR DE CACHE
    let urlFull = `${host}${path}?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&_nocache=${Date.now()}`;
    try {
      let res = await fetch(urlFull, {
        headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        cache: 'no-store' // Interdiction absolue de garder en mémoire
      });
      if (res.ok) {
        successData = await res.json();
        break; // On a trouvé la bonne porte, on sort !
      } else {
        let txt = await res.text();
        logs.push(`[${path} (Paginé) -> ${res.status}: ${txt.substring(0, 20)}]`);
      }
    } catch(e: any) { logs.push(`[${path} -> Crash]`); }

    // 🧨 TENTATIVE 2 : Survie (sans pagination) + DESTRUCTEUR DE CACHE
    let urlPure = `${host}${path}?q=${encodeURIComponent(query)}&_nocache=${Date.now()}`;
    try {
      let res = await fetch(urlPure, {
        headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        successData = await res.json();
        break;
      } else {
        let txt = await res.text();
        logs.push(`[${path} (Simple) -> ${res.status}: ${txt.substring(0, 20)}]`);
      }
    } catch(e: any) { logs.push(`[${path} -> Crash]`); }
  }

  // SI CA MARCHE
  if (successData) {
      let finalHits = Array.isArray(successData) ? successData : (successData.hits || successData.results || [successData]);
      return NextResponse.json({ hits: finalHits, success: true });
  }

  // SI CA ECHOUE TOUJOURS EN 404 (Cas spécial FastAPI 0 résultat)
  const all404 = logs.every(log => log.includes('404'));
  if (all404) {
      return NextResponse.json({ 
          hits: [], 
          error: `OVH a répondu 404 partout. Soit la route n'existe pas, soit OVH renvoie 404 quand il y a 0 résultat. Testez avec "langue". Historique: ${logs.join(' | ')}`
      });
  }

  return NextResponse.json({ hits: [], error: `Echec global. Historique: ${logs.join(' | ')}` });
}
