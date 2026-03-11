import { NextRequest, NextResponse } from 'next/server';

// Obligatoire pour le déploiement sur Cloudflare Pages via next-on-pages
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // 1. Récupération du paramètre "name" (ex: ?name=5205644)
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return new NextResponse('Paramètre name manquant', { status: 400 });
    }

    // 2. Construction de l'URL cible
    // /!\ REMPLACEZ CETTE LIGNE par la véritable logique ou URL que vous interrogiez
    const targetUrl = `https://base-de-donnees-source.com/images/${name}`;

    // 3. Les en-têtes magiques pour tromper le pare-feu anti-bot d'OVH
    const spoofedHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Referer': 'https://www.google.com/',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    };

    // 4. Lancement de la requête vers OVH avec notre déguisement
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: spoofedHeaders,
    });

    // 5. Gestion des erreurs si OVH bloque toujours ou si l'image n'existe pas
    if (!response.ok) {
      console.error(`[API design-image] Erreur source: ${response.status} ${response.statusText}`);
      return new NextResponse(`Erreur lors de la récupération : ${response.status}`, { status: response.status });
    }

    // 6. Extraction des données binaires de l'image
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 7. Renvoi de l'image propre à votre frontend Next.js
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // On met en cache l'image pendant 24h pour limiter les requêtes vers OVH
        'Cache-Control': 'public, max-age=86400, immutable', 
      },
    });

  } catch (error) {
    console.error('[API design-image] Erreur fatale du serveur:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
