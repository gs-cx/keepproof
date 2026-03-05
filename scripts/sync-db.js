const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const REAL_IMAGES_PATH = '/root/frontend/real-images.json';

async function main() {
    console.log("🚀 Démarrage de la synchronisation Base de Données <-> Disque...");

    // 1. Charger la liste des vraies images
    if (!fs.existsSync(REAL_IMAGES_PATH)) {
        console.error("❌ Fichier real-images.json introuvable ! Lancez d'abord index-images.js");
        return;
    }
    
    console.log("📂 Lecture de l'index des images...");
    const rawData = fs.readFileSync(REAL_IMAGES_PATH, 'utf8');
    const imageMap = JSON.parse(rawData);
    const ids = Object.keys(imageMap);
    
    console.log(`📊 ${ids.length} images à traiter.`);

    // 2. Traitement par paquets (Batch) pour ne pas tuer le serveur
    const BATCH_SIZE = 100;
    let processed = 0;
    let created = 0;
    let updated = 0;

    // On boucle sur tous les ID trouvés sur le disque
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batchIds = ids.slice(i, i + BATCH_SIZE);
        const operations = [];

        for (const id of batchIds) {
            const filename = imageMap[id];
            
            // On prépare l'opération "Upsert" (Mise à jour OU Création)
            // num_enregistrement est votre identifiant unique
            operations.push(
                prisma.inpi_Design.upsert({
                    where: { 
                        num_enregistrement: id 
                    },
                    update: {
                        image_file: filename, // On répare le lien image si la fiche existe
                        statut: 'SYNC_OK'
                    },
                    create: {
                        num_enregistrement: id,
                        image_file: filename,
                        titre: `Dessin Modèle N°${id}`, // Titre par défaut
                        deposant: "INPI Archive",      // Déposant par défaut
                        date: new Date().toISOString(), // Date du jour (faute de mieux pour l'instant)
                        statut: 'NEW_IMPORT'
                    }
                })
            );
        }

        // Exécution du paquet
        try {
            await prisma.$transaction(operations);
            processed += batchIds.length;
            
            // Barre de progression simple
            if (processed % 1000 === 0) {
                console.log(`⏳ Progression : ${processed} / ${ids.length} (${Math.round(processed/ids.length*100)}%)`);
            }
        } catch (error) {
            console.error(`💥 Erreur sur le lot ${i}:`, error.message);
        }
    }

    console.log("✅ TERMINÉ !");
    console.log(`Base de données synchronisée avec ${ids.length} fichiers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
