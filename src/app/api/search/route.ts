import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '24';
  const page = searchParams.get('page') || '1';
  const searchType = searchParams.get('type') || 'marque'; // 🚨 NOUVEAU : marque ou design

  if (!query) return NextResponse.json({ hits: [], error: "Aucune recherche demandée" });

  const apiKey = process.env.CREAGUARD_API_KEY || '';
  const host = 'https://api.creaguard.com';
  
  // Aiguillage dynamique vers la bonne route Python
  const endpoint = searchType === 'design' ? '/recherche/design/' : '/recherche/marque/';
  const urlFull = `${host}${endpoint}${encodeURIComponent(query)}?limit=${limit}&page=${page}&_nocache=${Date.now()}`;

  try {
    const res = await fetch(urlFull, {
      method: 'GET',
      headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      let finalHits: any[] = [];
      if (Array.isArray(data)) finalHits = data;
      else if (data.resultats) finalHits = data.resultats;
      else if (data.hits) finalHits = data.hits;
      else if (data.results) finalHits = data.results;

      const mappedHits = finalHits.map((item: any, idx: number) => ({
        id: idx,
        num_enregistrement: item.numero || "Inconnu",
        titre: item.nom_marque || item.titre || `Résultat : ${query.toUpperCase()}`,
        statut: item.statut || "Statut inconnu",
        date: item.date || new Date().toISOString(),
        image_file: item.logo_disponible ? item.numero : "",
        code_office: item.code_office || "FR",
        deposant: item.nom_deposant || item.deposant || "Déposant inconnu",
        description: item.description || "",
        classes: item.classes_inpi || item.classes_locarno || "Non spécifié",
        createur: item.createur || null
      }));

      return NextResponse.json({ hits: mappedHits, success: true });
    } else {
      return NextResponse.json({ hits: [], error: `Erreur OVH HTTP ${res.status}` });
    }
  } catch (error: any) {
    return NextResponse.json({ hits: [], error: `Crash: ${error.message}` });
  }
}
