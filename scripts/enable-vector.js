const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔌 Activation de l'extension VECTOR...");
    
    // 1. Activer l'extension
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log("✅ Extension activée.");

    // 2. Ajouter la colonne 'embedding' à votre table (taille 512 pour CLIP-ViT-B-32)
    console.log("Travailler sur la structure de la table...");
    await prisma.$executeRawUnsafe(`
        ALTER TABLE "inpi_design" 
        ADD COLUMN IF NOT EXISTS embedding vector(512);
    `);
    
    // 3. Créer un index pour la recherche rapide (HNSW) - Optionnel pour l'instant car lourd
    // On le fera plus tard quand les données seront là.
    
    console.log("✅ Colonne 'embedding' créée ! Prêt à recevoir l'IA.");
}

main().finally(() => prisma.$disconnect());
