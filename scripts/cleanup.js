const fs = require('fs');
const path = require('path');

const BACKLOG_DIR = '/root/frontend/inpi_designs_backlog';

console.log("🧹 DÉMARRAGE DU NETTOYAGE...");

try {
    const files = fs.readdirSync(BACKLOG_DIR);
    let deletedCount = 0;

    for (const file of files) {
        // On supprime SEULEMENT les fichiers .zip
        if (file.endsWith('.zip')) {
            fs.unlinkSync(path.join(BACKLOG_DIR, file));
            deletedCount++;
        }
    }
    console.log(`✅ ${deletedCount} fichiers ZIP supprimés.`);
    console.log("💿 Espace disque libéré !");
} catch (e) {
    console.error("Erreur :", e);
}
