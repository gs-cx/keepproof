const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";

async function main() {
    console.log("🔗 DÉMARRAGE DU LINKER (Association Base de Données <-> Images)...");

    // 1. On liste TOUS les fichiers du disque une bonne fois pour toutes (c'est lourd mais nécessaire)
    console.log("📂 Lecture du disque (patience, ~450k fichiers)...");
    const files = fs.readdirSync(STORAGE_DIR);
    const fileMap = new Map();

    // On crée un index pour aller vite : "20240026" -> "20240026_01.jpg"
    files.forEach(f => {
        if (!f.endsWith(".jpg")) return;
        
        // Nettoyage du nom pour trouver la clé
        // Ex: "20240026_01.jpg" -> devient "20240026"
        // Ex: "dmf_image_20240026.jpg" -> devient "20240026"
        let key = f.replace(".jpg", "").replace("dmf_image_", "").replace("dmf", "").split("_")[0];
        
        // On stocke la première image trouvée pour cette clé
        if (!fileMap.has(key)) {
            fileMap.set(key, f);
        }
    });

    console.log(`✅ Indexation terminée. ${fileMap.size} images uniques identifiées.`);

    // 2. On récupère les fiches qui n'ont pas d'image (image_file est null)
    console.log("🔍 Récupération des fiches orphelines dans la DB...");
    const orphans = await prisma.inpi_Design.findMany({
        where: { image_file: null },
        select: { id: true, num_enregistrement: true }
    });

    console.log(`🎯 ${orphans.length} fiches ont besoin d'une image.`);
    console.log("🚀 Lancement de la mise à jour massive...");

    let updated = 0;
    let notFound = 0;

    // 3. La boucle de mise à jour
    for (const design of orphans) {
        if (!design.num_enregistrement) continue;

        const key = design.num_enregistrement; // Ex: "20240026"
        const foundFile = fileMap.get(key);

        if (foundFile) {
            // BINGO ! On a trouvé l'image qui correspond au numéro
            await prisma.inpi_Design.update({
                where: { id: design.id },
                data: { image_file: `/designs/${foundFile}` }
            });
            updated++;
        } else {
            notFound++;
        }

        if ((updated + notFound) % 1000 === 0) {
            process.stdout.write(`\rProgression : ${updated} mis à jour | ${notFound} introuvables...`);
        }
    }

    console.log("\n\n🎉 TERMINÉ !");
    console.log(`✅ ${updated} fiches ont retrouvé leur image.`);
    console.log(`❌ ${notFound} fiches restent sans image (peut-être des numéros différents ?).`);
}

main();
