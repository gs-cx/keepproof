const ftp = require("basic-ftp");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG";
const LOCAL_DIR = "/root/frontend/inpi_designs_backlog";

async function fetchTexts() {
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

        console.log("📂 Lecture de la liste des fichiers sur le serveur...");
        const list = await client.list(REMOTE_DIR);

        // On ne veut QUE les fichiers ZIP de TEXTE
        // Critère : finit par .zip ET commence par "FR_" (ex: FR_BCKST...)
        const textZips = list.filter(f => 
            f.name.endsWith(".zip") && 
            f.name.startsWith("FR_")
        );

        console.log(`📚 ${textZips.length} archives de textes identifiées.`);

        let count = 0;
        let downloaded = 0;

        for (const file of textZips) {
            count++;
            const localPath = `${LOCAL_DIR}/${file.name}`;
            
            // On ne télécharge que si on ne l'a pas déjà
            if (!fs.existsSync(localPath)) {
                process.stdout.write(`⬇️ [${count}/${textZips.length}] Téléchargement de ${file.name}... `);
                await client.downloadTo(localPath, `${REMOTE_DIR}/${file.name}`);
                console.log("✅");
                downloaded++;
            } else {
                // Si le fichier existe mais est vide (0 octet), on le re-télécharge
                const stats = fs.statSync(localPath);
                if (stats.size === 0) {
                    process.stdout.write(`🔄 [${count}/${textZips.length}] Réparation de ${file.name}... `);
                    await client.downloadTo(localPath, `${REMOTE_DIR}/${file.name}`);
                    console.log("✅");
                    downloaded++;
                }
            }
        }

        console.log("\n🎉 TÉLÉCHARGEMENT TERMINÉ !");
        console.log(`📦 ${downloaded} nouvelles archives récupérées.`);

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

fetchTexts();

