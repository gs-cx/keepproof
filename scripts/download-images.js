const ftp = require("basic-ftp");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function downloadBigFile() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // On veut voir la barre de progression

    const LOCAL_DEST = "/root/frontend/inpi_designs_backlog/IMAGES_PACK_1.zip";

    try {
        console.log("🔌 Connexion au FTP INPI...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("📂 Déplacement vers le dossier OPENDATA_FRDM_BACKLOG...");
        await client.cd("/OPENDATA_FRDM_BACKLOG");

        console.log("🚀 Démarrage du téléchargement de 2 Go (Cela va prendre quelques minutes)...");
        console.log("⚠️ NE FERMEZ PAS CETTE FENÊTRE !");
        
        // On télécharge le premier pack d'images
        await client.downloadTo(LOCAL_DEST, "dmf_image_bck_2020-02_0001.zip");

        console.log("✅ TÉLÉCHARGEMENT TERMINÉ !");
        console.log(`📍 Fichier enregistré ici : ${LOCAL_DEST}`);

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

downloadBigFile();
