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
const TEMP_ZIP = "/root/frontend/temp_daily.zip";
const XML_DIR = "/root/frontend/temp_daily_xml";

// On récupère l'année en cours (ex: "2026")
const CURRENT_YEAR = new Date().getFullYear().toString(); 

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

async function main() {
    console.log(`🤖 DAILY SYNC : Recherche des fichiers ${CURRENT_YEAR} à la RACINE...`);
    
    // 1. INDEXATION RAPIDE
    console.log("🧠 Chargement de l'index disque...");
    const fileMap = new Map();
    try {
        const files = fs.readdirSync(STORAGE_DIR);
        for (const file of files) {
            const match = file.match(/([1-9]\d+)/); 
            if (match) fileMap.set(match[0], file);
        }
    } catch(e) { console.log("❌ Erreur disque:", e); return; }
    console.log(`✅ ${fileMap.size} images en index.`);

    // 2. FTP
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // 🚨 MODIFICATION ICI : On scanne la racine "/" au lieu de "/2026"
        const list = await client.list("/");
        
        // 🎯 FILTRE INTELLIGENT :
        // 1. Contient "FRAMDST" (Updates) OU "FRNEWST" (Nouveaux)
        // 2. Se termine par .zip
        // 3. Contient l'année en cours (ex: "2026") pour ne pas re-télécharger le backlog
        const targets = list.filter(f => 
            (f.name.includes("FR_FRAMDST86") || f.name.includes("FR_FRNEWST86")) 
            && f.name.endsWith(".zip")
            && f.name.includes(CURRENT_YEAR)
        );

        console.log(`🔍 ${targets.length} archives pour ${CURRENT_YEAR} trouvées à la racine.`);

        for (const zipFile of targets) {
            try {
                console.log(`⬇️  Traitement de ${zipFile.name}...`);
                await client.downloadTo(TEMP_ZIP, `/${zipFile.name}`); // Télécharge depuis la racine
                
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
                console.log(`   ✅ ${count} liens mis à jour.`);

            } catch (e) { console.log(`   ❌ Erreur ${zipFile.name}: ${e.message}`); }
            
            if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        }

    } catch (e) { console.log("❌ Erreur FTP Global : " + e.message); }
    
    client.close();
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
    console.log("🎉 SYNCHRO TERMINÉE.");
}

main();
