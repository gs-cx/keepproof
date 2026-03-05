const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const REMOTE_DIR = "/OPENDATA_FRDM_BACKLOG/Archives";
const LOCAL_TEMP = "/root/frontend/temp_gap.zip";
const DEST_DIR = "/var/www/designs_storage/";

// Les années qui sont actuellement à 0% et absentes du backlog principal
const TARGET_YEARS = ["2015", "2016", "2017", "2018", "2019"];

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("🔌 Connexion au FTP (Dossier Archives)...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("📂 Listage des archives disponibles...");
        const list = await client.list(REMOTE_DIR);

        // On cherche les fichiers ZIP qui contiennent "image" ET une des années cibles
        const gapFiles = list.filter(f => {
            const isZip = f.name.endsWith(".zip");
            const isImage = f.name.includes("image"); // Ex: dmf_image_bck_2019...
            const matchYear = TARGET_YEARS.some(y => f.name.includes(y));
            return isZip && isImage && matchYear;
        });

        console.log(`🎯 ${gapFiles.length} fichiers trouvés pour la période 2015-2019.`);

        for (const file of gapFiles) {
            console.log(`\n⬇️  Téléchargement de ${file.name} (${(file.size / 1024 / 1024).toFixed(0)} MB)...`);
            
            try {
                await client.downloadTo(LOCAL_TEMP, `${REMOTE_DIR}/${file.name}`);
                
                console.log("📦 Extraction avec 7-Zip...");
                // On extrait tout dans le dossier de destination
                execSync(`7z x "${LOCAL_TEMP}" -o"${DEST_DIR}" -y > /dev/null`);
                console.log("✅ OK.");

            } catch (e) {
                console.log(`❌ Erreur sur ${file.name} : ${e.message}`);
            }

            // Ménage pour ne pas saturer le disque
            if (fs.existsSync(LOCAL_TEMP)) fs.unlinkSync(LOCAL_TEMP);
        }

        console.log("\n🎉 Mission terminée : Les fichiers 2015-2019 sont téléchargés.");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

main();
