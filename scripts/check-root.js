const ftp = require("basic-ftp");
const dotenv = require('dotenv');
dotenv.config({ path: '/root/frontend/.env' });

async function checkRoot() {
    const client = new ftp.Client();
    try {
        console.log("🔌 Connexion...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        console.log("🌍 LISTING DE LA RACINE (/) :");
        console.log("-----------------------------");
        // On liste la racine "/"
        const list = await client.list("/");

        for (const item of list) {
            const type = item.isDirectory ? "📁 DOSSIER" : "📄 FICHIER";
            console.log(` ${type} : ${item.name}`);
        }
        console.log("-----------------------------");

    } catch(err) {
        console.log("❌ Erreur :", err);
    }
    client.close();
}

checkRoot();
