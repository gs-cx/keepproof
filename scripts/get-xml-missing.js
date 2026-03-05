const ftp = require("basic-ftp");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function downloadMissingXML() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 

    try {
        console.log("🔌 Connexion au FTP...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("📂 Accès au dossier OPENDATA...");
        await client.cd("/OPENDATA_FRDM_BACKLOG");

        // On télécharge les parties 2 et 3
        const filesToGet = [
            "FR_FRBCKST86_2020-02_0002.zip",
            "FR_FRBCKST86_2020-02_0003.zip"
        ];

        for (const file of filesToGet) {
            console.log(`⬇️ Téléchargement de ${file}...`);
            await client.downloadTo(`/root/frontend/inpi_designs_backlog/${file}`, file);
            console.log("✅ OK !");
        }

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

downloadMissingXML();
