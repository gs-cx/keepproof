const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
process.env.DATABASE_URL = "postgresql://keep_web:keep1234@127.0.0.1:5433/keepproof_v2?schema=public";

const prisma = new PrismaClient();
const IMAGES_DIR = '/root/frontend/public/designs';

async function main() {
    console.log("🔗 DÉMARRAGE DE LA RÉCONCILIATION LOCALE...");

    // 1. Lister tous les fichiers images présents physiquement
    console.log("📂 Lecture du dossier des images (cela peut prendre quelques secondes)...");
    const files = fs.readdirSync(IMAGES_DIR);
    console.log(`📸 ${files.length} fichiers images trouvés sur le disque.`);

    // 2. Créer un index intelligent (ID -> Nom de fichier)
    // On nettoie les noms pour ne garder que l'ID unique (sans les zéros)
    const imageMap = new Map();
    
    files.forEach(file => {
        // On cherche l'ID dans le nom du fichier ex: dmf00000917240_001.jpg -> 917240
        const match = file.match(/dmf0*(\d+)_/);
        if (match && match[1]) {
            // On stocke : Clé="917240" => Valeur="/designs/dmf...jpg"
            imageMap.set(match[1], `/designs/${file}`);
        }
    });

    console.log(`🧠 Indexation terminée. Prêt à relier.`);

    // 3. Récupérer les dessins qui n'ont pas encore d'image dans la base
    const missingDesigns = await prisma.inpi_Design.findMany({
        where: { 
            OR: [
                { image_file: null },
                { image_file: "" }
            ]
        },
        select: { num_enregistrement: true }
    });

    console.log(`🔍 ${missingDesigns.length} dessins cherchent encore leur image dans la base.`);

    let linkedCount = 0;

    // 4. Faire le mariage !
    for (const design of missingDesigns) {
        const id = design.num_enregistrement;
        
        // Est-ce qu'on a cet ID dans notre stock d'images ?
        if (imageMap.has(id)) {
            const imagePath = imageMap.get(id);
            
            await prisma.inpi_Design.update({
                where: { num_enregistrement: id },
                data: { image_file: imagePath }
            });

            linkedCount++;
            if (linkedCount % 100 === 0) process.stdout.write("🔗");
        }
    }

    console.log(`\n\n🎉 TERMINÉ !`);
    console.log(`✅ ${linkedCount} dessins ont retrouvé leur image existante.`);
    console.log(`❌ Il reste ${missingDesigns.length - linkedCount} dessins vraiment manquants (à télécharger plus tard).`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
