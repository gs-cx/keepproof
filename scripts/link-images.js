const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

// Connexion forcée à la bonne base (Port 5433)
process.env.DATABASE_URL = "postgresql://keep_web:keep1234@127.0.0.1:5433/keepproof_v2?schema=public";

const prisma = new PrismaClient();
const BACKLOG_DIR = '/root/frontend/inpi_designs_backlog';
const IMAGES_DIR = '/root/frontend/public/designs';

function getAllZips(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllZips(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.zip') && !file.startsWith('dmf_image')) { 
          // On ne veut pas scanner le gros zip d'images, juste les petits zips de fiches
          arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

async function main() {
  console.log("🚀 DÉMARRAGE DE LA LIAISON IMAGES <-> BASE DE DONNÉES...");

  const zips = getAllZips(BACKLOG_DIR);
  console.log(`📦 ${zips.length} fiches (XML) à analyser.`);

  const parser = new xml2js.Parser();
  let updatedCount = 0;
  let missingCount = 0;

  for (const zipPath of zips) {
    try {
      const zip = new AdmZip(zipPath);
      const zipEntries = zip.getEntries();
      const xmlEntry = zipEntries.find(entry => entry.entryName.endsWith('.xml'));
      
      if (!xmlEntry) continue;

      const xmlData = xmlEntry.getData().toString('utf8');
      
      // 1. Récupérer le numéro d'enregistrement (C'est la clé de liaison)
      // Le nom du fichier ZIP est souvent le numéro : FR_BCKST86...
      const numEnregistrement = path.basename(zipPath, '.zip');

      // 2. Trouver le nom du fichier image dans le XML
      // Balise souvent utilisée : <ViewFilename>
      const result = await parser.parseStringPromise(xmlData);
      const jsonStr = JSON.stringify(result);
      
      // On cherche le nom de fichier cité dans le XML
      // Ex: "dmf0000000082990_001_001"
      const match = jsonStr.match(/"ViewFilename":\["(.*?)"\]/);
      
      if (match && match[1]) {
          const rawImageName = match[1]; // ex: dmf0000000082990_001
          
          // On cherche si ce fichier existe en .jpg dans le dossier public
          // On teste plusieurs variantes (avec ou sans extension, majuscule/minuscule)
          let foundPath = null;
          const candidates = [
              `${rawImageName}.jpg`,
              `${rawImageName}.JPG`,
              `${rawImageName}_001.jpg`, // Parfois le XML oublie le suffixe
              rawImageName // Si l'extension est déjà dans le XML
          ];

          for (const cand of candidates) {
              if (fs.existsSync(path.join(IMAGES_DIR, cand))) {
                  foundPath = cand;
                  break;
              }
          }

          if (foundPath) {
              // BINGO ! On met à jour la base de données
              await prisma.inpi_Design.update({
                  where: { num_enregistrement: numEnregistrement },
                  data: { 
                      image_file: `/designs/${foundPath}`
                  }
              });
              process.stdout.write(`✅`); // Juste un petit check visuel
              updatedCount++;
          } else {
              process.stdout.write(`.`); // Point = XML lu mais image pas trouvée
              missingCount++;
          }
      }

    } catch (err) {
      // On ignore les erreurs mineures pour ne pas bloquer le script
    }
  }

  console.log(`\n\n🎉 TERMINÉ !`);
  console.log(`✅ ${updatedCount} dessins ont maintenant leur image.`);
  console.log(`❌ ${missingCount} dessins n'ont pas trouvé leur image (peut-être dans un autre pack).`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
