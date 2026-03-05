const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
process.env.DATABASE_URL = "postgresql://keep_web:keep1234@127.0.0.1:5433/keepproof_v2?schema=public";

const prisma = new PrismaClient();
const BACKLOG_DIR = '/root/frontend/inpi_designs_backlog';
const IMAGES_DIR = '/root/frontend/public/designs';

async function main() {
    console.log("🏗️ DÉMARRAGE DE L'EXTRACTION UNIVERSELLE...");

    // 1. INDEXER LES IMAGES
    console.log("📸 Indexation des images...");
    const imageFiles = fs.readdirSync(IMAGES_DIR);
    const imageIndex = new Map();
    for (const file of imageFiles) {
        const match = file.match(/dmf0*(\d+)_/);
        if (match && match[1]) imageIndex.set(match[1], `/designs/${file}`);
    }
    console.log(`✅ ${imageIndex.size} images indexées.`);

    // 2. LIRE LES GROS FICHIERS XML
    const xmlFiles = fs.readdirSync(BACKLOG_DIR).filter(f => f.endsWith('.xml'));
    let totalImported = 0;
    let totalImagesMatched = 0;

    for (const file of xmlFiles) {
        const content = fs.readFileSync(path.join(BACKLOG_DIR, file), 'utf8');
        
        // On découpe par bloc <Design>...</Design> (C'est le standard INPI)
        const chunks = content.split(/<\/Design>/i);
        
        // Si ça ne marche pas, on tente le découpage par Transaction (pour les nouveaux formats)
        const validChunks = chunks.length > 1 ? chunks : content.split(/<\/DesignDetails>/i);

        process.stdout.write(`\n📄 ${file} (${validChunks.length} blocs)... `);
        let fileSuccess = 0;

        for (const chunk of validChunks) {
            // --- EXTRACTION POLYVALENTE ---
            
            // 1. CHERCHER L'ID (Compatible Ancien & Nouveau format)
            let realID = null;
            const idMatchNew = chunk.match(/<DesignIdentifier>(.*?)<\/DesignIdentifier>/);
            const idMatchOld = chunk.match(/<RegistrationNumber>(.*?)<\/RegistrationNumber>/);
            
            if (idMatchNew) realID = idMatchNew[1];
            else if (idMatchOld) realID = idMatchOld[1];

            if (!realID) continue; // Pas d'ID, on passe

            // 2. CHERCHER LE TITRE
            let title = "Sans titre";
            const titleMatch = chunk.match(/<DesignTitle>(.*?)<\/DesignTitle>/);
            if (titleMatch) title = titleMatch[1];

            // 3. CHERCHER LA DATE
            let date = "1900-01-01";
            const dateMatchApp = chunk.match(/<DesignApplicationDate>(.*?)<\/DesignApplicationDate>/);
            const dateMatchReg = chunk.match(/<RegistrationDate>(.*?)<\/RegistrationDate>/);
            if (dateMatchApp) date = dateMatchApp[1];
            else if (dateMatchReg) date = dateMatchReg[1];

            // 4. CHERCHER L'IMAGE
            // On essaie de trouver le nom du fichier image cité dans le XML
            let finalImagePath = null;
            const viewMatch = chunk.match(/<ViewFilename>dmf0*(\d+)_/); // ex: dmf000...132637_
            
            // Méthode 1 : L'ID extrait du <ViewFilename>
            if (viewMatch && viewMatch[1] && imageIndex.has(viewMatch[1])) {
                finalImagePath = imageIndex.get(viewMatch[1]);
            }
            // Méthode 2 : L'ID du dessin lui-même
            else if (imageIndex.has(realID)) {
                finalImagePath = imageIndex.get(realID);
            }

            if (finalImagePath) totalImagesMatched++;

            try {
                await prisma.inpi_Design.upsert({
                    where: { num_enregistrement: realID },
                    update: { image_file: finalImagePath },
                    create: {
                        num_enregistrement: realID,
                        titre: title.substring(0, 200),
                        deposant: "INPI Archive", // Simplification pour les archives
                        date: date,
                        image_file: finalImagePath,
                        statut: "Universal_Sync"
                    }
                });
                fileSuccess++;
                totalImported++;
            } catch (e) {}
        }
        process.stdout.write(`+${fileSuccess}`);
    }

    console.log(`\n\n🎉 TERMINÉ !`);
    console.log(`📊 Total Dessins : ${totalImported}`);
    console.log(`🖼️ Images Reliées : ${totalImagesMatched}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
