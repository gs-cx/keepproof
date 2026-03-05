const ftp = require("basic-ftp");
const dotenv = require('dotenv');
dotenv.config({ path: '/root/frontend/.env' });

async function exploreBacklog() {
    const client = new ftp.Client();
    try {
        console.log("🔌 Connexion...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // On regarde dans le dossier mystère
        const target = "/Backlog";
        console.log(`🔦 Exploration de ${target}...`);
        
        const list = await client.list(target);

        console.log(`📦 ${list.length} éléments trouvés.`);
        console.log("------------------------------------------------");

        // Afficher les 30 premiers pour comprendre la logique
        const preview = list.slice(0, 30);
        for (const item of preview) {
            const type = item.isDirectory ? "📁" : "📄";
            // On affiche le nom et la taille pour repérer les petits fichiers XML
            const size = Math.round(item.size / 1024) + " Ko";
            console.log(` ${type} ${item.name} (${size})`);
        }
        
        if (list.length > 30) console.log(`... et ${list.length - 30} autres.`);

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

exploreBacklog();
