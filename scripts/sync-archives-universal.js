const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_universal.zip";
const XML_DIR = "/root/frontend/temp_universal_xml";

// 🚀 MODIFICATION ICI : On ne traite que les fichiers restants (0002 et 0003)
// Le 0001 a déjà été traité avec succès.
const TARGET_FILES = [
    "FR_FRBCKST86_2019-02_0002.zip",
    "FR_FRBCKST86_2019-02_0003.zip"
];

function extractID(filename) {
    const match = filename.match(/([1-9]\d{3,})/); 
    return match ? match[0] : null;
}

function getAllXmlFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllXmlFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith(".xml")) arrayOfFiles.push(path.join(dirPath, file));
        }
    });
    return arrayOfFiles;
}

// Nouvelle fonction pour gérer le téléchargement unique avec connexion/déconnexion
async function downloadOneFile(filename) {
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });
        
        console.log(`⬇️  (Re)Connexion FTP et Téléchargement de : ${filename}...`);
        await client.downloadTo(TEMP_ZIP, `/OPENDATA_FRDM_BACKLOG/Archives/${filename}`);
        client.close(); // On ferme tout de suite pour ne pas laisser traîner la connexion
        return true;
    } catch (e) {
        console.log(`❌ Erreur FTP sur ${filename} : ${e.message}`);
        client.close();
        return false;
    }
}

async function main() {
    console.log("🧬 SYNCHRONISATION UNIVERSELLE (SUITE ET FIN)...");
    
    // 1. INDEXATION RAPIDE (On refait l'index car le script a redémarré)
    console.log("🧠 Reconstruction de l'index ID -> Fichier...");
    const idMap = new Map();
    try {
        const files = fs.readdirSync(STORAGE_DIR);
        for (const file of files) {
            const id = extractID(file);
            if (id) idMap.set(id, file);
        }
        console.log(`✅ ${idMap.size} images indexées.`);
    } catch(e) { console.log("❌ Erreur disque:", e); return; }

    // 2. TRAITEMENT BOUCLE ROBUSTE
    for (const zipName of TARGET_FILES) {
        // A. TÉLÉCHARGEMENT (Avec connexion dédiée)
        const success = await downloadOneFile(zipName);
        if (!success) continue;

        // B. TRAITEMENT LOCAL (Hors ligne, donc pas de timeout possible)
        try {
            if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
            fs.mkdirSync(XML_DIR);
            
            console.log("   📦 Décompression...");
            execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

            const xmlFiles = getAllXmlFiles(XML_DIR);
            console.log(`   📄 Analyse de ${xmlFiles.length} fichiers XML...`);

            let updated = 0;
            
            for (const xmlPath of xmlFiles) {
                const content = fs.readFileSync(xmlPath, "utf8");
                const blocks = content.split("</Design>");
                
                for (const block of blocks) {
                    const regMatch = block.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
                    if (!regMatch) continue;
                    const numEnregistrement = regMatch[1].trim();

                    const filenameMatches = [...block.matchAll(/<ViewFilename>([^<]+)<\/ViewFilename>/g)];
                    for (const m of filenameMatches) {
                        const xmlID = extractID(m[1].trim());
                        if (xmlID && idMap.has(xmlID)) {
                            const realFile = idMap.get(xmlID);
                            await prisma.inpi_Design.updateMany({
                                where: { num_enregistrement: numEnregistrement },
                                data: { image_file: `/designs/${realFile}` }
                            });
                            updated++;
                        }
                    }
                }
            }
            console.log(`   💎 ${updated} liens créés pour ${zipName} !`);

        } catch (e) { console.log(`   ❌ Erreur de traitement sur ${zipName} : ${e.message}`); }
        
        // Nettoyage
        if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
    }

    console.log("\n🎉 TOUT L'HISTORIQUE (2000-2015) EST MAINTENANT CHARGÉ.");
}

main();
