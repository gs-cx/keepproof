const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

// Le dossier final où doivent atterrir les images
const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_images.zip";
const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG/Archives";

async function main() {
    const client = new ftp.Client();
    // client.ftp.verbose = true;

    try {
        console.log(`🔌 Connexion au FTP (Récupération des Images Manquantes)...`);
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // 1. Lister les fichiers Images du Backlog
        console.log("📂 Recherche des archives 'dmf_image_bck'...");
        const list = await client.list(REMOTE_DIR);
        
        // On ne prend QUE les archives d'images
        const imageZips = list.filter(f => f.name.startsWith("dmf_image_bck") && f.name.endsWith(".zip"));

        console.log(`🎯 ${imageZips.length} archives d'images trouvées.`);
        
        if (imageZips.length === 0) {
            console.log("❌ Aucune archive d'image trouvée. Vérifiez le nom du dossier.");
            return;
        }

        for (const zipFile of imageZips) {
            console.log(`\n⬇️  Téléchargement de ${zipFile.name} (${(zipFile.size/1024/1024).toFixed(1)} MB)...`);
            
            try {
                // Téléchargement
                await client.downloadTo(TEMP_ZIP, `${REMOTE_DIR}/${zipFile.name}`);
                console.log("   ✅ Téléchargement terminé. Décompression directe...");

                // Décompression directement dans le dossier de stockage final
                // -o : overwrite (au cas où)
                // -j : junk paths (on écrase les sous-dossiers pour tout mettre à plat si possible, 
                // mais attention si l'archive contient déjà des dossiers structurés, mieux vaut décompresser normalement puis aplatir)
                
                // Stratégie : On dézippe normalement, puis on aplatira tout à la fin par sécurité
                execSync(`unzip -o -q "${TEMP_ZIP}" -d "${STORAGE_DIR}"`);
                console.log("   📦 Décompression OK.");

            } catch (e) {
                console.log(`   ❌ Erreur sur ce fichier : ${e.message}`);
            }

            // Nettoyage immédiat du ZIP pour gagner de la place
            if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        }

    } catch(err) {
        console.log("❌ Erreur générale FTP :", err);
    }
    
    client.close();
    console.log("\n🧹 NETTOYAGE FINAL (Aplatissement des dossiers)...");
    
    // On relance la commande d'aplatissement pour être sûr que les images ne sont pas restées dans un sous-dossier
    try {
        // Remonte tout vers la racine
        execSync(`find ${STORAGE_DIR} -mindepth 2 -type f -exec mv -n {} ${STORAGE_DIR} \\;`);
        // Supprime les dossiers vides
        execSync(`find ${STORAGE_DIR} -mindepth 1 -type d -empty -delete`);
        
        // Rétablissement des permissions
        execSync(`chown -R www-data:www-data ${STORAGE_DIR}`);
        execSync(`chmod -R 755 ${STORAGE_DIR}`);
        
        console.log("✨ Tout est rangé et propre !");
    } catch (e) {
        console.log("⚠️ Petit souci lors du nettoyage final (pas critique) : " + e.message);
    }
    
    console.log("🚀 OPÉRATION TERMINÉE.");
}

main();
