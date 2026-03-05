const ftp = require("basic-ftp");
const dotenv = require('dotenv');

dotenv.config({ path: '/root/frontend/.env' });

async function main() {
    console.log("🔦 EXPLORATION DES TRÉFONDS (Archives anciennes)...");

    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // On suppose que le dossier s'appelle Archives dans le backlog (vu précédemment)
        const BASE_PATH = "/OPENDATA_FRDM_BACKLOG/Archives";
        
        console.log(`📂 Tentative d'accès à : ${BASE_PATH}`);
        
        try {
            const list = await client.list(BASE_PATH);
            list.sort((a, b) => b.name.localeCompare(a.name)); // Tri décroissant (les plus récents en haut)

            console.log(`📊 ${list.length} éléments trouvés.`);
            
            // On affiche les 20 premiers pour voir la structure
            console.log("--- Aperçu des dossiers/fichiers ---");
            for (const item of list.slice(0, 20)) {
                if (item.isDirectory) {
                    console.log(`📁 [DOSSIER] ${item.name}`);
                } else {
                    console.log(`📦 [FICHIER] ${item.name} (${(item.size/1024/1024).toFixed(1)} MB)`);
                }
            }

            // Si ce sont des dossiers par année (ex: 2014, 2013), on essaie d'en ouvrir un
            const yearFolder = list.find(f => f.isDirectory && f.name.match(/201[0-4]/)); // Cherche 2010-2014
            if (yearFolder) {
                console.log(`\n🕵️‍♂️ Regardons dans le dossier d'une année passée : /${yearFolder.name}`);
                const subList = await client.list(`${BASE_PATH}/${yearFolder.name}`);
                subList.slice(0, 5).forEach(f => console.log(`   📄 ${f.name}`));
            }

        } catch (err) {
            console.log("❌ Impossible d'ouvrir le dossier Archives : " + err.message);
            // Si ça échoue, on regarde à la racine d'archives si le chemin est différent
            console.log("   (Le dossier est peut-être vide ou inaccessible)");
        }

    } catch (e) { console.log(e); }
    client.close();
}

main();
