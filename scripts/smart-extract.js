const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
process.env.DATABASE_URL = "postgresql://keep_web:keep1234@127.0.0.1:5433/keepproof_v2?schema=public";

const prisma = new PrismaClient();
const BACKLOG_DIR = '/root/frontend/inpi_designs_backlog';
const IMAGES_DIR = '/root/frontend/public/designs';

async function main() {
    console.log("👨‍⚕️ DÉMARRAGE DE L'EXTRACTION INTELLIGENTE (MATCH PAR ID)...");

    // 1. LISTER LES ID RECHERCHÉS
    const xmlFiles = fs.readdirSync(BACKLOG_DIR).filter(f => f.endsWith('.xml'));
    console.log(`📋 Analyse des ${xmlFiles.length} fiches XML...`);

    const parser = new xml2js.Parser();
    // Set : contient juste les numéros d'ID dont on a besoin (ex: "917240")
    const neededIDs = new Set();
    let processedCount = 0;

    for (const file of xmlFiles) {
        processedCount++;
        if (processedCount % 100 === 0) process.stdout.write(` [${processedCount}]`);

        try {
            const xmlData = fs.readFileSync(path.join(BACKLOG_DIR, file), 'utf8');
            // Extraction rapide par Regex (plus rapide que le parsing XML complet)
            // On cherche <DesignIdentifier>917240</DesignIdentifier>
            const idMatch = xmlData.match(/<DesignIdentifier>(.*?)<\/DesignIdentifier>/);
            
            if (idMatch && idMatch[1]) {
                neededIDs.add(idMatch[1]); // On stocke "917240"
            } else {
                // Fallback: on essaie de prendre l'ID dans le nom du fichier view si besoin
                const viewMatch = xmlData.match(/<ViewFilename>dmf0*(\d+)_/);
                if (viewMatch && viewMatch[1]) neededIDs.add(viewMatch[1]);
            }
        } catch (e) {}
    }
    console.log(`\n🚑 NOUS CHERCHONS ${neededIDs.size} DESSINS SPÉCIFIQUES.`);

    // 2. SCANNER LES ARCHIVES
    const zipFiles = fs.readdirSync(BACKLOG_DIR).filter(f => f.endsWith('.zip') && f.includes('image'));
    console.log(`📦 ${zipFiles.length} archives à scanner.`);

    let extractedCount = 0;

    for (const zipFile of zipFiles) {
        if (neededIDs.size === 0) break;

        console.log(`🔍 Scan de ${zipFile}...`);
        try {
            const zip = new AdmZip(path.join(BACKLOG_DIR, zipFile));
            const zipEntries = zip.getEntries();
            
            for (const entry of zipEntries) {
                if (entry.isDirectory) continue;
                
                // Analyse du nom de fichier dans le ZIP
                // ex: 000/000/dmf000000000917240_001_001.jpg
                const entryName = entry.name; // juste le nom final
                
                // On extrait le numéro ID caché dans le nom du fichier
                // On cherche ce qui est après "dmf" et les zéros, jusqu'au underscore
                const match = entryName.match(/dmf0*(\d+)_/);
                
                if (match && match[1]) {
                    const fileID = match[1]; // ex: "917240"
                    
                    if (neededIDs.has(fileID)) {
                        // BINGO ! L'ID correspond, peu importe le nombre de zéros
                        
                        // On extrait
                        zip.extractEntryTo(entry, IMAGES_DIR, false, true);
                        
                        // On met à jour la base
                        await prisma.inpi_Design.updateMany({
                            where: { num_enregistrement: fileID },
                            data: { image_file: `/designs/${entryName}` }
                        });

                        // On retire de la liste (on l'a trouvé)
                        neededIDs.delete(fileID);
                        extractedCount++;
                        process.stdout.write("💊");
                    }
                }
            }
        } catch (err) {
            // Ignorer les zips corrompus
        }
    }

    console.log(`\n\n🎉 TERMINÉ !`);
    console.log(`✅ ${extractedCount} images récupérées.`);
    if (neededIDs.size > 0) console.log(`❌ ${neededIDs.size} dessins restent introuvables.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
