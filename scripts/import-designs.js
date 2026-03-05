import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';

// Charge les variables du fichier .env
dotenv.config();

const FTP_CONFIG = {
  host: process.env.INPI_DM_HOST || "opendata-ftps.inpi.fr",
  user: process.env.INPI_DM_USER,
  password: process.env.INPI_DM_PASS,
  secure: true, // FTPS explicite
  port: 21      // Port standard FTP
};

async function main() {
  const client = new ftp.Client();
  // client.ftp.verbose = true; // Décommentez si vous voulez voir tout le dialogue technique

  try {
    console.log("🔌 Tentative de connexion au FTP INPI...");
    console.log(`   Host: ${FTP_CONFIG.host}`);
    console.log(`   User: ${FTP_CONFIG.user}`);

    // On désactive la vérification stricte du certificat SSL (souvent nécessaire avec les FTPs admin)
    client.ftp.ipFamily = 4;
    
    await client.access({
        ...FTP_CONFIG,
        secureOptions: { rejectUnauthorized: false } 
    });

    console.log("✅ Connecté avec succès !");
    console.log("📂 Listage de la racine...");
    
    const list = await client.list();
    
    console.log("\n----- CONTENU DU SERVEUR -----");
    if (list.length === 0) {
        console.log("(Le dossier est vide ou illisible)");
    } else {
        list.forEach(f => {
            console.log(`- [${f.type === 1 ? 'DOSSIER' : 'FICHIER'}] ${f.name} \t (${(f.size / 1024).toFixed(1)} KB)`);
        });
    }
    console.log("------------------------------\n");

  } catch (err) {
    console.error("❌ ECHEC DE CONNEXION :");
    console.error(err);
  } finally {
    client.close();
  }
}

main();
