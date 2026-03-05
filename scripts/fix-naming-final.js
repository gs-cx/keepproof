const fs = require("fs");
const path = require("path");

const STORAGE_DIR = "/var/www/designs_storage/";
let moved = 0;

function walkAndFix(currentDir) {
    let items;
    try { items = fs.readdirSync(currentDir); } catch (e) { return; }

    for (const item of items) {
        const fullPath = path.join(currentDir, item);
        let stats;
        try { stats = fs.statSync(fullPath); } catch (e) { continue; }

        if (stats.isDirectory()) {
            walkAndFix(fullPath);
        } else {
            // ✅ On accepte JPG, PNG, GIF (minuscule ou majuscule)
            if (item.match(/^dmf.*(\.jpg|\.jpeg|\.png|\.gif)$/i)) {
                
                // Regex puissante : Capture le numéro "720412" dans "dmf000...720412_001.gif"
                // On ignore les zéros du début
                const match = item.match(/dmf0*(\d+)_/i);
                
                if (match) {
                    const number = match[1];
                    const ext = path.extname(item).toLowerCase(); // .gif, .jpg...
                    
                    // Nom propre : 000720412.gif
                    const cleanName = number.padStart(9, "0") + ext;
                    const newPath = path.join(STORAGE_DIR, cleanName);

                    try {
                        // On déplace à la racine (si ce n'est pas déjà fait)
                        if (fullPath !== newPath) {
                            fs.renameSync(fullPath, newPath);
                            moved++;
                            if (moved % 500 === 0) process.stdout.write(`\r🚀 ${moved} images (tous formats) sauvées...`);
                        }
                    } catch (err) {}
                }
            }
        }
    }
}

console.log("🧹 DÉMARRAGE DU NETTOYAGE ULTIME (JPG + GIF + PNG)...");
walkAndFix(STORAGE_DIR);
console.log(`\n\n🎉 TERMINÉ ! ${moved} images ont été normalisées.`);

// Ménage des dossiers vides
const { execSync } = require("child_process");
try { execSync(`find ${STORAGE_DIR} -mindepth 1 -type d -empty -delete`); } catch(e) {}
