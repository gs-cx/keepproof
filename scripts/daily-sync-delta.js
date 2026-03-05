const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

// CONFIGURATION
const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_delta.zip";
const XML_DIR = "/root/frontend/temp_delta_xml";
const PROCESSED_LOG = "/root/frontend/processed_files.json"; // 🧠 Mémoire du script

// On traite l'année en cours
const CURRENT_YEAR = new Date().getFullYear().toString();

// Fonction récursive pour trouver les XML
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

// 🧠 GESTION DE LA MÉMOIRE (Pour ne pas recharger ce qui est déjà fait)
function loadProcessedFiles() {
    if (fs.existsSync(PROCESSED_LOG)) {
        return JSON.parse(fs.readFileSync(PROCESSED_LOG, 'utf8'));
    }
    return [];
}
function saveProcessedFile(filename) {
    const files = loadProcessedFiles();
    if (!files.includes(filename)) {
        files.push(filename);
        fs.writeFileSync(PROCESSED_LOG, JSON.stringify(files, null, 2));
    }
}

async function main() {
    console.log(`🤖 DELTA SYNC ${CURRENT_YEAR} : Démarrage...`);
    
    // 1. Chargement Mémoire (Fichiers déjà traités)
    const processedFiles = loadProcessedFiles();
    console.log(`📚 ${processedFiles.length} fichiers déjà traités dans l'historique.`);

    // 2. Indexation Disque Rapide
    console.log("🧠 Indexation des images locales...");
    const fileMap = new Map();
    try {
        const files = fs.readdirSync(STORAGE_DIR);
        for (const file of files) {
            const match = file.match(/([1-9]\d+)/); 
            if (match) fileMap.set(match[0], file);
        }
    } catch(e) { console.log("❌ Erreur disque:", e); return; }

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // 3. STRATÉGIE AUTO-ADAPTATIVE
        // On cherche à la fois à la racine "/" ET dans "/2026"
        let candidates = [];

        // A. Scan Racine
        try {
            const listRoot = await client.list("/");
            // On ne garde que les ZIP de l'année en cours qui ne sont pas des images pures
            const rootFiles = listRoot.filter(f => 
                f.name.includes(CURRENT_YEAR) && 
                f.name.endsWith(".zip") && 
                !f.name.startsWith("dmf_image")
            );
            rootFiles.forEach(f => f.fullPath = `/${f.name}`);
            candidates = candidates.concat(rootFiles);
        } catch(e) {}

        // B. Scan Dossier Année
        try {
            const listFolder = await client.list(`/${CURRENT_YEAR}`);
            const folderFiles = listFolder.filter(f => 
                f.name.endsWith(".zip") && 
                !f.name.startsWith("dmf_image")
            );
            folderFiles.forEach(f => f.fullPath = `/${CURRENT_YEAR}/${f.name}`);
            candidates = candidates.concat(folderFiles);
        } catch(e) {}

        // 4. FILTRAGE DU DELTA (On retire ce qu'on a déjà traité)
        const toProcess = candidates.filter(f => !processedFiles.includes(f.name));

        if (toProcess.length === 0) {
            console.log("✅ Aucun nouveau fichier à traiter (Delta vide).");
            client.close();
            return;
        }

        console.log(`🚀 ${toProcess.length} NOUVEAUX fichiers détectés. Traitement...`);

        for (const zipFile of toProcess) {
            try {
                console.log(`⬇️  Téléchargement : ${zipFile.name}...`);
                await client.downloadTo(TEMP_ZIP, zipFile.fullPath);
                
                if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
                fs.mkdirSync(XML_DIR);
                execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

                const xmlFiles = getAllXmlFiles(XML_DIR);
                let count = 0;

                for (const xmlPath of xmlFiles) {
                    const content = fs.readFileSync(xmlPath, "utf8");
                    const blocks = content.split("</Design>");
                    
                    for (const block of blocks) {
                        const regMatch = block.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
                        if (!regMatch) continue;
                        const numEnregistrement = regMatch[1].trim(); 

                        const viewMatches = [...block.matchAll(/<ViewNumber>([^<]+)<\/ViewNumber>/g)];
                        for (const m of viewMatches) {
                            const cleanVal = m[1].trim();
                            if (fileMap.has(cleanVal)) {
                                const realFile = fileMap.get(cleanVal);
                                await prisma.inpi_Design.updateMany({
                                    where: { num_enregistrement: numEnregistrement },
                                    data: { image_file: `/designs/${realFile}` }
                                });
                                count++;
                            }
                        }
                    }
                }
                console.log(`   ✅ Traité avec succès (+${count} liens).`);
                
                // 🧠 ON SAUVEGARDE L'ÉTAT
                saveProcessedFile(zipFile.name);

            } catch (e) { console.log(`   ❌ Erreur ${zipFile.name}: ${e.message}`); }
            
            if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        }

    } catch (e) { console.log("❌ Erreur FTP Global : " + e.message); }
    
    client.close();
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
    console.log("🎉 DELTA TERMINÉ.");
}

main();
