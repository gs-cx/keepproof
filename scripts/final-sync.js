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
    console.log("🚀 DÉMARRAGE DE LA SYNCHRONISATION TOTALE...");

    // ---------------------------------------------------------
    // ÉTAPE 1 : INDEXER LES IMAGES (Mise en mémoire tampon)
    // ---------------------------------------------------------
    console.log("📸 Lecture des 80 000+ images (Indexation)...");
    const imageFiles = fs.readdirSync(IMAGES_DIR);
    
    // Map : ID "1167" => "/designs/dmf...1167...jpg"
    const imageIndex = new Map();

    for (const file of imageFiles) {
        // Regex pour extraire l'ID sans les zéros : dmf000(1234)_
        const match = file.match(/dmf0*(\d+)_/);
        if (match && match[1]) {
            imageIndex.set(match[1], `/designs/${file}`);
        }
    }
    console.log(`✅ Indexation terminée : ${imageIndex.size} images uniques prêtes.`);

    // ---------------------------------------------------------
    // ÉTAPE 2 : NETTOYER LES "FANTÔMES" (Optionnel mais recommandé)
    // ---------------------------------------------------------
    console.log("🧹 Nettoyage des entrées incorrectes (FR_...) dans la base...");
    const deleted = await prisma.inpi_Design.deleteMany({
        where: { 
            num_enregistrement: { startsWith: 'FR_' } // Supprime les IDs qui sont des noms de fichiers
        }
    });
    console.log(`🗑️ ${deleted.count} entrées incorrectes supprimées.`);

    // ---------------------------------------------------------
    // ÉTAPE 3 : IMPORTER LES XML AVEC LE BON ID
    // ---------------------------------------------------------
    const xmlFiles = fs.readdirSync(BACKLOG_DIR).filter(f => f.endsWith('.xml'));
    console.log(`📄 Traitement des ${xmlFiles.length} fiches XML...`);

    let successCount = 0;
    let imageFoundCount = 0;

    for (const file of xmlFiles) {
        try {
            const xmlContent = fs.readFileSync(path.join(BACKLOG_DIR, file), 'utf8');
            
            // Extraction "Bourrin" (Regex) pour aller vite et éviter les erreurs de parsing
            // 1. Chercher le vrai ID
            let realID = null;
            const idMatch = xmlContent.match(/<DesignIdentifier>(.*?)<\/DesignIdentifier>/);
            
            // Si pas d'ID explicite, on essaie de le deviner via le nom de fichier image cité
            if (idMatch && idMatch[1]) {
                realID = idMatch[1];
            } else {
                const viewMatch = xmlContent.match(/<ViewFilename>dmf0*(\d+)_/);
                if (viewMatch && viewMatch[1]) realID = viewMatch[1];
            }

            // Si on n'a toujours pas d'ID, on passe
            if (!realID) continue;

            // 2. Chercher les autres infos
            const titleMatch = xmlContent.match(/<DesignTitle>(.*?)<\/DesignTitle>/);
            const dateMatch = xmlContent.match(/<RegistrationDate>(.*?)<\/RegistrationDate>/);
            const partyMatch = xmlContent.match(/<PartyName>(.*?)<\/PartyName>/);

            const title = titleMatch ? titleMatch[1] : "Sans titre";
            const date = dateMatch ? dateMatch[1] : "2000-01-01";
            const owner = partyMatch ? partyMatch[1] : "Anonyme";

            // 3. CHECKER L'IMAGE DANS NOTRE INDEX
            let finalImagePath = null;
            if (imageIndex.has(realID)) {
                finalImagePath = imageIndex.get(realID);
                imageFoundCount++;
            }

            // 4. SAUVEGARDER
            await prisma.inpi_Design.upsert({
                where: { num_enregistrement: realID },
                update: { image_file: finalImagePath },
                create: {
                    num_enregistrement: realID,
                    titre: title.substring(0, 200),
                    deposant: owner.substring(0, 200),
                    date: date,
                    image_file: finalImagePath,
                    statut: "Final_Sync"
                }
            });

            successCount++;
            if (successCount % 100 === 0) process.stdout.write(".");

        } catch (e) {
            // Erreur silencieuse pour ne pas bloquer
        }
    }

    console.log(`\n\n🎉 SYNCHRONISATION TERMINÉE !`);
    console.log(`✅ ${successCount} dessins importés proprement.`);
    console.log(`🖼️ ${imageFoundCount} images associées.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
