const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_architect.zip";
const XML_DIR = "/root/frontend/temp_architect_xml";

const TARGET_FILES = [
    "FR_FRBCKST86_2019-02_0001.zip",
    "FR_FRBCKST86_2019-02_0002.zip",
    "FR_FRBCKST86_2019-02_0003.zip"
];

const REGEX = {
    num: /<RegistrationNumber>([^<]+)<\/RegistrationNumber>/,
    date: /<DesignApplicationDate>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/DesignApplicationDate>/,
    title: /<DesignTitle>([^<]+)<\/DesignTitle>/,
    locarno: /<ClassNumber>([0-9]+)<\/ClassNumber>/
};

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
    console.log("🏗️  ARCHITECTE : IMPORTATION COMPLÈTE (CORRIGÉE)...");

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
            const batchSize = 100;
            let batchData = [];

            for (const xmlPath of xmlFiles) {
                const content = fs.readFileSync(xmlPath, "utf8");
                const blocks = content.split("</Design>");
                
                for (const block of blocks) {
                    const mNum = block.match(REGEX.num);
                    if (!mNum) continue;

                    const num = mNum[1].trim();
                    const mDate = block.match(REGEX.date);
                    const mTitle = block.match(REGEX.title);
                    const mLocarno = block.match(REGEX.locarno);
                    
                    let imagePath = null;
                    const mFile = [...block.matchAll(/<ViewFilename>([^<]+)<\/ViewFilename>/g)];
                    for (const m of mFile) {
                        const xmlID = extractID(m[1].trim());
                        if (xmlID && idMap.has(xmlID)) {
                            imagePath = `/designs/${idMap.get(xmlID)}`;
                            break; 
                        }
                    }

                    // CORRECTION ICI : Mapping vers les vrais noms de colonnes
                    batchData.push({
                        num_enregistrement: num,
                        date: mDate ? mDate[1] : "2000-01-01", // On envoie une String (YYYY-MM-DD)
                        description: mTitle ? mTitle[1].trim().substring(0, 190) : "Sans titre", // 'titre' devient 'description'
                        locarno_class: mLocarno ? mLocarno[1].trim() : "00-00", // 'locarno' devient 'locarno_class'
                        image_file: imagePath
                        // On a supprimé source_xml et date_publication qui n'existent pas
                    });

                    if (batchData.length >= batchSize) {
                        for (const item of batchData) {
                            await prisma.inpi_Design.upsert({
                                where: { num_enregistrement: item.num_enregistrement },
                                update: { image_file: item.image_file },
                                create: item
                            });
                        }
                        createdCount += batchData.length;
                        batchData = [];
                        if (createdCount % 5000 === 0) process.stdout.write(`   ... ${createdCount} fiches traitées\r`);
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

            console.log(`\n   🎉 ${createdCount} dessins importés depuis ${zipName}.`);

        } catch (e) { console.log(`   ❌ Erreur traitement : ${e.message}`); }

        if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
    }

    console.log("\n🚀 IMPORTATION HISTORIQUE TERMINÉE.");
}

main();
