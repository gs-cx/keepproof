const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TEMP_ZIP = "/root/frontend/temp_deep.zip";
const XML_DIR = "/root/frontend/temp_deep_xml";

async function main() {
    console.log("📖 LECTURE APPROFONDIE (La suite du fichier)...");

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // Toujours le même fichier témoin
        const TARGET = "/OPENDATA_FRDM_BACKLOG/Archives/FR_FRBCKST86_2019-02_0001.zip";
        
        console.log(`⬇️  Téléchargement...`);
        await client.downloadTo(TEMP_ZIP, TARGET);
        
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
        
        if (files.length > 0) {
            const content = fs.readFileSync(path.join(XML_DIR, files[0]), "utf8");
            
            // On cherche le marqueur où on s'était arrêté
            const marker = "TotalRepresentationSheet";
            const index = content.indexOf(marker);
            
            if (index !== -1) {
                console.log(`\n✅ Marqueur trouvé ! Voici ce qui suit (les images sont ici) :\n`);
                console.log("---------------------------------------------------------------");
                // On affiche 2000 caractères à partir du marqueur
                console.log(content.substring(index, index + 2000));
                console.log("---------------------------------------------------------------");
            } else {
                console.log("❌ Marqueur 'TotalRepresentationSheet' introuvable dans ce fichier.");
            }
        }

    } catch (e) { console.log("❌ Erreur : " + e.message); }
    
    client.close();
    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
}

main();
