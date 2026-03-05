const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

// Le vrai dossier physique sur le disque
const STORAGE_ROOT = "/var/www/designs_storage/";

async function main() {
    console.log("🕵️‍♂️ AUDIT D'INTÉGRITÉ : BASE DE DONNÉES vs DISQUE DUR...");
    
    // On récupère TOUS les dessins qui ont une image
    // On ne prend que l'ID et le chemin pour ne pas surcharger la mémoire
    const totalCount = await prisma.inpi_Design.count({ where: { image_file: { not: null } } });
    console.log(`📚 Analyse de ${totalCount.toLocaleString()} fiches avec images...`);

    let cursor = null;
    let processed = 0;
    let broken = 0;
    let valid = 0;

    // On procède par paquets de 5000 pour ne pas faire exploser la RAM
    while (true) {
        const batch = await prisma.inpi_Design.findMany({
            take: 5000,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: { image_file: { not: null } },
            select: { id: true, image_file: true, num_enregistrement: true }
        });

        if (batch.length === 0) break;

        for (const doc of batch) {
            // Le chemin en base est : /designs/mon_image.jpg
            // On doit le transformer en : /var/www/designs_storage/mon_image.jpg
            const filename = path.basename(doc.image_file);
            const physicalPath = path.join(STORAGE_ROOT, filename);

            if (fs.existsSync(physicalPath)) {
                valid++;
            } else {
                broken++;
                // Décommentez la ligne suivante pour voir quels fichiers manquent
                // console.log(`❌ MANQUANT : ID ${doc.num_enregistrement} -> ${filename}`);
            }
            processed++;
        }

        cursor = batch[batch.length - 1].id;
        process.stdout.write(`   ... ${processed} vérifiés (Valid: ${valid} | Broken: ${broken})\r`);
    }

    console.log("\n-------------------------------------------");
    console.log("🏁 RÉSULTAT DE L'AUDIT :");
    console.log(`✅ Liens valides   : ${valid.toLocaleString()} (${((valid/processed)*100).toFixed(2)}%)`);
    console.log(`❌ Liens brisés    : ${broken.toLocaleString()}`);
    console.log("-------------------------------------------");

    if (broken === 0) {
        console.log("✨ INTÉGRITÉ PARFAITE ! Votre base est saine à 100%.");
    } else {
        console.log("⚠️  Il manque des fichiers images sur le disque.");
    }
}

main();
