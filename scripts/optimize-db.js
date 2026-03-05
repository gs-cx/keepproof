const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Optimisation de la Base de Données (Création d'Index GIN)...");
    console.log("⚠️  Cela peut prendre 2 à 5 minutes pour 3 millions de lignes. Ne coupez pas !");

    try {
        // 1. Activer l'extension pour la recherche de texte floue
        await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
        console.log("✅ Extension pg_trgm activée.");

        // 2. Créer l'index sur les TITRES (Le plus critique)
        console.log("⏳ Création de l'index sur les Titres...");
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "inpi_design_titre_trgm_idx" 
            ON "inpi_design" 
            USING GIN (titre gin_trgm_ops);
        `);
        console.log("✅ Index Titre CRÉÉ !");

        // 3. Créer l'index sur les DESCRIPTIONS
        console.log("⏳ Création de l'index sur les Descriptions...");
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "inpi_design_description_trgm_idx" 
            ON "inpi_design" 
            USING GIN (description gin_trgm_ops);
        `);
        console.log("✅ Index Description CRÉÉ !");

    } catch (e) {
        console.error("❌ Erreur SQL:", e.message);
    }
    
    console.log("\n🏁 Terminé ! La recherche textuelle est maintenant instantanée.");
}

main()
  .finally(async () => await prisma.$disconnect());
