const ftp = require("basic-ftp");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function downloadXML() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    // On va mettre ça avec les autres
    const LOCAL_DEST = "/root/frontend/inpi_designs_backlog/XML_2020_02.zip";

    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("📂 Accès au dossier OPENDATA...");
        await client.cd("/OPENDATA_FRDM_BACKLOG");

        console.log("⬇️ Téléchargement des fiches XML Février 2020...");
        // C'est le fichier qui correspond à votre pack d'images
        await client.downloadTo(LOCAL_DEST, "FR_FRBCKST86_2020-02_0001.zip");

        console.log("✅ Fiches téléchargées !");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

downloadXML();
