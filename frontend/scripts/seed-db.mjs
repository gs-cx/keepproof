import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";

// 1. VOS DONNÉES (La Connaissance à injecter)
const faqData = [
  {
    question: "Quelle est la valeur juridique de KeepProof ?",
    answer: "KeepProof utilise la Blockchain (Polygon) pour créer un ancrage horodaté infalsifiable. Cela constitue une preuve d'antériorité admissible en justice (Art L.112-1 CPI) conforme aux standards de preuve numérique."
  },
  {
    question: "Combien de temps ma preuve est-elle valable ?",
    answer: "Votre preuve est valable à vie. Contrairement à un abonnement cloud ou un e-mail, l'empreinte numérique est gravée dans la Blockchain publique indéfiniment."
  },
  {
    question: "Est-ce que KeepProof voit mes fichiers ?",
    answer: "Non, jamais. Nous utilisons une technologie 'Confidentialité Totale'. Le calcul de l'empreinte (Hash) se fait sur votre navigateur. Seul ce code unique est envoyé au serveur. Votre fichier original ne quitte jamais votre ordinateur."
  },
  {
    question: "Quels types de fichiers puis-je protéger ?",
    answer: "Tous les types : Audio (MP3, WAV), Images (JPG, PNG), Documents (PDF, Word), Vidéos ou Code source. La taille maximale recommandée est de 500 Mo via l'interface web."
  },
  {
    question: "Où sont hébergées les données ?",
    answer: "L'interface et les bases de données utilisateurs sont hébergées en France. L'ancrage de la preuve est répliqué sur des milliers de nœuds de la Blockchain Polygon à travers le monde, garantissant son indestructibilité."
  }
];

async function main() {
  console.log("🤖 Démarrage de l'apprentissage...");

  // 2. CONFIGURATION DU CERVEAU (Ollama - Mistral)
  // On utilise l'IP 172.17.0.1 qui correspond généralement à l'hôte (VPS) depuis le conteneur
  const embeddings = new OllamaEmbeddings({
    model: "mistral", 
    baseUrl: "http://172.17.0.1:11434", 
  });

  // 3. PRÉPARATION DES DOCUMENTS
  // On combine Question + Réponse pour que l'IA trouve le sens global
  const documents = faqData.map(item => `QUESTION: ${item.question}\nREPONSE: ${item.answer}`);
  const metadatas = faqData.map(item => ({ source: "faq-officielle" }));

  console.log(`📊 Vectorisation de ${documents.length} articles de connaissance...`);

  // 4. STOCKAGE DANS LA MÉMOIRE (ChromaDB)
  await Chroma.fromTexts(
    documents,
    metadatas,
    embeddings,
    {
      collectionName: "keepproof-knowledge",
      url: "http://chromadb:8000", // Nom du conteneur DB
    }
  );

  console.log("✅ SUCCÈS ! La base de connaissance est à jour.");
  console.log("🧠 L'IA connaît maintenant vos règles juridiques.");
}

main().catch((err) => {
  console.error("❌ ERREUR :", err);
  process.exit(1);
});
