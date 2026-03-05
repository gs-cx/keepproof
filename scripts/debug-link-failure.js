const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const STORAGE_DIR = "/var/www/designs_storage/";
const TEMP_ZIP = "/root/frontend/temp_debug_link.zip";
const XML_DIR = "/root/frontend/temp_debug_link_xml";

async function main() {
    console.log("🕵️‍♂️ ENQUÊTE SUR LE LIGNE INVISIBLE...");

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // On reprend le fichier 0001
        const TARGET = "/OPENDATA_FRDM_BACKLOG/Archives/FR_FRBCKST86_2019-02_0001.zip";
        
        console.log(`⬇️  Téléchargement d'un échantillon XML...`);
        await client.downloadTo(TEMP_ZIP, TARGET);
        
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        execSync(`unzip -o -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
        
        // On va analyser les 5 premiers fichiers qui ont une image
        let attempts = 0;
        
        for (const file of files) {
            if (attempts >= 5) break;

            const content = fs.readFileSync(path.join(XML_DIR, file), "utf8");
            const match = content.match(/<ViewFilename>([^<]+)<\/ViewFilename>/);
            
            if (match) {
                attempts++;
                const xmlName = match[1].trim();
                console.log(`\n--------------------------------------------------`);
                console.log(`📄 LE XML DEMANDE : "${xmlName}"`);
                
                // 1. Test exact
                if (fs.existsSync(path.join(STORAGE_DIR, xmlName + ".jpg"))) {
                    console.log("✅ Trouvé exactement ! (Bizarre, le script aurait dû marcher)");
                } else {
                    console.log("❌ Pas de fichier exact trouvé.");
                    
                    // 2. Recherche intelligente (par ID numérique)
                    // On extrait juste les chiffres significatifs (ex: 579337)
                    // On suppose que le format est dmf00...ID_001
                    const idMatch = xmlName.match(/([1-9][0-9]*)/); // Trouve la première séquence de chiffres non nuls
                    
                    if (idMatch) {
                        const coreID = idMatch[0];
                        console.log(`🔍 Recherche de l'ID "${coreID}" dans le dossier de stockage...`);
                        
                        try {
                            // On utilise la commande Linux find pour chercher ce numéro dans les noms de fichiers
                            const cmd = `find ${STORAGE_DIR} -name "*${coreID}*" -print -quit`;
                            const found = execSync(cmd).toString().trim();
                            
                            if (found) {
                                console.log(`💡 FICHIER CORRESPONDANT TROUVÉ SUR LE DISQUE :`);
                                console.log(`   👉 ${path.basename(found)}`);
                                console.log(`\n🚨 DIAGNOSTIC :`);
                                console.log(`   XML  : ${xmlName}`);
                                console.log(`   DISK : ${path.basename(found, ".jpg")}`);
                                console.log(`   La différence est probablement le nombre de zéros !`);
                            } else {
                                console.log("⚠️ Aucune trace de cet ID sur le disque. L'image est peut-être manquante.");
                            }
                        } catch (e) { console.log("Erreur find: " + e.message); }
                    }
                }
            }
        }

    } catch (e) { console.log("❌ Erreur : " + e.message); }
    
    client.close();
    // Nettoyage
    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
    if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
}

main();
