const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TEMP_ZIP = "/root/frontend/temp_archive.zip";
const XML_DIR = "/root/frontend/temp_archive_xml";

// Fonction récursive
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
    console.log("🔬 ANALYSE TEMPORELLE DE L'ARCHIVE 2019...");

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // On cible le premier fichier de l'archive 2019
        const TARGET = "/OPENDATA_FRDM_BACKLOG/Archives/FR_FRBCKST86_2019-02_0001.zip";
        
        console.log(`⬇️  Téléchargement de l'échantillon : ${path.basename(TARGET)}...`);
        await client.downloadTo(TEMP_ZIP, TARGET);
        
        console.log("📦 Décompression...");
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        const xmlFiles = getAllXmlFiles(XML_DIR);
        console.log(`📊 Analyse de ${xmlFiles.length} fichiers XML extraits.`);

        // STATISTIQUES
        const yearsFound = new Set();
        let minDate = "9999-99-99";
        let maxDate = "0000-00-00";

        // On ne scanne que les 2000 premiers pour aller vite
        const sampleSize = Math.min(xmlFiles.length, 2000);
        
        for (let i = 0; i < sampleSize; i++) {
            const content = fs.readFileSync(xmlFiles[i], "utf8");
            
            // Recherche de la date d'enregistrement
            const match = content.match(/<RegistrationDate>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/RegistrationDate>/);
            
            if (match) {
                const date = match[1]; // Ex: 2014-05-12
                const year = date.split("-")[0];
                yearsFound.add(year);
                
                if (date < minDate) minDate = date;
                if (date > maxDate) maxDate = date;
            }
        }

        console.log("\n🕰️  RÉSULTATS DE LA DATATION :");
        console.log("-----------------------------------");
        console.log(`📅 Date la plus ancienne trouvée : ${minDate}`);
        console.log(`📅 Date la plus récente trouvée  : ${maxDate}`);
        console.log(`📂 Années présentes : ${Array.from(yearsFound).sort().join(", ")}`);
        console.log("-----------------------------------");

        if (minDate.startsWith("2014") || minDate.startsWith("2013") || minDate < "2015") {
            console.log("💎 TRÉSOR ! Cette archive contient des données antérieures à 2015.");
        } else {
            console.log("🗑️  DOUBLON PROBABLE. Cette archive ne semble contenir que ce que vous avez déjà (2015+).");
        }

    } catch (e) { console.log("❌ Erreur : " + e.message); }
    
    client.close();
    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
}

main();
