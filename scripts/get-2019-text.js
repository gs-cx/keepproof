const ftp = require("basic-ftp");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function get2019() {
    const client = new ftp.Client();
    const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG/Archives";
    const LOCAL_DIR = "/root/frontend/inpi_designs_backlog";

    try {
        console.log("🔌 Connexion...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("📂 Recherche des textes 2019...");
        const list = await client.list(REMOTE_DIR);

        // On prend les ZIP qui commencent par "FR_" (Textes)
        const textZips = list.filter(f => f.name.startsWith("FR_") && f.name.endsWith(".zip"));

        console.log(`📚 ${textZips.length} archives de textes trouvées.`);

        for (const file of textZips) {
            console.log(`⬇️ Téléchargement de ${file.name}...`);
            await client.downloadTo(`${LOCAL_DIR}/${file.name}`, `${REMOTE_DIR}/${file.name}`);
        }
        console.log("✅ Fini pour 2019 !");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

get2019();
