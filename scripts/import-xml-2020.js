const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

process.env.DATABASE_URL = "postgresql://keep_web:keep1234@127.0.0.1:5433/keepproof_v2?schema=public";
const prisma = new PrismaClient();

const DATA_DIR = '/root/frontend/inpi_designs_backlog';
const IMAGES_DIR = '/root/frontend/public/designs';

async function main() {
  console.log("🚀 IMPORTATION V2 (MODE INTELLIGENT)...");

  // On liste les XML
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.xml'));
  console.log(`📄 ${files.length} fiches XML en attente.`);

  const parser = new xml2js.Parser();
  let successCount = 0;
  let imageCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(DATA_DIR, file);
      const xmlData = fs.readFileSync(filePath, 'utf8');
      
      const result = await parser.parseStringPromise(xmlData);
      const jsonStr = JSON.stringify(result);

      // --- EXTRACTION ---
      const titre = (jsonStr.match(/"DesignTitle":\["(.*?)"\]/) || [])[1] || "Sans titre";
      const deposant = (jsonStr.match(/"PartyName":\["(.*?)"\]/) || [])[1] || "Anonyme";
      const date = (jsonStr.match(/"RegistrationDate":\["(.*?)"\]/) || [])[1] || "2000-01-01";
      
      let num = file.replace('.xml', ''); 
      const idMatch = jsonStr.match(/"DesignIdentifier":\["(.*?)"\]/);
      if (idMatch && idMatch[1]) num = idMatch[1];

      // --- RECHERCHE INTELLIGENTE DE L'IMAGE ---
      let imagePath = null;
      const imgMatch = jsonStr.match(/"ViewFilename":\["(.*?)"\]/);
      
      if (imgMatch && imgMatch[1]) {
          const rawName = imgMatch[1]; // ex: dmf..._001
          
          // C'est ici qu'on ajoute la "traduction"
          // On teste le nom brut, le nom + .jpg, et le nom + _001.jpg
          const candidates = [
              `${rawName}_001.jpg`, // Cas le plus probable vu vos fichiers
              `${rawName}.jpg`,
              `${rawName}.JPG`,
              `${rawName}_001.JPG`
          ];

          for (const cand of candidates) {
              if (fs.existsSync(path.join(IMAGES_DIR, cand))) {
                  imagePath = `/designs/${cand}`;
                  break; 
              }
          }
      }

      // --- INSERTION ---
      await prisma.inpi_Design.upsert({
          where: { num_enregistrement: num },
          update: { image_file: imagePath }, // On met à jour si image trouvée
          create: {
              num_enregistrement: num,
              titre: titre.substring(0, 200),
              deposant: deposant.substring(0, 200),
              date: date,
              image_file: imagePath,
              statut: "Imported_XML_V2"
          }
      });

      if (imagePath) {
          process.stdout.write("📸"); 
          imageCount++;
      } else {
          // Si on n'a pas trouvé, on met juste un point.
          // C'est normal d'avoir des points si les XML ne correspondent pas tous aux images téléchargées
          process.stdout.write("."); 
      }
      successCount++;

    } catch (err) {
      // On continue
    }
  }

  console.log(`\n\n🎉 TERMINÉ !`);
  console.log(`✅ ${successCount} fiches traitées.`);
  console.log(`🖼️ ${imageCount} images trouvées et liées !`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
