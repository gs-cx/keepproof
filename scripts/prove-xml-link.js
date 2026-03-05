const ftp = require("basic-ftp");
const fs = require("fs");
const { execSync } = require("child_process");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '/root/frontend/.env' });

const REMOTE_FILE = "/2024/FR_FRAMDST86_2024-01.zip";
const LOCAL_ZIP = "/root/frontend/temp_xml.zip";
const EXTRACT_DIR = "/root/frontend/temp_xml_folder";

async function main() {
    const client = new ftp.Client();
    // client.ftp.verbose = true;

    try {
        console.log("🔌 Connexion FTP pour récupérer la 'Pierre de Rosette' (XML)...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log(`⬇️  Téléchargement de ${REMOTE_FILE}...`);
        await client.downloadTo(LOCAL_ZIP, REMOTE_FILE);
        console.log("✅ Téléchargement OK.");
        client.close();

        // Nettoyage et Création dossier
        if (fs.existsSync(EXTRACT_DIR)) fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
        fs.mkdirSync(EXTRACT_DIR);

        console.log("📦 Décompression des fiches XML...");
        execSync(`unzip -o -q "${LOCAL_ZIP}" -d "${EXTRACT_DIR}"`);

        // Lecture d'un fichier XML au hasard
        const files = fs.readdirSync(EXTRACT_DIR).filter(f => f.endsWith('.xml'));
        if (files.length === 0) throw new Error("Aucun fichier XML trouvé dans l'archive !");

        console.log(`\n🧐 Analyse du fichier : ${files[0]}`);
        const xmlContent = fs.readFileSync(path.join(EXTRACT_DIR, files[0]), 'utf8');

        // Recherche artisanale (sans parser lourd) des infos clés
        console.log("--- CONTENU BRUT (EXTRAIT) ---");
        
        // On cherche le numéro d'enregistrement
        const numMatch = xmlContent.match(/<DesignReproductionIdentifier>([^<]+)<\/DesignReproductionIdentifier>/) 
                      || xmlContent.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
        
        // On cherche le nom de l'image
        const imgMatch = xmlContent.match(/<FileName>([^<]+)<\/FileName>/) 
                      || xmlContent.match(/<ExternalFileName>([^<]+)<\/ExternalFileName>/);

        if (numMatch) console.log(`🔑 Numéro Enregistrement trouvé : ${numMatch[1]}`);
        else console.log("⚠️ Numéro non trouvé (balise différente ?)");

        if (imgMatch) console.log(`🖼️ Nom Image trouvé : ${imgMatch[1]}`);
        else console.log("⚠️ Nom Image non trouvé (balise différente ?)");

        if (numMatch && imgMatch) {
            console.log("\n🎉 VICTOIRE ! Nous avons le lien entre la base et les images !");
        }

    } catch(err) {
        console.log("❌ Erreur :", err.message);
    }
}

main();
