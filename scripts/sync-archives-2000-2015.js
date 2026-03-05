const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_indiana.zip";
const XML_DIR = "/root/frontend/temp_indiana_xml";

// Les 3 fichiers identifiés dans /Archives
const TARGET_FILES = [
    "FR_FRBCKST86_2019-02_0001.zip",
    "FR_FRBCKST86_2019-02_0002.zip",
    "FR_FRBCKST86_2019-02_0003.zip"
];

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
    console.log("🤠 INDIANA JONES : RÉCUPÉRATION DU TRÉSOR (2000-2015)...");
    
    // 1. INDEXATION SPÉCIALE (Par nom de fichier exact sans extension)
    console.log("🧠 Chargement de la mémoire disque (Mode Exact)...");
    const fileMap = new Map();
    try {
        const files = fs.readdirSync(STORAGE_DIR);
        for (const file of files) {
            // On enlève l'extension pour créer la clé (ex: "dmf...001.jpg" -> "dmf...001")
            const baseName = path.parse(file).name;
            fileMap.set(baseName, file);
        }
    } catch(e) { console.log("❌ Erreur disque:", e); return; }
    console.log(`✅ ${fileMap.size} images prêtes.`);

    // 2. FTP
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        const ARCHIVE_DIR = "/OPENDATA_FRDM_BACKLOG/Archives";

        for (const zipName of TARGET_FILES) {
            try {
                console.log(`\n⬇️  Traitement de l'archive : ${zipName}...`);
                await client.downloadTo(TEMP_ZIP, `${ARCHIVE_DIR}/${zipName}`);
                
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
                        // 1. Numéro Enregistrement
                        const regMatch = block.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
                        if (!regMatch) continue;
                        const numEnregistrement = regMatch[1].trim();

                        // 2. Nom du fichier image (Spécifique aux archives)
                        // On cherche <ViewFilename>XXXX</ViewFilename>
                        const filenameMatches = [...block.matchAll(/<ViewFilename>([^<]+)<\/ViewFilename>/g)];
                        
                        for (const m of filenameMatches) {
                            const rawFilename = m[1].trim(); // ex: dmf0000000000579337_001
                            
                            // 3. Recherche dans la map (Est-ce qu'on a le JPG ?)
                            if (fileMap.has(rawFilename)) {
                                const realFile = fileMap.get(rawFilename); // ex: ... .jpg
                                
                                await prisma.inpi_Design.updateMany({
                                    where: { num_enregistrement: numEnregistrement },
                                    data: { image_file: `/designs/${realFile}` }
                                });
                                updated++;
                            }
                        }
                    }
                }
                console.log(`   💎 ${updated} trésors restaurés dans ce ZIP.`);

            } catch (e) { console.log(`   ❌ Erreur sur ${zipName} : ${e.message}`); }
            
            // Nettoyage
            if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
            if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        }

    } catch (e) { console.log("❌ Erreur FTP : " + e.message); }
    
    client.close();
    console.log("\n🎉 EXPÉDITION TERMINÉE.");
}

main();
