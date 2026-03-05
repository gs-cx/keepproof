const ftp = require("basic-ftp");
const dotenv = require('dotenv');

// On force le chargement du bon fichier .env
dotenv.config({ path: '/root/frontend/.env' });

async function explore() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; // Décommentez pour voir le dialogue technique

    try {
        console.log(`🔌 Connexion au FTP : ${process.env.INPI_DM_HOST} ...`);
        
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false // On tente en non-sécurisé standard
        });

        console.log("✅ Connexion réussie !");
        console.log("\n📂 --- LISTING DE LA RACINE (/) ---");
        
        const rootList = await client.list("/");
        
        if (rootList.length === 0) {
            console.log("❌ Le dossier racine semble vide.");
        }

        for (const item of rootList) {
            console.log(`- [${item.isDirectory ? 'DOSSIER' : 'FICHIER'}] ${item.name} \t(${item.size} octets)`);
            
            // Si c'est un dossier intéressant, on regarde dedans
            if (item.isDirectory) {
                console.log(`    🔎 Inspection de /${item.name} ...`);
                try {
                    const subList = await client.list("/" + item.name);
                    const zips = subList.filter(f => f.name.endsWith('.zip'));
                    const images = subList.filter(f => f.name.endsWith('.jpg') || f.name.endsWith('.png'));
                    
                    console.log(`       => Contient : ${subList.length} éléments.`);
                    if (zips.length > 0) console.log(`       📦 DONT ${zips.length} archives ZIP (Bingo !)`);
                    if (images.length > 0) console.log(`       🖼️ DONT ${images.length} images directes.`);
                    
                    // On affiche les 3 premiers fichiers pour l'exemple
                    subList.slice(0, 3).forEach(sub => console.log(`       - ${sub.name}`));
                } catch (err) {
                    console.log(`       ❌ Impossible d'ouvrir ce dossier.`);
                }
            }
        }
        console.log("\n------------------------------------------------");

    } catch(err) {
        console.log("❌ Échec de connexion :", err);
    }
    client.close();
}

explore();
