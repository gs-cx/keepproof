const fs = require('fs');
const path = require('path');

const IMAGE_DIR = '/root/inpi_designs_backlog';
const OUTPUT_FILE = '/root/frontend/real-images.json';

console.log("🔍 Démarrage de l'indexation des images réelles...");
console.log(`📂 Dossier source : ${IMAGE_DIR}`);

const index = {};
let count = 0;

if (fs.existsSync(IMAGE_DIR)) {
    const files = fs.readdirSync(IMAGE_DIR);

    files.forEach(file => {
        if (file.toLowerCase().endsWith('.jpg')) {
            // EXPLICATION DE LA MAGIE :
            // On transforme "dmf0000000423367_001.jpg" en l'ID "423367"
            // Comme ça, si le site cherche "423367", on saura quel fichier donner.

            const match = file.match(/(\d+)/); // Trouve la première suite de chiffres
            if (match) {
                // On nettoie les zéros inutiles (ex: 000423 -> 423)
                const id = parseInt(match[1], 10).toString();
                index[id] = file;
                count++;
            }
        }
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index));
    console.log(`✅ Indexation terminée !`);
    console.log(`📊 ${count} images trouvées et indexées.`);
    console.log(`💾 Carte sauvegardée : ${OUTPUT_FILE}`);
} else {
    console.error("❌ Dossier introuvable !");
}
