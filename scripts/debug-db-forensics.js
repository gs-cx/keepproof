const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });
const prisma = new PrismaClient();

async function main() {
    console.log("🕵️‍♂️ ANALYSE LÉGALE DE LA BASE DE DONNÉES...");

    try {
        // 1. Vérifier la quantité
        const count = await prisma.inpi_Design.count();
        console.log(`\n📊 Nombre de fiches : ${count.toLocaleString('fr-FR')}`);

        // 2. Chercher les extrêmes temporels (en supposant que le champ s'appelle 'date')
        // On récupère tout et on trie en JS car le tri SQL sur String peut être trompeur si le format varie
        const someFiches = await prisma.inpi_Design.findMany({
            take: 10,
            orderBy: { date: 'asc' } // On espère que le format YYYY-MM-DD est respecté
        });
        
        if (someFiches.length > 0) {
            console.log(`📅 Date la plus ANCIENNE trouvée : ${someFiches[0].date}`);
            console.log(`📅 Date la plus RÉCENTE trouvée : ${someFiches[someFiches.length - 1].date}`);
        }

        // 3. Recherche du Témoin N°1 (Le dossier de l'an 2000)
        console.log("\n🔎 Recherche du dossier '000001'...");
        const temoin = await prisma.inpi_Design.findFirst({
            where: { num_enregistrement: "000001" }
        });

        if (temoin) {
            console.log("✅ LE DOSSIER 000001 EXISTE !");
            console.log("   Titre :", temoin.description);
            console.log("   Image :", temoin.image_file);
        } else {
            console.log("❌ Le dossier 000001 est introuvable.");
        }

        // 4. Afficher un échantillon aléatoire pour voir le format
        console.log("\n🎲 Échantillon de 3 fiches au hasard :");
        const randomDocs = await prisma.inpi_Design.findMany({ take: 3 });
        console.log(randomDocs);

    } catch (e) { console.log("❌ Erreur : " + e.message); }
}

main();
