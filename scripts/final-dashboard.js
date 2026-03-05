const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const dotenv = require('dotenv');

// ✅ ON CHARGE LA MÊME CONFIG QUE LES AUTRES SCRIPTS
dotenv.config({ path: '/root/frontend/.env' });

const prisma = new PrismaClient();

async function main() {
  console.log("🏆 VÉRIFICATION FINALE (Avec la bonne connexion base)...");
  
  // On récupère toutes les fiches
  const allDesigns = await prisma.inpi_Design.findMany({
    select: { date: true, image_file: true }
  });
  
  const stats = {}; 

  for (const d of allDesigns) {
      let year = "Inconnu";
      // Gestion robuste de la date (String ou Date Object)
      if (d.date) {
          if (typeof d.date === 'string' && d.date.length >= 4) year = d.date.substring(0, 4);
          else if (d.date instanceof Date) year = d.date.getFullYear().toString();
      }

      if (!stats[year]) stats[year] = { total: 0, present: 0 };
      stats[year].total++;

      if (d.image_file) {
          // Nettoyage du chemin pour vérifier sur le disque
          const filename = d.image_file.replace("/designs/", "");
          
          // Vérification physique
          if (fs.existsSync("/var/www/designs_storage/" + filename)) {
              stats[year].present++;
          }
      }
  }

  console.log("\n📊 --- TABLEAU DE BORD FINAL ---");
  const years = Object.keys(stats).sort();
  for (const y of years) {
      if (y < "2015") continue; 
      const s = stats[y];
      const pct = s.total > 0 ? ((s.present / s.total) * 100).toFixed(0) : 0;
      
      let icon = "❌";
      if (pct > 1) icon = "⚠️";
      if (pct > 90) icon = "✅"; 
      
      console.log(`${y}  | ${icon} ${pct}%  (${s.present}/${s.total})`);
  }
  console.log("\n");
}
main();
