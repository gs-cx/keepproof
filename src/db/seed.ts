import { Client } from 'pg';

// Configuration avec le bon port 5433
const client = new Client({
  user: 'keep_admin',
  host: '127.0.0.1',
  database: 'keepproof_db',
  password: 'Keepproof2026',
  port: 5433,
});

const demoData = [
  { num: '4589201', nom: 'TESLA MOTORS', classes: '12, 37', deposant: 'TESLA INC.' },
  { num: '3928190', nom: 'COCA-COLA ZERO', classes: '32', deposant: 'THE COCA-COLA COMPANY' },
  { num: '1829304', nom: 'L\'OREAL PARIS', classes: '3, 44', deposant: 'L\'OREAL' },
  { num: '9928374', nom: 'KEEPPROOF PROTECT', classes: '42, 45', deposant: 'VOUS' },
  { num: '1234567', nom: 'APPLE IPHONE', classes: '9, 38', deposant: 'APPLE INC.' },
  { num: '8837291', nom: 'LOUIS VUITTON', classes: '18, 25', deposant: 'LVMH' },
  { num: '7728394', nom: 'PEUGEOT SPORT', classes: '12', deposant: 'STELLANTIS' },
  { num: '1122334', nom: 'TOTAL ENERGIES', classes: '4, 37', deposant: 'TOTAL SA' },
  { num: '5566778', nom: 'DECATHLON', classes: '25, 28', deposant: 'DECATHLON SA' },
  { num: '9988776', nom: 'DANONE ACTIMEL', classes: '29, 30', deposant: 'DANONE' }
];

async function seedDB() {
  try {
    await client.connect();
    console.log("🔌 Connecté au port 5433...");

    // On vide la table pour éviter les doublons lors des tests
    await client.query("TRUNCATE TABLE inpi_marques RESTART IDENTITY;");
    console.log("🗑️  Table nettoyée.");

    // Insertion des données précises
    console.log("🌱  Injection des données...");
    for (const m of demoData) {
      const query = `
        INSERT INTO inpi_marques (num_depot, nom_marque, date_depot, statut, deposant, classes)
        VALUES ($1, $2, NOW(), 'Enregistrée', $3, $4)
      `;
      await client.query(query, [m.num, m.nom, m.deposant, m.classes]);
    }

    // Insertion des données génériques (Correction ici : on ne passe que 2 valeurs)
    for (let i = 1; i <= 40; i++) {
        await client.query(`
            INSERT INTO inpi_marques (num_depot, nom_marque, date_depot, statut, deposant, classes)
            VALUES ($1, $2, NOW(), 'Enregistrée', 'Société Anonyme', '35, 42')
        `, [`GEN-${i + 1000}`, `MARQUE GENÉRIQUE ${i}`]); 
    }

    console.log("✅ 50 Marques insérées avec succès !");

  } catch (err) {
    console.error("❌ Erreur :", err);
  } finally {
    await client.end();
  }
}

seedDB();
