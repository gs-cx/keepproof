import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = `%${q}%`;

  try {
    // 1. Recherche dans les MARQUES
    // On sélectionne les colonnes standards que le site connaît déjà
    const sqlMarques = `
      SELECT 
        id, 
        nom_marque, 
        num_depot, 
        date_depot, 
        deposant, 
        statut,
        'marque' as type 
      FROM marques 
      WHERE nom_marque ILIKE $1 OR num_depot ILIKE $1
      LIMIT 25
    `;

    // 2. Recherche dans les DESSINS
    // ASTUCE : On renomme les colonnes (ALIAS) pour que le site les affiche correctement
    // titre -> devient nom_marque
    // demandeur -> devient deposant
    const sqlDessins = `
      SELECT 
        id, 
        titre as nom_marque, 
        num_depot, 
        date_depot, 
        demandeur as deposant, 
        'ENREGISTRÉE' as statut,
        'dessin' as type 
      FROM dessins 
      WHERE titre ILIKE $1 OR num_depot ILIKE $1
      LIMIT 25
    `;
    
    // On lance les deux recherches en parallèle
    const [resMarques, resDessins] = await Promise.all([
      query(sqlMarques, [searchTerm]),
      query(sqlDessins, [searchTerm])
    ]);

    // On fusionne les résultats
    const mixedResults = [
        ...resMarques.rows, 
        ...resDessins.rows
    ];

    return NextResponse.json({ results: mixedResults });
    
  } catch (error) {
    console.error('Erreur API Search:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
