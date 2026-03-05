const ftp = require("basic-ftp");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function main() {
    const client = new ftp.Client();
    // client.ftp.verbose = true;

    try {
        console.log(`🔌 Connexion au FTP...`);
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // 1. On regarde dans le dossier BACKLOG général
        console.log("\n📂 --- CONTENU DE /OPENDATA_FRDM_BACKLOG ---");
        const backlogList = await client.list("/OPENDATA_FRDM_BACKLOG");
        
        // On cherche les fichiers images ici
        const imagesRoot = backlogList.filter(f => f.name.includes("image"));
        if (imagesRoot.length > 0) {
            console.log(`🎉 TROUVÉ ! ${imagesRoot.length} packs d'images à la racine du backlog.`);
            imagesRoot.forEach(f => console.log(`   - ${f.name} (${(f.size/1024/1024).toFixed(1)} MB)`));
        } else {
            console.log("   (Pas de fichiers 'image' ici, c'est sûrement du XML)");
        }

        // 2. On regarde dans le sous-dossier Archives (Le suspect n°1)
        console.log("\n📂 --- CONTENU DE /OPENDATA_FRDM_BACKLOG/Archives ---");
        try {
            const archivesList = await client.list("/OPENDATA_FRDM_BACKLOG/Archives");
            const imagesArch = archivesList.filter(f => f.name.includes("image") || f.name.endsWith(".zip"));
            
            console.log(`📦 Ce dossier contient ${archivesList.length} fichiers.`);
            
            // On affiche les 10 premiers pour voir les noms
            console.log("   Voici les 10 premiers fichiers :");
            imagesArch.slice(0, 10).forEach(f => console.log(`   - ${f.name} (${(f.size/1024/1024).toFixed(1)} MB)`));
            
        } catch (e) {
            console.log("❌ Impossible d'ouvrir le dossier Archives.");
        }

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

main();
