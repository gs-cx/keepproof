const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const DATA_DIR = '/root/frontend/inpi_backlog';

// On cherche le fichier spécifique que vous avez trouvé
const targetFile = 'BCK_ST66_FR_202448_000001_001.xml.zip';
const filePath = path.join(DATA_DIR, targetFile);

if (!fs.existsSync(filePath)) {
    console.log("❌ Fichier introuvable. Vérifiez le nom.");
} else {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    // On prend le premier fichier XML à l'intérieur
    const xmlEntry = zipEntries.find(entry => entry.entryName.endsWith('.xml'));

    if (xmlEntry) {
        console.log(`🔍 Lecture du fichier : ${xmlEntry.entryName}`);
        const xmlContent = zip.readAsText(xmlEntry);

        // On affiche les 1000 premiers caractères pour voir les balises
        console.log("\n--- DÉBUT DU XML ---");
        console.log(xmlContent.substring(0, 1000));
        console.log("--- FIN DE L'EXTRAIT ---\n");
    } else {
        console.log("❌ Aucun fichier XML trouvé dans le ZIP.");
    }
}
