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
  
  const urlFull = `${host}/recherche/marque/${encodeURIComponent(query)}?limit=${limit}&page=${page}&_nocache=${Date.now()}`;

  try {
    const res = await fetch(urlFull, {
      method: 'GET',
      headers: { 
        'x-api-key': apiKey, 
        'Authorization': `Bearer ${apiKey}`, 
        'Content-Type': 'application/json' 
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      
      // 🚨 LA CORRECTION EST ICI : On lit le tableau "resultats" en français !
      let finalHits = [];
      if (Array.isArray(data)) finalHits = data;
      else if (data.resultats) finalHits = data.resultats;
      else if (data.hits) finalHits = data.hits;
      else if (data.results) finalHits = data.results;

      return NextResponse.json({ hits: finalHits, success: true });
    } else {
      const errorText = await res.text();
      return NextResponse.json({ hits: [], error: `Erreur OVH HTTP ${res.status}: ${errorText}` });
    }
  } catch (error: any) {
    return NextResponse.json({ hits: [], error: `Impossible de joindre OVH: ${error.message}` });
  }
}
