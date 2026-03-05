const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🛠️ DÉBUT DU TEST DIAGNOSTIC...");

    // TEST 1 : La Base de Données
    console.log("\n1️⃣ Test Base de Données (Recherche simple)...");
    const startDB = Date.now();
    try {
        // On cherche un ID qui existe (on vient de les importer)
        const results = await prisma.inpi_Design.findFirst({
            where: { num_enregistrement: { contains: "423" } } // Recherche partielle rapide
        });
        const timeDB = Date.now() - startDB;
        
        if (results) {
            console.log(`✅ Base de données OK en ${timeDB}ms`);
            console.log(`   Résultat trouvé : ${results.titre}`);
        } else {
            console.log("⚠️ Base de données connectée mais aucun résultat trouvé.");
        }
    } catch (e) {
        console.error("❌ ERREUR CRITIQUE BASE DE DONNÉES :", e.message);
        return;
    }

    // TEST 2 : L'IA (Ollama)
    console.log("\n2️⃣ Test IA Ollama (Ping simple)...");
    const startAI = Date.now();
    try {
        const response = await fetch('http://127.0.0.1:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'mistral:latest', // Nom précis vu dans votre commande curl
                messages: [{ role: "user", content: "Dis juste le mot BONJOUR" }],
                stream: false
            })
        });

        const data = await response.json();
        const timeAI = Date.now() - startAI;

        if (data.message && data.message.content) {
            console.log(`✅ IA Ollama OK en ${timeAI}ms`);
            console.log(`   Réponse de l'IA : "${data.message.content.trim()}"`);
        } else {
            console.error("❌ L'IA a répondu mais le format est vide.");
            console.log("Réponse brute:", data);
        }

    } catch (e) {
        console.error("❌ ERREUR CRITIQUE OLLAMA :", e.message);
        console.log("   Vérifiez que Ollama tourne bien sur le port 11434.");
    }

    console.log("\n🏁 Fin du diagnostic.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
