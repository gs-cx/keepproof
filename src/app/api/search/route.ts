import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.CREAGUARD_API_KEY;

    if (!apiUrl) {
      console.error("URL OVH manquante dans les variables");
      return NextResponse.json({ results: [] });
    }

    // Nettoyage de l'URL pour éviter les doubles slashes
    const ovhUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    // Le serveur Cloudflare Edge fait la requête vers OVH en coulisses
    let res = await fetch(`${ovhUrl}/api/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey || '',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Si le chemin /api/search n'existe pas sur OVH, on tente la racine /search
    if (!res.ok) {
      res = await fetch(`${ovhUrl}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey || '',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
         throw new Error(`Erreur du serveur OVH: ${res.status}`);
      }
    }

    const data = await res.json();
    
    // On s'assure de renvoyer le tableau sous la forme { results: [...] } attendue par le frontend
    return NextResponse.json({ results: data.results || data });

  } catch (error) {
    console.error("Erreur de connexion du Proxy vers OVH:", error);
    return NextResponse.json({ results: [] });
  }
}
