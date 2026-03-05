const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // On prend un fichier réel vu sur votre disque : 001071268.jpg
  // On enlève les zéros du début pour voir si ça matche mieux
  const searchFull = "001071268";
  const searchShort = "1071268"; 

  console.log(`🕵️‍♂️ Recherche du mystérieux fichier ${searchFull} dans la base...`);

  // 1. Essai sur le Numéro d'Enregistrement
  const match1 = await prisma.inpi_Design.findFirst({
    where: { num_enregistrement: { contains: searchShort } }
  });
  if (match1) console.log(`✅ TROUVÉ dans num_enregistrement ! (ID: ${match1.id})`);
  else console.log("❌ Pas trouvé dans num_enregistrement.");

  // 2. Essai sur le Numéro National (souvent la clé cachée)
  // Note: Il faut vérifier si cette colonne existe dans votre schema Prisma
  // Si ce code plante, c'est qu'on doit chercher ailleurs, mais essayons.
  try {
      const match2 = await prisma.inpi_Design.findFirst({
        where: { num_national: { contains: searchShort } }
      });
      if (match2) console.log(`✅ TROUVÉ dans num_national ! (ID: ${match2.id})`);
      else console.log("❌ Pas trouvé dans num_national.");
  } catch (e) {
      console.log("⚠️ La colonne num_national n'est peut-être pas accessible ou nommée différemment.");
  }

  // 3. Essai sur le Titre ou la Description (peu probable mais sait-on jamais)
  const match3 = await prisma.inpi_Design.findFirst({
    where: { description: { contains: searchShort } }
  });
  if (match3) console.log(`✅ TROUVÉ dans description !`);

}

main();
