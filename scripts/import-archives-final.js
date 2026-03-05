const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_savior.zip";
const XML_DIR = "/root/frontend/temp_savior_xml";

const TARGET_FILES = [
    "FR_FRBCKST86_2019-02_0001.zip",
    "FR_FRBCKST86_2019-02_0002.zip",
    "FR_FRBCKST86_2019-02_0003.zip"
];

const REGEX = {
    date: /<DesignApplicationDate>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/DesignApplicationDate>/,
    title: /<DesignTitle>([^<]+)<\/DesignTitle>/,
    locarno: /<ClassNumber>([0-9]+)<\/ClassNumber>/
};

// Fonction critique : Extrait "579337" de "dmf0000000579337_001.jpg"
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

async function downloadOneFile(filename) {
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });
        console.log(`⬇️  Téléchargement : ${filename}...`);
        await client.downloadTo(TEMP_ZIP, `/OPENDATA_FRDM_BACKLOG/Archives/${filename}`);
        client.close();
        return true;
    } catch (e) {
        console.log(`❌ Erreur FTP : ${e.message}`);
        client.close();
        return false;
    }
}

async function main() {
    console.log("🚑 LE SAUVEUR : IMPORTATION AVEC VRAIS ID (CORRECTION FINALE)...");

    // 1. INDEXATION
    console.log("🧠 Indexation des images...");
    const idMap = new Map();
    try {
        const files = fs.readdirSync(STORAGE_DIR);
        for (const file of files) {
            const id = extractID(file);
            if (id) idMap.set(id, file);
        }
        console.log(`✅ ${idMap.size} images prêtes.`);
    } catch(e) { console.log("❌ Erreur disque:", e); return; }

    // 2. TRAITEMENT
    for (const zipName of TARGET_FILES) {
        const success = await downloadOneFile(zipName);
        if (!success) continue;

        try {
            if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
            fs.mkdirSync(XML_DIR);
            
            console.log("   📦 Décompression...");
            execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

            const xmlFiles = getAllXmlFiles(XML_DIR);
            console.log(`   📄 Traitement de ${xmlFiles.length} fichiers XML...`);

            let createdCount = 0;
            const batchSize = 200; // Batch plus gros pour aller vite
            let batchData = [];

            for (const xmlPath of xmlFiles) {
                const content = fs.readFileSync(xmlPath, "utf8");
                const blocks = content.split("</Design>");
                
                for (const block of blocks) {
                    const mDate = block.match(REGEX.date);
                    const mTitle = block.match(REGEX.title);
                    const mLocarno = block.match(REGEX.locarno);
                    
                    // ON CHERCHE D'ABORD L'IMAGE POUR TROUVER LE VRAI ID
                    let imagePath = null;
                    let realID = null;

                    const mFile = [...block.matchAll(/<ViewFilename>([^<]+)<\/ViewFilename>/g)];
                    for (const m of mFile) {
                        const xmlID = extractID(m[1].trim());
                        if (xmlID && idMap.has(xmlID)) {
                            realID = xmlID; // VOILÀ LE VRAI ID UNIQUE (ex: 579337)
                            imagePath = `/designs/${idMap.get(xmlID)}`;
                            break; 
                        }
                    }

                    // Si on n'a pas trouvé d'ID dans l'image, on saute cette fiche (trop risqué d'utiliser le faux ID)
                    if (!realID) continue;

                    batchData.push({
                        num_enregistrement: realID, // ON UTILISE L'ID EXTRAIT DE L'IMAGE
                        date: mDate ? mDate[1] : "2000-01-01", 
                        description: mTitle ? mTitle[1].trim().substring(0, 190) : "Sans titre",
                        locarno_class: mLocarno ? mLocarno[1].trim() : "00-00",
                        image_file: imagePath
                    });

                    if (batchData.length >= batchSize) {
                        for (const item of batchData) {
                            await prisma.inpi_Design.upsert({
                                where: { num_enregistrement: item.num_enregistrement },
                                update: { image_file: item.image_file }, // Mise à jour si existe déjà
                                create: item // Création avec le VRAI numéro si nouveau
                            });
                        }
                        createdCount += batchData.length;
                        batchData = [];
                        if (createdCount % 5000 === 0) process.stdout.write(`   ... ${createdCount} fiches sauvées\r`);
                    }
                }
            }
            
            if (batchData.length > 0) {
                for (const item of batchData) {
                    await prisma.inpi_Design.upsert({
                        where: { num_enregistrement: item.num_enregistrement },
                        update: { image_file: item.image_file },
                        create: item
                    });
                }
                createdCount += batchData.length;
            }

            console.log(`\n   🎉 ${createdCount} NOUVEAUX dessins sauvés depuis ${zipName}.`);

        } catch (e) { console.log(`   ❌ Erreur traitement : ${e.message}`); }

        if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
    }

    console.log("\n🚀 BASE DE DONNÉES RÉPARÉE ET COMPLÈTE.");
}

main();
