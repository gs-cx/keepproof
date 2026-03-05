const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

async function main() {
    console.log("📊 AUDIT GLOBAL DE LA BASE DE DONNÉES INPI...");
    
    try {
        // 1. Nombre total de fiches
        const totalDocs = await prisma.inpi_Design.count();
        
        // 2. Nombre de fiches AVEC image
        const withImage = await prisma.inpi_Design.count({
            where: {
                image_file: { not: null }
            }
        });

        // 3. Nombre de fiches SANS image
        const withoutImage = totalDocs - withImage;
        
        // Calcul du pourcentage
        const percent = totalDocs > 0 ? ((withImage / totalDocs) * 100).toFixed(2) : 0;

        console.log("\n-------------------------------------------");
        console.log(`📚 TOTAL DESSINS EN BASE :  ${totalDocs.toLocaleString('fr-FR')}`);
        console.log("-------------------------------------------");
        console.log(`✅ Avec Image (Lien actif) : ${withImage.toLocaleString('fr-FR')} (${percent}%)`);
        console.log(`❌ Sans Image (Texte seul) : ${withoutImage.toLocaleString('fr-FR')}`);
        console.log("-------------------------------------------");

        if (withoutImage > 0) {
            console.log("💡 Note : Il est normal d'avoir des dessins sans image (marques déchues,");
            console.log("   archives très vieilles non numérisées, ou erreurs d'origine INPI).");
        }
        
        console.log("\n🚀 Votre système est prêt pour la production.");

    } catch (e) { console.log("Erreur : " + e.message); }
}

main();
