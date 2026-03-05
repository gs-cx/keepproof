import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_DIR = '/root/frontend/inpi_designs_backlog';

// Configuration qui fonctionne
const FTP_CONFIG = {
    host: process.env.INPI_DM_HOST,
    user: process.env.INPI_DM_USER,
    password: process.env.INPI_DM_PASS,
    secure: false, // On garde false car ça a marché
    port: 21
};

async function main() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 

    if (!fs.existsSync(LOCAL_DIR)){
        fs.mkdirSync(LOCAL_DIR, { recursive: true });
    }

    try {
        console.log(`🔌 Connexion au FTP INPI (${FTP_CONFIG.host})...`);
        await client.access(FTP_CONFIG);
        console.log("✅ Connecté !");

        console.log("📂 Lecture du contenu...");
        const fileList = await client.list();

        // On prend directement tout ce qui finit par .zip
        const zipFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.zip'));

        if (zipFiles.length === 0) {
            console.log("❌ Aucun fichier ZIP trouvé à la racine.");
            console.log("Voici ce que je vois :", fileList.map(f => f.name).join(', '));
            return;
        }

        console.log(`📦 ${zipFiles.length} fichiers ZIP trouvés.`);

        for (const file of zipFiles) {
            const localPath = path.join(LOCAL_DIR, file.name);
            
            // Vérification anti-doublon (taille identique)
            if (fs.existsSync(localPath) && fs.statSync(localPath).size === file.size) {
                console.log(`⏩ ${file.name} déjà là (ignoré).`);
                continue;
            }

            console.log(`⬇️ Téléchargement de ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
            try {
                await client.downloadTo(localPath, file.name);
                console.log("   ✅ OK");
            } catch (e) {
                console.error(`   ❌ Erreur sur ce fichier : ${e.message}`);
            }
        }

        console.log("\n🎉 Téléchargement terminé !");
        console.log(`👉 Lancez maintenant : node scripts/import-designs-xml.js`);

    } catch (err) {
        console.error("❌ Erreur :", err);
    } finally {
        client.close();
    }
}

main();
