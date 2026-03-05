const ftp = require("basic-ftp");
const dotenv = require('dotenv');
dotenv.config({ path: '/root/frontend/.env' });

async function main() {
    const client = new ftp.Client();
    try {
        console.log("📡 RADAR ACTIVÉ : Recherche de fichiers > 1 MB...");
        await client.access({
            host: process.env.INPI_DM_HOST,
            user: process.env.INPI_DM_USER,
            password: process.env.INPI_DM_PASS,
            secure: false
        });

        // 1. Scan de la racine pour voir la structure
        console.log("\n📂 Dossiers à la racine :");
        const rootList = await client.list("/");
        rootList.forEach(f => {
            if(f.isDirectory) console.log(`   📁 /${f.name}`);
        });

        // 2. Scan approfondi de 2024
        console.log("\n📂 Recherche de GROS fichiers dans /2024...");
        const list2024 = await client.list("/2024");
        
        // On cherche tout ce qui fait plus de 1 MegaOctet
        const heavyFiles = list2024.filter(f => f.size > 1000000); // > 1MB

        if (heavyFiles.length > 0) {
            console.log(`🎉 TROUVÉ ! ${heavyFiles.length} fichiers lourds dans /2024 :`);
            heavyFiles.slice(0, 10).forEach(f => {
                console.log(`   📦 ${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`);
            });
            console.log("   (C'est probablement ici que sont les images !)");
        } else {
            console.log("❌ Aucun gros fichier dans /2024.");
            console.log("   Les images doivent être dans un autre dossier (Flux ? Images ?).");
            
            // Si rien dans 2024, on tente un dossier 'Flux' s'il existe
            try {
                const listFlux = await client.list("/Flux");
                console.log("\n📂 Contenu du dossier /Flux (si existant) :");
                listFlux.forEach(f => console.log(`   📄 ${f.name}`));
            } catch(e) {}
        }

    } catch(err) { console.log(err); }
    client.close();
}
main();
