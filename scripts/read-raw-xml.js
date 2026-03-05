const fs = require("fs");
const path = require('path');

const EXTRACT_DIR = "/root/frontend/temp_xml_folder";

async function main() {
    try {
        // On récupère le fichier extrait précédemment
        const files = fs.readdirSync(EXTRACT_DIR).filter(f => f.endsWith('.xml'));
        
        if (files.length === 0) {
            console.log("❌ Plus de fichier XML ? Relancez l'étape précédente svp.");
            return;
        }

        const targetFile = files[0];
        console.log(`🧐 Lecture brute de : ${targetFile}`);
        console.log("--------------------------------------------------");
        
        const content = fs.readFileSync(path.join(EXTRACT_DIR, targetFile), 'utf8');
        
        // On affiche les 2000 premiers caractères pour repérer les balises
        console.log(content.substring(0, 2000));
        
        console.log("\n--------------------------------------------------");
        console.log("🔎 Cherchez visuellement '.jpg' ou '.tif' ci-dessus.");
    } catch(err) {
        console.log("❌ Erreur :", err.message);
    }
}

main();
