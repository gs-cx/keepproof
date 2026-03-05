const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TEMP_ZIP = "/root/frontend/temp_debug_v2.zip";
const XML_DIR = "/root/frontend/temp_debug_v2_xml";

async function main() {
    console.log("🕵️‍♂️ ENQUÊTE FINALE SUR LES IMAGES (ARCHIVES 2000-2015)...");

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // On reprend le fichier suspect qui contient l'année 2000
        const TARGET = "/OPENDATA_FRDM_BACKLOG/Archives/FR_FRBCKST86_2019-02_0001.zip";
        
        console.log(`⬇️  Téléchargement...`);
        await client.downloadTo(TEMP_ZIP, TARGET);
        
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        // Analyse
        const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
        if (files.length > 0) {
            const content = fs.readFileSync(path.join(XML_DIR, files[0]), "utf8");
            
            console.log("\n🔎 RECHERCHE DE '.jpg' DANS LE XML...");
            const index = content.indexOf(".jpg");
            
            if (index !== -1) {
                console.log("✅ TROUVÉ ! Voici la balise exacte :");
                // On affiche 100 caractères avant et 50 après pour voir <LaBalise>image.jpg</LaBalise>
                console.log("..." + content.substring(index - 100, index + 50) + "...");
            } else {
                console.log("⚠️ Pas de .jpg trouvé. Essai avec .tif ...");
                const indexTif = content.indexOf(".tif");
                if (indexTif !== -1) {
                    console.log("✅ TROUVÉ (Format TIF) ! Voici la balise :");
                    console.log("..." + content.substring(indexTif - 100, indexTif + 50) + "...");
                } else {
                    console.log("❌ Aucune extension d'image trouvée. Structure inconnue.");
                    // On affiche un bloc Representation au cas où
                    const repIndex = content.indexOf("<Representation");
                    if (repIndex !== -1) console.log(content.substring(repIndex, repIndex + 300));
                }
            }
        }

    } catch (e) { console.log("❌ Erreur : " + e.message); }
    
    client.close();
    // Nettoyage
    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
}

main();
