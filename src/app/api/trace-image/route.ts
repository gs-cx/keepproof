import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const apiKey = process.env.CREAGUARD_API_KEY || '';
  const host = 'https://api.creaguard.com';
  
  // Le scanner va interroger votre base Python pour ces 5 grandes marques
  const testBrands = ['nike', 'apple', 'dior', 'chanel', 'renault'];
  
  let results: any = {};
  let totalImagesFound = 0;

  for (const brand of testBrands) {
    try {
      const res = await fetch(`${host}/recherche/marque/${brand}?limit=50`, {
        method: 'GET',
        headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}` },
        cache: 'no-store'
      });
      
      if (res.ok) {
        const data = await res.json();
        const hits = Array.isArray(data) ? data : (data.resultats || data.hits || data.results || []);
        
        // On compte combien d'archives Python déclare comme ayant un logo
        const withLogo = hits.filter((h: any) => h.logo_disponible === true);
        totalImagesFound += withLogo.length;

        results[brand] = {
          "1_total_archives_trouvees": hits.length,
          "2_archives_AVEC_logo": withLogo.length,
          "3_exemples_numeros_avec_logo": withLogo.map((h:any) => h.numero).slice(0, 3)
        };
      } else {
         results[brand] = "Erreur HTTP " + res.status;
      }
    } catch(e:any) {
       results[brand] = "Crash: " + e.message;
    }
  }

  // Le verdict
  return NextResponse.json({
      "DIAGNOSTIC_FINAL": "ANALYSE GLOBALE DE LA BASE DE DONNEES PYTHON",
      "TOTAL_IMAGES_TROUVEES": totalImagesFound,
      "CONCLUSION": totalImagesFound === 0 
        ? "🚨 BUG PYTHON DÉTECTÉ : Votre base OVH renvoie 'logo_disponible: false' pour absolument TOUTES les marques. Le site web est parfait, c'est le script Python ou la base qu'il faut corriger !" 
        : "✅ LA BASE FONCTIONNE : Des images existent. Testez une recherche sur votre site avec l'une des marques ci-dessous.",
      "DETAILS_PAR_MARQUE": results
  }, { status: 200 });
}
