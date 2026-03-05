const ftp = require("basic-ftp");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

// On ne veut que les fichiers de texte (pas les images)
// Les textes commencent par "FR_FRBCKST" ou "FR_BCKST"
const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG";
const LOCAL_DIR = "/root/frontend/inpi_designs_backlog";

async function downloadAllXML() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 

    try {
        console.log("🔌 Connexion au FTP INPI...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("📂 Listage des fichiers disponibles...");
        const list = await client.list(REMOTE_DIR);

        // On filtre pour ne prendre que les ZIP de TEXTE (petits fichiers)
        // On évite "dmf_image" (les gros fichiers images)
        const xmlZips = list.filter(f => 
            f.name.endsWith(".zip") && 
            !f.name.includes("dmf_image") && 
            !f.name.includes("Archives")
        );

        console.log(`📦 ${xmlZips.length} archives de textes trouvées.`);

        let count = 0;
        for (const file of xmlZips) {
            // On vérifie si on l'a déjà pour ne pas retélécharger inutilement
            if (!fs.existsSync(`${LOCAL_DIR}/${file.name}`)) {
                console.log(`⬇️ [${++count}/${xmlZips.length}] Téléchargement de ${file.name} (${Math.round(file.size/1024)} Ko)...`);
                await client.downloadTo(`${LOCAL_DIR}/${file.name}`, `${REMOTE_DIR}/${file.name}`);
            } else {
                // console.log(`⏩ ${file.name} déjà là.`);
            }
        }

        console.log("✅ Tous les textes sont téléchargés !");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

downloadAllXML();
