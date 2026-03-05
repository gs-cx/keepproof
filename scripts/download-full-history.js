import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Dossier local où on met tout
const LOCAL_DIR = '/root/frontend/inpi_designs_backlog';

// LISTE DES DOSSIERS À ASPIRER
// On ajoute les années trouvées + le dossier Backlog principal
const TARGET_FOLDERS = [
    'OPENDATA_FRDM_BACKLOG/Archives',
    'Backlog',
    '2020', 
    '2021', 
    '2022', 
    '2023', 
    '2024', 
    '2025', 
    'OPENDATA_FRDM_BACKLOG' // Le gros historique
];

const FTP_CONFIG = {
    host: process.env.INPI_DM_HOST,
    user: process.env.INPI_DM_USER,
    password: process.env.INPI_DM_PASS,
    secure: false, 
    port: 21
};

async function main() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; // Décommenter pour voir le dialogue technique

    if (!fs.existsSync(LOCAL_DIR)){
        fs.mkdirSync(LOCAL_DIR, { recursive: true });
    }

    try {
        console.log(`🔌 Connexion au FTP INPI...`);
        await client.access(FTP_CONFIG);
        console.log("✅ Connecté !");

        for (const folder of TARGET_FOLDERS) {
            console.log(`\n📂 Traitement du dossier distant : ${folder}`);
            
            try {
                // On essaie d'entrer dans le dossier
                await client.cd("/"); // On revient à la racine d'abord
                await client.cd(folder);
                
                const fileList = await client.list();
                const zipFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.zip'));

                if (zipFiles.length === 0) {
                    console.log(`   ⚠️ Aucun ZIP trouvé dans ${folder}`);
                    continue;
                }

                console.log(`   📦 ${zipFiles.length} fichiers ZIP trouvés.`);

                // Téléchargement
                let count = 0;
                for (const file of zipFiles) {
                    count++;
                    const localPath = path.join(LOCAL_DIR, file.name);
                    
                    // Anti-doublon intelligent
                    if (fs.existsSync(localPath)) {
                        const localSize = fs.statSync(localPath).size;
                        if (localSize === file.size) {
                            process.stdout.write(`   ⏩ [${count}/${zipFiles.length}] ${file.name} (Déjà là)\r`);
                            continue;
                        }
                    }

                    console.log(`   ⬇️ [${count}/${zipFiles.length}] Téléchargement de ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
                    await client.downloadTo(localPath, file.name);
                }

            } catch (err) {
                console.error(`   ❌ Impossible d'accéder au dossier ${folder} :`, err.message);
            }
        }

        console.log("\n🎉 ASPIRATION TERMINÉE ! Tous les fichiers sont sur le serveur.");

    } catch (err) {
        console.error("❌ Erreur générale :", err);
    } finally {
        client.close();
    }
}

main();
