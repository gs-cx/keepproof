const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const DEST_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_modern.zip";

// Liste des années disponibles à la racine (d'après votre scan)
const YEARS_TO_SCAN = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

async function main() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 

    try {
        console.log("🔌 Connexion au FTP INPI...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("🚀 Démarrage de la récupération mensuelle (2020-2026)...");

        for (const year of YEARS_TO_SCAN) {
            const shortYear = year.toString().substring(2); // 2024 -> 24

            for (const month of MONTHS) {
                // Construction du nom de fichier : dmf_image_2401.zip
                const filename = `dmf_image_${shortYear}${month}.zip`;
                const remotePath = `/${year}/${filename}`;

                // On vérifie d'abord si le fichier existe (pour éviter de télécharger du vide)
                try {
                    // Petite astuce : on tente de récupérer la taille. Si ça plante, le fichier n'existe pas.
                    const size = await client.size(remotePath);
                    
                    console.log(`\n📥 [${year}-${month}] Téléchargement de ${filename} (${(size / 1024 / 1024).toFixed(1)} MB)...`);
                    
                    await client.downloadTo(TEMP_ZIP, remotePath);
                    
                    console.log(`📦 Extraction avec 7-Zip...`);
                    try {
                        // Extraction forcée, écrase les doublons, mode silencieux sauf erreurs
                        execSync(`7z x "${TEMP_ZIP}" -o"${DEST_DIR}" -y > /dev/null`);
                        console.log(`✅ OK ! Images importées.`);
                    } catch (e) {
                        console.log(`❌ Erreur extraction sur ${filename}`);
                    }

                    // Nettoyage immédiat
                    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);

                } catch (err) {
                    // Si erreur (souvent fichier inexistant pour les mois futurs), on passe
                    // console.log(`   (Fichier ${filename} introuvable ou mois futur)`);
                    process.stdout.write("."); // Juste un point pour dire qu'on cherche
                }
            }
        }

        console.log("\n🎉 Terminée ! Les années 2020 à 2026 sont à jour.");

    } catch(err) {
        console.log("❌ Erreur générale :", err);
    }
    client.close();
}

main();
