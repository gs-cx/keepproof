const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_daily.zip";
const XML_DIR = "/root/frontend/temp_daily_xml";

// ⚠️ IMPORTANT : Vérifiez le chemin du dossier quotidien sur le FTP INPI.
// Souvent c'est à la racine ou dans un dossier "Flux" ou "2024".
// Ici on regarde à la racine "/" par défaut.
const FTP_SCAN_DIR = "/"; 

const REGEX = {
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

async function main() {
    console.log("🌅 DAILY SYNC : SYNCHRONISATION QUOTIDIENNE...");
    
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // 1. Trouver le fichier le plus récent
        console.log("🔍 Recherche du fichier le plus récent sur le FTP...");
        const list = await client.list(FTP_SCAN_DIR);
        
        // On cherche les ZIP qui commencent par "FR_" (format standard INPI)
        // On trie par date de modification (le plus récent en premier)
        const recentFiles = list
            .filter(f => f.name.endsWith(".zip") && f.name.startsWith("FR_"))
            .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

        if (recentFiles.length === 0) {
            console.log("⚠️  Aucun fichier de mise à jour trouvé.");
            client.close();
            return;
        }

        const targetFile = recentFiles[0]; // Le plus récent
        console.log(`🎯 Fichier cible identifié : ${targetFile.name} (${targetFile.modifiedAt})`);

        // 2. Téléchargement
        console.log(`⬇️  Téléchargement en cours...`);
        await client.downloadTo(TEMP_ZIP, `${FTP_SCAN_DIR}/${targetFile.name}`);

        // 3. Préparation Traitement
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        
        console.log("📦 Décompression...");
        execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        // 4. Indexation des images contenues dans CE zip (Delta)
        // Note : Les images du jour sont DANS le zip du jour. Pas besoin de scanner tout le disque.
        console.log("🧠 Indexation des images du jour...");
        const dailyImages = new Map();
        
        // On cherche les images extraites dans le dossier temporaire
        const findImages = (dir) => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    findImages(fullPath);
                } else if (file.match(/\.(jpg|gif|png|tif)$/i)) {
                    // On déplace l'image vers le stockage final tout de suite
                    const finalPath = path.join(STORAGE_DIR, file);
                    fs.renameSync(fullPath, finalPath); // Déplacement physique
                    
                    const id = extractID(file);
                    if (id) dailyImages.set(id, file);
                }
            }
        };
        findImages(XML_DIR);
        console.log(`✅ ${dailyImages.size} nouvelles images déplacées vers le stockage.`);

        // 5. Traitement XML
        const xmlFiles = getAllXmlFiles(XML_DIR);
        console.log(`📄 Mise à jour de ${xmlFiles.length} fiches...`);

        let updatedCount = 0;
        
        for (const xmlPath of xmlFiles) {
            const content = fs.readFileSync(xmlPath, "utf8");
            const blocks = content.split("</Design>");
            
            for (const block of blocks) {
                const mDate = block.match(REGEX.date);
                const mTitle = block.match(REGEX.title);
                const mLocarno = block.match(REGEX.locarno);
                
                // Récupération ID via Image ou XML si image absente (cas modification sans nouvelle image)
                let realID = null;
                let imagePath = null;

                const mFile = [...block.matchAll(/<ViewFilename>([^<]+)<\/ViewFilename>/g)];
                
                // Essai 1 : Via l'image présente dans le zip
                for (const m of mFile) {
                    const xmlID = extractID(m[1].trim());
                    if (xmlID && dailyImages.has(xmlID)) {
                        realID = xmlID;
                        imagePath = `/designs/${dailyImages.get(xmlID)}`;
                        break; 
                    }
                }

                // Essai 2 : Si pas d'image dans le zip (ex: juste un changement de statut), on cherche l'ID dans le XML
                // Attention au piège du "000001". On essaie de trouver un ID cohérent (> 1000)
                if (!realID) {
                     // Logique avancée : Si c'est une mise à jour sans image, il faudrait parser <RegistrationNumber>
                     // Mais comme vu, ce champ est souvent faux dans les vieux fichiers.
                     // Pour le flux quotidien RECENT, <RegistrationNumber> est souvent CORRECT.
                     const regNumMatch = block.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
                     if (regNumMatch) realID = regNumMatch[1].trim();
                }

                if (!realID) continue;

                // Préparation données
                const payload = {
                    num_enregistrement: realID,
                    date: mDate ? mDate[1] : undefined, // On garde l'ancienne date si pas présente
                    description: mTitle ? mTitle[1].trim().substring(0, 190) : undefined,
                    locarno_class: mLocarno ? mLocarno[1].trim() : undefined,
                    // On ne met à jour l'image que si on en a reçu une nouvelle
                    ...(imagePath && { image_file: imagePath })
                };
