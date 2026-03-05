import { Client } from 'pg';

// Configuration de connexion
const client = new Client({
  user: 'keep_admin',
  host: '127.0.0.1',
  database: 'keepproof_db',
  password: 'Creaguard2026',
  port: 5433,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS inpi_marques (
    id SERIAL PRIMARY KEY,
    num_depot VARCHAR(50) UNIQUE NOT NULL,
    nom_marque VARCHAR(255) NOT NULL,
    date_depot DATE,
    statut VARCHAR(50),
    deposant TEXT,
    classes VARCHAR(100),
    last_update TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_nom_marque ON inpi_marques (nom_marque);
`;

async function setupDB() {
  try {
    await client.connect();
    console.log("🔌 Connecté à PostgreSQL...");
    
    await client.query(createTableQuery);
    console.log("✅ Table 'inpi_marques' créée avec succès !");
    
    // Test d'écriture
    const testInsert = `
      INSERT INTO inpi_marques (num_depot, nom_marque, date_depot, statut, deposant)
      VALUES ('TEST-001', 'KEEPPROOF PROTECT', '2026-01-13', 'Déposée', 'Moi')
      ON CONFLICT (num_depot) DO NOTHING;
    `;
    await client.query(testInsert);
    console.log("Test d'écriture validé.");

  } catch (err) {
    console.error("❌ Erreur Base de données :", err);
  } finally {
    await client.end();
  }
}

setupDB();
