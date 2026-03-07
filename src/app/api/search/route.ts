import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  // Rétablissement crucial de la pagination
  const limit = searchParams.get('limit') || '24';
  const page = searchParams.get('page') || '1';

  if (!query) {
    return NextResponse.json({ hits: [], error: "Aucune recherche demandée" });
  }

  const apiKey = process.env.CREAGUARD_API_KEY || '';
  
  // Le Bélier : On teste toutes les connexions réseau possibles
  const hosts = [
    'https://api.creaguard.com',
    'http://51.91.196.115',
    'http://51.91.196.115:8000'
  ];

  const queryString = `q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;

  const paths = [
    `/api/search?${queryString}`,
    `/search?${queryString}`,
    `/api/v1/search?${queryString}`
  ];

  let lastError = "";

  for (const host of hosts) {
    for (const path of paths) {
      const fullUrl = `${host}${path}`;
      try {
        const res = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          
          // Formatage blindé pour l'affichage de la page
          let finalHits = [];
          if (Array.isArray(data)) finalHits = data;
          else if (data.hits) finalHits = data.hits;
          else if (data.results) finalHits = data.results;
          else finalHits = [data];

          return NextResponse.json({ hits: finalHits, success: true });
        } else {
          lastError = `[${fullUrl} -> Code HTTP ${res.status}]`;
        }
      } catch (err: any) {
        lastError = `[${fullUrl} -> Erreur réseau]`;
      }
    }
  }

  return NextResponse.json({ hits: [], error: `Toutes les connexions à OVH ont échoué. Dernier test: ${lastError}` });
}
