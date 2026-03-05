const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

const TEMP_ZIP = "/root/frontend/temp_microscope.zip";
const XML_DIR = "/root/frontend/temp_microscope_xml";

// Le fichier et le dossier exacts trouvés précédemment
const TARGET_YEAR = "2024";
const TARGET_ZIP_PART = "FR_FRAMDST86_2024-06"; // On sait qu'il est là
const NEEDLE = "6681"; // Le numéro d'image qu'on sait exister sur le disque

async function main() {
    console.log(`🔬 MICROSCOPE ACTIVÉ : Cible ${NEEDLE} dans ${TARGET_ZIP_PART}...`);
    
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        const list = await client.list(`/${TARGET_YEAR}`);
        const zipFile = list.find(f => f.name.includes(TARGET_ZIP_PART));

        if (!zipFile) { console.log("❌ Zip introuvable."); return; }

        console.log(`⬇️ Téléchargement de ${zipFile.name}...`);
        await client.downloadTo(TEMP_ZIP, `/${TARGET_YEAR}/${zipFile.name}`);
        
        if (fs.existsSync(XML_DIR)) fs.rmSync(XML_DIR, { recursive: true, force: true });
        fs.mkdirSync(XML_DIR);
        execSync(`unzip -o -j -q "${TEMP_ZIP}" -d "${XML_DIR}"`);

        // On cherche le fichier XML qui contient l'aiguille
        const grepCmd = `grep -l "${NEEDLE}" "${XML_DIR}"/*.xml`;
        let xmlFile;
        try { xmlFile = execSync(grepCmd).toString().trim(); } catch(e) {}

        if (xmlFile) {
            console.log(`\n📄 ANATOMIE DU FICHIER : ${xmlFile}`);
            const content = fs.readFileSync(xmlFile, "utf8");
            
            // On découpe par Design
            const blocks = content.split("</Design>");
            
            for (const block of blocks) {
                if (block.includes(NEEDLE)) {
                    console.log("\n🔍 --- DÉBUT DU BLOC XML COMPLET ---");
                    // On nettoie un peu les espaces pour la lisibilité mais on garde tout
                    console.log(block.replace(/^\s*[\r\n]/gm, "") + "</Design>");
                    console.log("🔍 --- FIN DU BLOC XML COMPLET ---\n");
                    
                    console.log("⚠️ ANALYSEZ CE BLOC :");
                    console.log("1. Cherchez '6681'.");
                    console.log("2. Regardez dans quelle balise il est.");
                    console.log("3. Regardez s'il y a un 'RegistrationNumber' associé.");
                    break; // On en affiche un seul, ça suffit
                }
            }
        } else {
            console.log("❌ Le numéro 6681 est introuvable dans ce ZIP (bizarre, grep l'avait vu).");
            // Plan B : Affichez n'importe quel bloc image pour voir la structure
            console.log("   Affichage d'un bloc standard pour analyse de structure :");
            const firstXml = fs.readdirSync(XML_DIR).find(f => f.endsWith(".xml"));
            const content = fs.readFileSync(`${XML_DIR}/${firstXml}`, "utf8");
            const firstBlock = content.split("</Design>")[1];
            console.log(firstBlock + "</Design>");
        }

    } catch(e) { console.log(e); }
    client.close();
    if (fs.existsSync(TEMP_ZIP)) fs.unlinkSync(TEMP_ZIP);
}
main();
