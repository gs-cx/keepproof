const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TEMP_ZIP = "/root/frontend/temp_debug.zip";
const XML_DIR = "/root/frontend/temp_debug_xml";

async function main() {
    console.log("🧐 INSPECTION VISUELLE DU XML 2019...");

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // On reprend le même fichier
        const TARGET = "/OPENDATA_FRDM_BACKLOG/Archives/FR_FRBCKST86_2019-02_0001.zip";
        
        console.log(`⬇️  Téléchargement...`);
        await client.downloadTo(TEMP_ZIP, TARGET);
        
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        // On prend le premier fichier XML trouvé
        const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
        
        if (files.length > 0) {
            const firstFile = path.join(XML_DIR, files[0]);
            console.log(`\n📄 Lecture de : ${files[0]}`);
            
            const content = fs.readFileSync(firstFile, "utf8");
            
            console.log("\n--- DÉBUT DU CONTENU XML ---");
            console.log(content.substring(0, 1500)); // On affiche 1500 caractères
            console.log("--- FIN DE L'EXTRAIT ---\n");
            
            console.log("👉 Regardez ci-dessus : Cherchez une date (ex: 2014, 2010...)");
            console.log("👉 Cherchez la balise qui entoure cette date.");
        } else {
            console.log("❌ Aucun fichier XML trouvé dans le ZIP.");
        }

    } catch (e) { console.log("❌ Erreur : " + e.message); }
    
    client.close();
    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
}

main();
