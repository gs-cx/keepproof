const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  console.log("🕵️‍♂️ CONTRÔLE FINAL SUR 2016...");

  // On prend 5 fiches au hasard de 2016 qui ont une image
  const designs = await prisma.inpi_Design.findMany({
    where: { 
        date: { startsWith: '2016' },
        image_file: { not: null }
    },
    take: 5
  });

  if (designs.length === 0) {
      console.log("❌ Aucune fiche trouvée en base pour 2016 avec une image liée.");
  } else {
      console.log("✅ Fiches trouvées en base. Vérification disque :");
      
      designs.forEach(d => {
          const filename = d.image_file.replace("/designs/", "");
          const fullPath = "/var/www/designs_storage/" + filename;
          
          if (fs.existsSync(fullPath)) {
              console.log(`   ✅ OK : ${filename} est bien sur le disque.`);
          } else {
              console.log(`   ❌ ERREUR : ${filename} manque physiquement.`);
          }
      });
  }
}

main();
