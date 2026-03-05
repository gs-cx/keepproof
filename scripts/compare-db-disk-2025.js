const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  console.log("💔 DIAGNOSTIC DE RUPTURE (2025)...");

  // 1. On prend 5 fiches de 2025 au hasard
  const designs = await prisma.inpi_Design.findMany({
    where: { date: { startsWith: '2025' } },
    take: 5
  });

  if (designs.length === 0) {
      console.log("❌ Aucune fiche en base pour 2025.");
      return;
  }

  console.log("\n--- CE QUE LA BASE VEUT vs CE QU'ON A ---");
  for (const d of designs) {
      const dbName = d.image_file ? d.image_file.replace("/designs/", "") : "PAS D'IMAGE";
      const fileExists = fs.existsSync("/var/www/designs_storage/" + dbName);
      
      console.log(`🆔 ID Enregistrement: ${d.num_enregistrement}`);
      console.log(`   ❤️ Base veut : "${dbName}"`);
      console.log(`   💿 Disque dit : ${fileExists ? "✅ PRÉSENT" : "❌ ABSENT"}`);
      console.log("-----------------------------------");
  }
}

main();
