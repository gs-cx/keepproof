import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ hits: [], error: "Aucune recherche demandée" });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.CREAGUARD_API_KEY;

    if (!apiUrl) {
      return NextResponse.json({ hits: [], error: "URL OVH introuvable dans Cloudflare." });
    }

    const ovhUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    // 🚨 LE MIRACLE EST ICI : On conserve TOUS les paramètres (q, limit, page) intacts !
    const queryString = searchParams.toString(); 

    // On teste les chemins les plus probables pour contourner le 404 de FastAPI
    const pathsToTry = [
        `/api/search?${queryString}`,
        `/search?${queryString}`,
        `/api/v1/search?${queryString}`
    ];

    let res;
    let lastErrorText = "";

    for (const path of pathsToTry) {
        const fullUrl = `${ovhUrl}${path}`;
        try {
            res = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey || '',
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                break; // Dès qu'un chemin fonctionne (Code 200), on arrête de chercher !
            } else {
                lastErrorText = await res.text();
            }
        } catch (e: any) {
            lastErrorText = e.message;
        }
    }

    // Si aucun des 3 chemins n'a fonctionné
    if (!res || !res.ok) {
      return NextResponse.json({ hits: [], error: `OVH a refusé la connexion (404/422). Dernier message: ${lastErrorText}` });
    }

    const data = await res.json();
    
    // 🚨 FORMATAGE PARFAIT : On s'assure de renvoyer le mot "hits" que la page frontend réclame
    let finalHits = [];
    if (Array.isArray(data)) finalHits = data;
    else if (data.hits) finalHits = data.hits;
    else if (data.results) finalHits = data.results;
    else finalHits = [data];

    return NextResponse.json({ hits: finalHits, success: true });

  } catch (error: any) {
    return NextResponse.json({ hits: [], error: `Crash interne du Proxy Cloudflare: ${error.message}` });
  }
}
