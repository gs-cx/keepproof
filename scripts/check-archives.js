import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
    const client = new ftp.Client();
    const config = {
        host: process.env.INPI_DM_HOST,
        user: process.env.INPI_DM_USER,
        password: process.env.INPI_DM_PASS,
        secure: false, port: 21
    };

    try {
        console.log(`📡 Connexion au dossier secret /OPENDATA_FRDM_BACKLOG/Archives ...`);
        await client.access(config);
        
        // On liste le contenu
        const list = await client.list('/OPENDATA_FRDM_BACKLOG/Archives');
        
        // On cherche les ZIP d'images
        const imageZips = list.filter(f => f.name.includes('dmf_image'));
        
        console.log(`\n📦 RÉSULTAT : ${imageZips.length} fichiers ZIP d'images trouvés.`);
        
        if (imageZips.length > 0) {
            console.log("✅ BINGO ! Le trésor est ici.");
            // Affiche les premiers pour voir les années
            imageZips.slice(0, 5).forEach(f => console.log(`   - ${f.name} (${(f.size/1024/1024).toFixed(0)} Mo)`));
        } else {
            console.log("❌ Toujours vide...");
        }

    } catch (err) {
        console.error("❌ Erreur:", err);
    }
    client.close();
}

check();
