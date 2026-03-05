const { MeiliSearch } = require('meilisearch');
const path = require('path');

// CORRECTIF : On force le chemin absolu vers le fichier .env
// __dirname = le dossier 'scripts'
// '../.env' = le dossier 'frontend' où se trouve le fichier
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('🔑 Clé utilisée :', process.env.MEILISEARCH_KEY ? 'Chargée ✅' : 'MANQUANTE ❌');

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_KEY,
});

const brands = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Apple' },
  { id: 4, name: 'Coca-Cola' },
  { id: 5, name: 'KeepProof' },
  { id: 6, name: 'Google' },
  { id: 7, name: 'Microsoft' },
  { id: 8, name: 'Amazon' },
  { id: 9, name: 'Tesla' },
  { id: 10, name: 'Louis Vuitton' },
  { id: 11, name: 'Netflix' }
];

(async () => {
  console.log('🚀 Démarrage de l\'indexation locale...');
  
  try {
    const index = client.index('brands');
    
    console.log('⚙️  Configuration de l\'intelligence...');
    await index.updateTypoTolerance({
      minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }
    });

    console.log('📥 Injection des marques...');
    const response = await index.addDocuments(brands);
    
    console.log('✅ Succès ! Task UID:', response.taskUid);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === 'missing_authorization_header') {
        console.log('👉 La clé est vide. Vérifiez votre fichier .env');
    }
  }
})();
