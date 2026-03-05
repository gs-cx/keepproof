const fs = require("fs");
const path = require("path");

const STORAGE_DIR = "/var/www/designs_storage/";
let moved = 0;

function walkAndFix(currentDir) {
    let items;
    try {
        items = fs.readdirSync(currentDir);
    } catch (e) {
        return; // Dossier inaccessible, on passe
    }

    for (const item of items) {
        const fullPath = path.join(currentDir, item);
        let stats;
        
        try { stats = fs.statSync(fullPath); } catch (e) { continue; }

        if (stats.isDirectory()) {
            // 🔄 RÉCURSION : On plonge dans le sous-dossier
            walkAndFix(fullPath);
        } else {
            // 📄 FICHIER : On vérifie si c'est une image à sauver
            if (item.startsWith("dmf") && item.includes("_001.jpg")) {
                try {
                    // Extraction du numéro propre (ex: "dmf0000000977741_001.jpg" -> "977741")
                    let coreNumber = item.replace("dmf", "").split("_")[0];
                    coreNumber = parseInt(coreNumber).toString(); // Supprime les zéros inutiles
                    
                    // Formatage propre : "000977741.jpg"
                    const cleanName = coreNumber.padStart(9, "0") + ".jpg";
                    const newPath = path.join(STORAGE_DIR, cleanName);

                    // On ne déplace que si le fichier n'est pas déjà au bon endroit
                    if (fullPath !== newPath) {
                        fs.renameSync(fullPath, newPath);
                        moved++;
                        
                        if (moved % 500 === 0) {
                            process.stdout.write(`\r🚀 ${moved} images sauvées et renommées...`);
                        }
                    }
                } catch (err) {
                    // On ignore les erreurs individuelles pour ne pas stopper le script
                }
            }
        }
    }
}

console.log("🧹 DÉMARRAGE DU NETTOYAGE RÉCURSIF (Mode sans échec)...");
console.log("   Patience, j'inspecte chaque dossier...");

walkAndFix(STORAGE_DIR);

console.log(`\n\n🎉 TERMINÉ ! ${moved} fichiers ont été renommés et déplacés.`);

// Nettoyage final des dossiers vides (optionnel, via commande système simple)
const { execSync } = require("child_process");
try {
    console.log("🗑️ Suppression des dossiers vides...");
    execSync(`find ${STORAGE_DIR} -mindepth 1 -type d -empty -delete`);
} catch(e) {}
