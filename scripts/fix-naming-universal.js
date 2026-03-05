const fs = require("fs");
const path = require("path");

const STORAGE_DIR = "/var/www/designs_storage/";
let moved = 0;

function walkAndFix(currentDir) {
    let items;
    try {
        items = fs.readdirSync(currentDir);
    } catch (e) { return; }

    for (const item of items) {
        const fullPath = path.join(currentDir, item);
        let stats;
        try { stats = fs.statSync(fullPath); } catch (e) { continue; }

        if (stats.isDirectory()) {
            walkAndFix(fullPath); // On plonge dans les sous-dossiers
        } else {
            // C'est un fichier, on regarde s'il commence par "dmf"
            if (item.startsWith("dmf") && item.endsWith(".jpg")) {
                
                // 🧠 L'INTELLIGENCE DU SCRIPT :
                // On cherche "dmf", suivi de pleins de zéros, suivi du VRAI numéro, suivi d'un underscore "_"
                // Ex: "dmf0000000006681_001_002.jpg" -> On capture "6681"
                const match = item.match(/^dmf0*(\d+)_/);
                
                if (match) {
                    const number = match[1]; // C'est le "6681"
                    
                    // On reconstruit le nom propre à 9 chiffres
                    const cleanName = number.padStart(9, "0") + ".jpg";
                    const newPath = path.join(STORAGE_DIR, cleanName);

                    // On déplace et on écrase si besoin (on veut la dernière version)
                    try {
                        if (fullPath !== newPath) {
                            fs.renameSync(fullPath, newPath);
                            moved++;
                            if (moved % 500 === 0) process.stdout.write(`\r🚀 ${moved} mutants corrigés...`);
                        }
                    } catch (err) {
                        // Ignorer les erreurs d'accès
                    }
                }
            }
        }
    }
}

console.log("🧹 DÉMARRAGE DU NETTOYAGE UNIVERSEL...");
console.log("   Je traque tous les fichiers 'dmf*.jpg', peu importe leur suffixe.");

walkAndFix(STORAGE_DIR);

console.log(`\n\n🎉 TERMINÉ ! ${moved} fichiers ont été normalisés.`);

// Petit ménage des dossiers vides
const { execSync } = require("child_process");
try { execSync(`find ${STORAGE_DIR} -mindepth 1 -type d -empty -delete`); } catch(e) {}
