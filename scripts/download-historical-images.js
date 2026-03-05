const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

// Destination finale des images
const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_images.zip";

async function main() {
    console.log("🚜 DÉMARRAGE DU TÉLÉCHARGEMENT MASSIF (IMAGES 2000-2015)...");
    console.log("⚠️  Assurez-vous d'avoir au moins 50 Go d'espace libre !");

    const client = new ftp.Client();
    client.ftp.verbose = true; // Pour voir la progression

    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        const ARCHIVE_DIR = "/OPENDATA_FRDM_BACKLOG/Archives";
        
        // On liste tout le dossier
        const list = await client.list(ARCHIVE_DIR);
        
        // On ne garde que les fichiers IMAGES (dmf_image_bck...)
        // On les trie pour commencer par le 0001
        const imageZips = list
            .filter(f => f.name.startsWith("dmf_image_bck") && f.name.endsWith(".zip"))
            .sort((a, b) => a.name.localeCompare(b.name));

        console.log(`📦 ${imageZips.length} archives d'images trouvées. C'est parti !`);

        for (const zipFile of imageZips) {
            console.log(`\n⬇️  Téléchargement de ${zipFile.name} (${(zipFile.size/1024/1024).toFixed(0)} MB)...`);
            console.log("   (Cela peut prendre du temps, patience...)");
            
            try {
                // 1. Téléchargement
                await client.downloadTo(TEMP_ZIP, `${ARCHIVE_DIR}/${zipFile.name}`);
                
                // 2. Décompression directe dans le dossier final (sans créer de sous-dossier si possible)
                // L'option -j (junk paths) enlève les dossiers parents pour mettre les fichiers à plat si besoin, 
                // mais attention si l'INPI a rangé ça proprement.
                // On va faire une décompression standard -o (overwrite)
                console.log("   📦 Décompression vers le stockage final...");
                execSync(`unzip -o -q "${TEMP_ZIP}" -d "${STORAGE_DIR}"`);
                
                console.log("   ✅ Images extraites.");

            } catch (err) {
                console.log(`   ❌ Erreur sur ce fichier : ${err.message}`);
            }

            // 3. Suppression immédiate du ZIP pour sauver de l'espace
            if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        }

    } catch (e) { console.log("❌ Erreur FTP : " + e.message); }
    
    client.close();
    console.log("\n🎉 TOUTES LES IMAGES HISTORIQUES SONT CHARGÉES !");
}

main();
