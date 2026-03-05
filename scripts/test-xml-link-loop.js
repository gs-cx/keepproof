const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

const XML_DIR = "/root/frontend/temp_xml_folder";
const STORAGE_DIR = "/var/www/designs_storage/";

async function main() {
    console.log("🔄 DÉMARRAGE DU SCANNER XML (Mode Multi-Fiches)...");

    if (!fs.existsSync(XML_DIR)) {
        console.log("❌ Dossier XML introuvable.");
        return;
    }

    const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
    if (files.length === 0) { console.log("❌ Aucun fichier XML."); return; }

    const file = files[0]; // On prend le fichier 2024-01 téléchargé
    console.log(`📂 Analyse approfondie de : ${file}`);
    
    const content = fs.readFileSync(path.join(XML_DIR, file), "utf8");

    // ASTUCE : On découpe le fichier par blocs "<Design>" pour isoler chaque dessin
    const blocks = content.split("</Design>");
    console.log(`📦 Ce fichier contient environ ${blocks.length} dessins.`);

    let found = 0;
    let linked = 0;
    
    // On cherche notre "Graal" pour vérifier la théorie
    const targetNum = "20240026"; 

    for (const block of blocks) {
        // Extraction du Numéro d'Enregistrement
        const regMatch = block.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
        // Extraction du Numéro de Vue (l'ID de l'image)
        const viewMatch = block.match(/<ViewNumber>([^<]+)<\/ViewNumber>/);

        if (regMatch && viewMatch) {
            const numEnregistrement = regMatch[1];
            const viewNumber = viewMatch[1];
            
            // On vérifie si c'est notre fiche mystère
            if (numEnregistrement === targetNum) {
                console.log("\n🎯 BINGO !!! FICHE MYSTÈRE TROUVÉE !");
                console.log(`   📝 Numéro : ${numEnregistrement}`);
                console.log(`   🖼️ ID Image (ViewNumber) : ${viewNumber}`);
                const filename = viewNumber.padStart(9, "0") + ".jpg";
                console.log(`   👉 Nom de fichier attendu : ${filename}`);
                
                if (fs.existsSync(path.join(STORAGE_DIR, filename))) {
                    console.log("   ✅ LE FICHIER EXISTE SUR LE DISQUE ! PREUVE FAITE.");
                } else {
                    console.log("   ❌ Le fichier n'est pas encore sur le disque (peut-être dans un autre ZIP d'images ?).");
                }
            }

            // Test de mise à jour réelle sur les 5 premières fiches trouvées pour valider
            if (found < 5 && fs.existsSync(path.join(STORAGE_DIR, viewNumber.padStart(9, "0") + ".jpg"))) {
                console.log(`✅ Test lien OK : ${numEnregistrement} <-> ${viewNumber.padStart(9, "0")}.jpg`);
                linked++;
            }
            found++;
        }
    }

    console.log("\n📊 Analyse terminée.");
}

main();
