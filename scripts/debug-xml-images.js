const fs = require("fs");
const path = require("path");

// On utilise le dossier temporaire qui existe déjà (suite au script précédent)
const XML_DIR = "/root/frontend/temp_debug_xml";

async function main() {
    console.log("🧐 RECHERCHE DE LA BALISE IMAGE (2000-2015)...");

    try {
        if (!fs.existsSync(XML_DIR)) {
            console.log("❌ Le dossier temporaire a disparu. Relancez le script précédent d'abord.");
            return;
        }

        const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
        if (files.length === 0) { console.log("❌ Pas de XML trouvé."); return; }

        const firstFile = path.join(XML_DIR, files[0]);
        console.log(`📄 Analyse de : ${files[0]}`);
        
        const content = fs.readFileSync(firstFile, "utf8");
        
        // On cherche le bloc qui définit l'image. Souvent <Representation> ou <ViewDetails>
        // On va chercher "jpg" ou "tif" pour trouver l'endroit exact
        const imagePosition = content.indexOf(".jpg"); // Ou tif ?
        
        if (imagePosition !== -1) {
            console.log("\n✅ Trouvé une référence '.jpg' ! Voici le contexte autour :");
            // On affiche 200 caractères avant et après
            console.log(content.substring(imagePosition - 200, imagePosition + 100));
        } else {
            console.log("\n⚠️ Pas de '.jpg' trouvé. Cherchons la balise <Representation>...");
            const repPos = content.indexOf("<Representation");
            if (repPos !== -1) {
                console.log(content.substring(repPos, repPos + 500));
            } else {
                console.log("❌ Impossible de trouver la définition des images. Format très ancien ?");
            }
        }

    } catch (e) { console.log("❌ Erreur : " + e.message); }
}

main();
