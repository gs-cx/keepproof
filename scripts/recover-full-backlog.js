const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

// Configuration
const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG";
const LOCAL_TEMP_ZIP = "/root/frontend/temp_download.zip"; // On réutilise le même nom pour économiser
const TARGET_DIR = "/var/www/designs_storage/";

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Pour voir la progression du téléchargement

    try {
        console.log("🔌 Connexion au FTP INPI...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log(`📂 Listage du dossier ${REMOTE_DIR}...`);
        const list = await client.list(REMOTE_DIR);

        // On ne prend que les fichiers images du backlog (dmf_image_bck...)
        const filesToDownload = list.filter(f => f.name.startsWith("dmf_image_bck") && f.name.endsWith(".zip"));

        console.log(`🎯 ${filesToDownload.length} gros fichiers ZIP identifiés.`);
        console.log("🚀 Démarrage du processus : Téléchargement -> Décompression -> Suppression");

        for (let i = 0; i < filesToDownload.length; i++) {
            const file = filesToDownload[i];
            console.log(`\n---------------------------------------------------------`);
            console.log(`📦 Traitement du fichier ${i + 1}/${filesToDownload.length} : ${file.name}`);
            console.log(`   Taille : ${(file.size / 1024 / 1024).toFixed(0)} MB`);

            // 1. Téléchargement
            console.log("⬇️  Téléchargement en cours (patience...)...");
            await client.downloadTo(LOCAL_TEMP_ZIP, `${REMOTE_DIR}/${file.name}`);
            console.log("✅ Téléchargement terminé.");

            // 2. Décompression via commande système (plus rapide et robuste)
            console.log("📦 Décompression en cours vers le stockage final...");
            try {
                // -o : overwrite (écraser si existe)
                // -j : junk paths (ne pas créer de sous-dossiers, mettre tout à plat)
                // -q : quiet (ne pas lister les 100 000 fichiers à l'écran)
                execSync(`unzip -o -j "${LOCAL_TEMP_ZIP}" -d "${TARGET_DIR}"`);
                console.log("✅ Décompression réussie !");
            } catch (e) {
                console.log("❌ Erreur lors de la décompression (Zip corrompu ?). On continue le suivant.");
            }

            // 3. Suppression du ZIP temporaire
            console.log("🗑️  Suppression du fichier ZIP temporaire pour libérer l'espace...");
            if (fs.existsSync(LOCAL_TEMP_ZIP)) {
                fs.unlinkSync(LOCAL_TEMP_ZIP);
            }
            console.log("✨ Fichier traité avec succès.");
        }

        console.log("\n🎉 TOUT EST TERMINÉ ! Toutes les archives ont été traitées.");

    } catch (err) {
        console.log("❌ Erreur générale :", err);
    }
    client.close();
}

main();
