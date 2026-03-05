const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TARGET_FILE = "dmf_image_bck_2020-02_0014.zip"; // Le fichier qui a planté
const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG";
const LOCAL_TEMP = "/root/frontend/temp_fix.zip";
const DEST_DIR = "/var/www/designs_storage/";

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("🔌 Connexion au FTP pour sauver le fichier 14...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log(`⬇️  Téléchargement de ${TARGET_FILE}...`);
        await client.downloadTo(LOCAL_TEMP, `${REMOTE_DIR}/${TARGET_FILE}`);
        console.log("✅ Téléchargement OK.");

        console.log("📦 Tentative de décompression...");
        try {
            execSync(`unzip -o -j "${LOCAL_TEMP}" -d "${DEST_DIR}"`);
            console.log("✅ Décompression réussie !");
        } catch (e) {
            console.log("❌ Encore raté. Le fichier semble corrompu à la source ou instable.");
        }

        if (fs.existsSync(LOCAL_TEMP)) fs.unlinkSync(LOCAL_TEMP);
        console.log("✨ Terminé.");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

main();
