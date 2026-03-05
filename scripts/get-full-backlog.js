const ftp = require("basic-ftp");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function getBacklog() {
    const client = new ftp.Client();
    const REMOTE_DIR = "/Backlog";
    const LOCAL_DIR = "/root/frontend/inpi_designs_backlog";

    try {
        console.log("🔌 Connexion au FTP...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log(`📂 Listage du dossier ${REMOTE_DIR}...`);
        const list = await client.list(REMOTE_DIR);
        
        // On prend tout ce qui est ZIP
        const zips = list.filter(f => f.name.endsWith(".zip"));

        console.log(`📦 ${zips.length} archives à récupérer. C'est parti !`);

        let count = 0;
        for (const file of zips) {
            count++;
            const localPath = `${LOCAL_DIR}/${file.name}`;

            // Petite optimisation : on ne retélécharge pas si on l'a déjà
            if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
                // On affiche un log tous les 5 fichiers pour ne pas spammer
                if (count % 5 === 0) process.stdout.write(`⬇️ [${count}/${zips.length}] `);
                
                await client.downloadTo(localPath, `${REMOTE_DIR}/${file.name}`);
            }
        }

        console.log("\n\n✅ TÉLÉCHARGEMENT MASSIF TERMINÉ !");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

getBacklog();
