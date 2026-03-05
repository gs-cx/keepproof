import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
  apiKey: 'MXMJooEjWtujkylMD8rXwzbFgUrHNTg4KA6Rk59oXFM='
});

async function check() {
  try {
    const index = client.index('designs');

    console.log("🔍 --- DIAGNOSTIC BASE DE DONNÉES ---");

    // 1. Vérifier le nombre de documents
    const stats = await index.getStats();
    console.log(`📚 Nombre total de dessins en base : ${stats.numberOfDocuments}`);

    // 2. Inspecter la structure d'un dessin au hasard
    // (Pour voir si les champs 'titre' et 'deposant' sont bien remplis)
    const randomSearch = await index.search('', { limit: 1 });
    
    if (randomSearch.hits.length > 0) {
        console.log("\n📄 EXEMPLE DE FICHE (Premier résultat trouvé) :");
        console.log(JSON.stringify(randomSearch.hits[0], null, 2));
    } else {
        console.log("\n⚠️ ALERTE : La base semble vide (0 résultats).");
    }

    // 3. Test spécifique sur PEUGEOT
    console.log("\n🕵️‍♂️ Test de recherche 'Peugeot'...");
    const search = await index.search('Peugeot'); 
    
    if (search.hits.length > 0) {
        console.log(`✅ SUCCÈS : ${search.estimatedTotalHits} résultats trouvés pour 'Peugeot'.`);
        console.log(`   Exemple : "${search.hits[0].titre}" (${search.hits[0].date})`);
    } else {
        console.log("❌ ÉCHEC : Aucun résultat pour 'Peugeot'.");
    }

  } catch (e) {
    console.error("Erreur technique :", e.message);
  }
}

check();
