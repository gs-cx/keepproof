import fs from 'fs';
import csv from 'csv-parser';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'keepproof',
  host: 'localhost',
  database: process.env.DB_NAME || 'keepproof',
  password: process.env.DB_PASSWORD || 'password_securise',
  port: 5433,
});

const CSV_FILE_PATH = 'marques.csv'; 
const BATCH_SIZE = 1000; 

async function importCsv() {
  const client = await pool.connect();
  console.log("🔌 Connecté à la base de données...");
  
  const results: any[] = [];
  let totalCount = 0;

  console.log(`📂 Lecture du fichier INPI : ${CSV_FILE_PATH}`);

  const stream = fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv({ 
        separator: ';',      
        skipLines: 2,        // <--- CORRECTION : On saute Ligne 1 (Infos) ET Ligne 2 (Titres)
        headers: [           
            'num_bopi', 'date_bopi', 'section', 'num_marque', 'date_depot', 
            'deposant', 'classes', 'nom_marque', 'info_comp', 
            'nature', 'date_inscription', 'concours'
        ] 
    })) 
    .on('data', (data) => {
      // NETTOYAGE
      let cleanNum = data.num_marque ? data.num_marque.replace(/'/g, '').trim() : '';
      let cleanClasses = data.classes ? data.classes.replace(/'/g, '').trim() : '';
      let cleanNom = data.nom_marque ? data.nom_marque.trim() : 'Nom Inconnu';
      
      // Gestion des logos (URL image)
      if (cleanNom.startsWith('http')) {
         cleanNom = `[LOGO IMAGE] ${data.deposant ? '- ' + data.deposant : ''}`;
      }

      // Formatage date (JJ/MM/AAAA -> AAAA-MM-JJ)
      let cleanDate = null;
      if (data.date_depot) {
          const parts = data.date_depot.split('/');
          if (parts.length === 3) {
              cleanDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
      }

      if (cleanNum && cleanNom) {
        results.push({
            num_depot: cleanNum,
            nom_marque: cleanNom,
            deposant: data.deposant || 'Inconnu',
            classes: cleanClasses,
            statut: 'Déposée', 
            date_depot: cleanDate
        });
      }

      if (results.length >= BATCH_SIZE) {
        stream.pause();
        insertBatch(client, [...results]).then(() => {
          totalCount += results.length;
          process.stdout.write(`\r🚀 Importation en cours... ${totalCount} marques traitées`);
          results.length = 0;
          stream.resume();
        });
      }
    })
    .on('end', async () => {
      if (results.length > 0) {
        await insertBatch(client, results);
        totalCount += results.length;
      }
      console.log(`\n\n✅ IMPORT INPI TERMINÉ ! Total : ${totalCount} marques ajoutées.`);
      client.release();
      await pool.end();
    });
}

async function insertBatch(client: any, batch: any[]) {
  try {
    const values = batch.map((row, index) => {
      const offset = index * 6;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, NOW())`;
    }).join(',');

    const flatValues = batch.flatMap(row => [
      row.num_depot, 
      row.nom_marque, 
      row.date_depot || new Date(), 
      row.statut, 
      row.deposant, 
      row.classes
    ]);

    const query = `
      INSERT INTO marques (num_depot, nom_marque, date_depot, statut, deposant, classes, last_update)
      VALUES ${values}
      ON CONFLICT (nom_marque) DO NOTHING;
    `;

    await client.query(query, flatValues);

  } catch (err) {
    console.error("\n❌ Erreur sur un batch :", err);
  }
}

importCsv();
