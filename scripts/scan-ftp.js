const ftp = require("basic-ftp");
const dotenv = require('dotenv');

// On charge le fichier .env
dotenv.config({ path: '/root/frontend/.env' });

async function scanFTP() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 

    const host = process.env.INPI_DM_HOST;
    const user = process.env.INPI_DM_USER;
    const password = process.env.INPI_DM_PASS;

    if (!host || !user || !password) {
        console.error("❌ ERREUR : Les identifiants INPI_DM_... sont introuvables dans le fichier .env !");
        return;
    }

    try {
        console.log(`🔌 Connexion au FTP INPI (${host})...`);
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: false
        });

        console.log("✅ Connecté ! Recherche du dossier des images...");
        const rootList = await client.list("/");
        
        for (const item of rootList) {
            console.log(`📁 [${item.isDirectory ? 'DOSSIER' : 'FICHIER'}] ${item.name} \t(Taille: ${item.size})`);
            
            // Si on voit un dossier "Images" ou "Dessins", on fouille dedans
            if (item.isDirectory) {
                console.log(`   ↳ 🔍 Exploration de /${item.name}...`);
                try {
                    const subList = await client.list("/" + item.name);
                    
                    // On affiche quelques fichiers pour voir si ça ressemble à des images (jpg, zip, tif)
                    subList.slice(0, 10).forEach(sub => {
                        console.log(`      - ${sub.name} (${sub.size})`);
                    });
                    if (subList.length > 10) console.log(`      ... (et ${subList.length - 10} autres fichiers)`);
                } catch (e) {
                    console.log(`      ⚠️ Impossible d'ouvrir ce sous-dossier.`);
                }
            }
        }

    } catch(err) {
        console.log("❌ Erreur de connexion :", err);
    }
    client.close();
}

scanFTP();
