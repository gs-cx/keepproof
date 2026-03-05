const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

const STORAGE_DIR = "/var/www/designs_storage/";

async function main() {
  console.log("🕵️‍♂️ DIAGNOSTIC DE PRÉCISION...");

  // 1. On prend une fiche de 2024 qui a un lien image mais qui est marquée 'Manquante'
  const design = await prisma.inpi_Design.findFirst({
    where: { 
        date: { startsWith: '2024' },
        image_file: { not: null }
    }
  });

  if (!design) {
      console.log("❌ Aucune fiche avec image trouvée pour 2024.");
      return;
  }

  const dbFilename = design.image_file.replace("/designs/", "");
  const fullPath = path.join(STORAGE_DIR, dbFilename);
  
  console.log("\n📋 --- CAS D'ÉTUDE (Fiche ID: " + design.id + ") ---");
  console.log(`1️⃣  La Base de données cherche : "${dbFilename}"`);
  console.log(`    (Chemin complet : ${fullPath})`);

  // 2. Test d'existence direct
  if (fs.existsSync(fullPath)) {
      console.log("✅ LE FICHIER EXISTE POURTANT !");
      console.log("   👉 Problème de permissions ? Ou de cache ?");
  } else {
      console.log("❌ Le fichier est introuvable à cet emplacement précis.");
      
      // 3. Recherche intelligente (Fuzzy Search)
      console.log("\n🔎 Recherche de ce fichier ailleurs ou sous un autre nom...");
      
      // On extrait le numéro (ex: "000727485" -> "727485")
      const coreNumber = dbFilename.replace(/^0+/, "").replace(".jpg", "");
      console.log(`   Je cherche tout fichier contenant le numéro "${coreNumber}"...`);

      try {
          // On liste TOUT le dossier (peut être long)
          const allFiles = fs.readdirSync(STORAGE_DIR, { recursive: true });
          
          const matches = allFiles.filter(f => f.includes(coreNumber));
          
          if (matches.length > 0) {
              console.log(`\n🎉 TROUVÉ ! Voici où il se cache :`);
              matches.forEach(m => {
                  console.log(`   👉 ${m}`);
                  if (m.includes("/")) console.log("      ⚠️ IL EST DANS UN SOUS-DOSSIER !");
                  if (!m.startsWith(dbFilename)) console.log("      ⚠️ LE NOM EST DIFFÉRENT !");
              });
          } else {
              console.log("\n❌ Introuvable. Ce numéro d'image n'existe absolument pas sur le disque.");
              console.log("   Hypothèse : L'image n'a jamais été téléchargée (XML présent, mais ZIP image manquant).");
          }

      } catch (e) {
          console.log("Erreur de scan : " + e.message);
      }
  }
}

main();
