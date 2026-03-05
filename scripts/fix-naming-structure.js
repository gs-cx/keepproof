const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const STORAGE_DIR = "/var/www/designs_storage/";

async function main() {
    console.log("🧹 DÉMARRAGE DU GRAND NETTOYAGE...");
    console.log("   Objectif : Sortir les images des sous-dossiers et les renommer.");

    try {
        // 1. On cherche tous les fichiers 'dmf*.jpg' (y compris dans les sous-dossiers)
        // On utilise 'find' du système car c'est 100x plus rapide que Node pour ça
        console.log("🔍 Recherche des fichiers dispersés (patience)...");
        const output = execSync(`find ${STORAGE_DIR} -name "dmf*.jpg"`).toString();
        const files = output.split("\n").filter(f => f.length > 0);

        console.log(`🎯 ${files.length} fichiers trouvés à traiter.`);
        
        let moved = 0;
        let skipped = 0;

        for (const oldPath of files) {
            const filename = path.basename(oldPath);

            // On ne s'intéresse qu'à la vue principale (_001) pour l'instant
            // Ex: dmf0000000977741_001.jpg
            if (filename.includes("_001.jpg")) {
                
                // Extraction du numéro propre
                // On enlève "dmf", on enlève les zéros, on enlève "_001.jpg"
                // On garde juste "977741"
                let coreNumber = filename.replace("dmf", "").split("_")[0];
                coreNumber = parseInt(coreNumber).toString(); // Enlève les zéros superflus
                
                // On reformate en 9 chiffres standard : "000977741.jpg"
                const cleanName = coreNumber.padStart(9, "0") + ".jpg";
                const newPath = path.join(STORAGE_DIR, cleanName);

                // Déplacement et Renommage
                try {
                    fs.renameSync(oldPath, newPath);
                    moved++;
                    
                    if (moved % 1000 === 0) process.stdout.write(`\r✅ ${moved} images traitées...`);
                } catch (e) {
                    console.log(`❌ Erreur sur ${filename}: ${e.message}`);
                }
            } else {
                // C'est une vue secondaire (_002, _003...), on laisse de côté pour l'instant
                skipped++;
            }
        }

        console.log(`\n\n🎉 TERMINÉ !`);
        console.log(`✅ ${moved} images principales renommées et déplacées à la racine.`);
        console.log(`⏩ ${skipped} vues secondaires ignorées (restées dans les dossiers).`);

        // Nettoyage final des dossiers vides
        console.log("🧹 Suppression des dossiers vides devenus inutiles...");
        try {
            execSync(`find ${STORAGE_DIR} -type d -empty -delete`);
        } catch (e) {}

    } catch (e) {
        console.log("❌ Erreur critique : " + e.message);
    }
}

main();
