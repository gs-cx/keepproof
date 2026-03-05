const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TARGET_FILE = "dmf_image_bck_2020-02_0014.zip";
const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG";
const LOCAL_TEMP = "/root/frontend/temp_fix.zip";
const DEST_DIR = "/var/www/designs_storage/";

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("🔌 Connexion au FTP (Tentative finale avec 7-Zip)...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log(`⬇️  Téléchargement de ${TARGET_FILE}...`);
        await client.downloadTo(LOCAL_TEMP, `${REMOTE_DIR}/${TARGET_FILE}`);
        console.log("✅ Téléchargement OK.");

        console.log("📦 Tentative d'extraction avec 7-Zip (Mode Forcé)...");
        try {
            // Commande 7z : x (extract) -y (yes to all) -o(destination collée)
            execSync(`7z x "${LOCAL_TEMP}" -o"${DEST_DIR}" -y`);
            console.log("✅ SUCCÈS ! 7-Zip a réussi là où unzip a échoué.");
        } catch (e) {
            console.log("❌ ÉCHEC TOTAL. Le fichier source chez l'INPI est définitivement corrompu.");
            console.log("   Détail erreur : " + e.message);
        }

        // Nettoyage
        if (fs.existsSync(LOCAL_TEMP)) fs.unlinkSync(LOCAL_TEMP);
        console.log("✨ Opération terminée.");

    } catch(err) {
        console.log("❌ Erreur connexion/téléchargement :", err);
    }
    client.close();
}

main();
