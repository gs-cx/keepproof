const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

// On force la connexion à la BONNE base de données (Port 5433)
process.env.DATABASE_URL = "postgresql://keep_web:keep1234@127.0.0.1:5433/keepproof_v2?schema=public";

const prisma = new PrismaClient();
const LOCAL_DIR = '/root/frontend/inpi_designs_backlog';
const PUBLIC_IMG_DIR = '/root/frontend/public/designs';

// Création du dossier public s'il n'existe pas
if (!fs.existsSync(PUBLIC_IMG_DIR)) {
    console.log("📁 Création du dossier pour les images...");
    fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
}

function getAllZips(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllZips(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.zip')) arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

async function main() {
  console.log("🚀 Démarrage de l'importation V2 (AVEC EXTRACTION D'IMAGES)...");

  const zips = getAllZips(LOCAL_DIR);
  console.log(`📦 ${zips.length} archives ZIP trouvées.`);

  const parser = new xml2js.Parser();
  let successCount = 0;

  for (const zipPath of zips) {
    try {
      const zip = new AdmZip(zipPath);
      const zipEntries = zip.getEntries();
      
      // 1. Trouver le XML
      const xmlEntry = zipEntries.find(entry => entry.entryName.endsWith('.xml'));
      if (!xmlEntry) continue;

      const xmlData = xmlEntry.getData().toString('utf8');
      const result = await parser.parseStringPromise(xmlData);

      // 2. Extraction des données
      let record = {};
      const jsonStr = JSON.stringify(result);
      
      record.titre = (jsonStr.match(/"DesignTitle":\["(.*?)"\]/) || [])[1] || "Sans titre";
      record.deposant = (jsonStr.match(/"PartyName":\["(.*?)"\]/) || [])[1] || "Anonyme";
      record.date = (jsonStr.match(/"RegistrationDate":\["(.*?)"\]/) || [])[1] || "2000-01-01";
      record.num = path.basename(zipPath, '.zip'); 
      
      // 3. TRAITEMENT DE L'IMAGE (La partie qui manquait) 
      // On cherche n'importe quel JPG ou PNG
      const imageEntry = zipEntries.find(e => e.entryName.match(/\.(jpg|png|jpeg)$/i) && !e.isDirectory);
      
      if (imageEntry) {
          // On définit un nom propre pour l'image (ID + extension) pour éviter les doublons
          const extension = path.extname(imageEntry.entryName);
          const newFileName = `${record.num}${extension}`;
          const targetPath = path.join(PUBLIC_IMG_DIR, newFileName);

          // On extrait physiquement le fichier vers le dossier public
          // false = ne pas recréer les dossiers du zip, true = écraser si existe
          zip.extractEntryTo(imageEntry, PUBLIC_IMG_DIR, false, true);
          
          // Renommage pour que ce soit propre (optionnel mais conseillé)
          const extractedPath = path.join(PUBLIC_IMG_DIR, imageEntry.entryName);
          if (fs.existsSync(extractedPath)) {
              fs.renameSync(extractedPath, targetPath);
              // On enregistre le chemin WEB (pas le chemin disque)
              record.image_file = `/designs/${newFileName}`;
          }
      } else {
          record.image_file = null;
      }

      // 4. INSERTION EN BASE
      if (record.num) {
        process.stdout.write(`Insertion ${record.num} avec image: ${record.image_file ? 'OUI' : 'NON'}... `);
        
        await prisma.inpi_Design.upsert({
          where: { num_enregistrement: record.num },
          update: {
              image_file: record.image_file // Mise à jour si existe déjà
          },
          create: {
            num_enregistrement: record.num,
            titre: record.titre.substring(0, 200),
            deposant: record.deposant.substring(0, 200),
            date: record.date,
            image_file: record.image_file,
            statut: "Imported"
          }
        });
        console.log("✅");
        successCount++;
      }

    } catch (err) {
      console.error(`\n⚠️ Erreur sur ${zipPath} : ${err.message}`);
      // On continue au fichier suivant au lieu de tout arrêter
      continue;
    }
  }
  console.log(`\n🎉 TERMINÉ ! ${successCount} dessins importés/mis à jour.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
