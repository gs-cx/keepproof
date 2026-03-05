import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement depuis le dossier parent
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 1. Configuration de la connexion (Port 5433 impératif)
const pool = new Pool({
  user: process.env.DB_USER || 'keepproof',
  host: 'localhost',
  database: process.env.DB_NAME || 'keepproof',
  password: process.env.DB_PASSWORD || 'password_securise', // Il utilisera celui du .env s'il existe
  port: 5433, // Le port corrigé
});

// 2. Données Réelles (Top Marques Françaises & Tech)
const REAL_DATA = [
  { marque: "LOUIS VUITTON", deposant: "LOUIS VUITTON MALLETIER", classes: "18, 25, 3" },
  { marque: "L'OREAL", deposant: "L'OREAL (SOCIETE ANONYME)", classes: "3, 44" },
  { marque: "RENAULT", deposant: "RENAULT S.A.S.", classes: "12, 37" },
  { marque: "PEUGEOT", deposant: "AUTOMOBILES PEUGEOT", classes: "12, 37" },
  { marque: "CHANEL", deposant: "CHANEL", classes: "3, 14, 18, 25" },
  { marque: "HERMES", deposant: "HERMES INTERNATIONAL", classes: "3, 14, 18" },
  { marque: "TOTALENERGIES", deposant: "TOTALENERGIES SE", classes: "1, 4, 37, 40" },
  { marque: "ORANGE", deposant: "ORANGE BRAND SERVICES LIMITED", classes: "9, 38, 42" },
  { marque: "CARREFOUR", deposant: "CARREFOUR SA", classes: "29, 30, 31, 32, 35" },
  { marque: "DECATHLON", deposant: "DECATHLON", classes: "22, 25, 28" },
  { marque: "MICHELIN", deposant: "COMPAGNIE GENERALE DES ETABLISSEMENTS MICHELIN", classes: "12" },
  { marque: "DANONE", deposant: "COMPAGNIE GERVAIS DANONE", classes: "29, 30, 32" },
  { marque: "AIRBUS", deposant: "AIRBUS SAS", classes: "12, 37, 39, 42" },
  { marque: "SANOFI", deposant: "SANOFI", classes: "5, 10, 42, 44" },
  { marque: "BNP PARIBAS", deposant: "BNP PARIBAS", classes: "36" },
  { marque: "SOCIETE GENERALE", deposant: "SOCIETE GENERALE", classes: "36" },
  { marque: "AXA", deposant: "AXA", classes: "36" },
  { marque: "CAPGEMINI", deposant: "CAPGEMINI", classes: "9, 35, 42" },
  { marque: "DASSAULT SYSTEMES", deposant: "DASSAULT SYSTEMES", classes: "9, 42" },
  { marque: "UBISOFT", deposant: "UBISOFT ENTERTAINMENT", classes: "9, 41" },
  { marque: "QONTO", deposant: "OLINDA", classes: "9, 36" },
  { marque: "DOCTOLIB", deposant: "DOCTOLIB", classes: "9, 35, 42" },
  { marque: "BLABLACAR", deposant: "COMUTO", classes: "9, 39, 42" },
  { marque: "BACK MARKET", deposant: "JUNG S.A.S.", classes: "35" },
  { marque: "LEBONCOIN", deposant: "LBC FRANCE", classes: "35, 38" },
  { marque: "VINTED", deposant: "VINTED, UAB", classes: "9, 35" },
  { marque: "AMAZON", deposant: "AMAZON TECHNOLOGIES, INC.", classes: "9, 35, 38, 39, 42" },
  { marque: "GOOGLE", deposant: "GOOGLE LLC", classes: "9, 35, 38, 42" },
  { marque: "MICROSOFT", deposant: "MICROSOFT CORPORATION", classes: "9, 35, 38, 41, 42" },
  { marque: "APPLE", deposant: "APPLE INC.", classes: "9, 35, 38, 42" },
  { marque: "META", deposant: "META PLATFORMS, INC.", classes: "9, 35, 38, 41, 42, 45" }
];

async function seed() {
  const client = await pool.connect();
  console.log("🔌 Connecté à la base de données (Port 5433)...");

  try {
    console.log(`📦 Préparation de l'import de ${REAL_DATA.length} marques...`);

    let addedCount = 0;

    for (const item of REAL_DATA) {
      // Générer un numéro de dépôt aléatoire réaliste (7 ou 8 chiffres)
      const numDepot = Math.floor(4000000 + Math.random() * 900000).toString();
      
      const query = `
        INSERT INTO marques (num_depot, nom_marque, date_depot, statut, deposant, classes, last_update)
        VALUES ($1, $2, NOW(), 'Enregistrée', $3, $4, NOW())
        ON CONFLICT (nom_marque) DO NOTHING
        RETURNING *;
      `;
      
      const res = await client.query(query, [numDepot, item.marque, item.deposant, item.classes]);
      
      if (res.rows.length > 0) {
        console.log(`✅ Ajouté : ${item.marque}`);
        addedCount++;
      } else {
        console.log(`⚠️ Déjà existant : ${item.marque}`);
      }
    }

    console.log(`\n🎉 IMPORT TERMINÉ ! ${addedCount} nouvelles marques ajoutées.`);

  } catch (err) {
    console.error("❌ Erreur critique :", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
