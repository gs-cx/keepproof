import ftp from 'basic-ftp';

async function explore() {
    const client = new ftp.Client();
    // client.ftp.verbose = true; // Décommentez pour voir le détail technique

    try {
        console.log("📡 Connexion au serveur FTP de l'INPI...");
        await client.access({
            host: "ftp.inpi.fr",
            user: "inpi_fr_dm_libre",
            password: "ftp", // Mot de passe public standard INPI
            secure: false
        });

        console.log("📂 Listage de la racine :");
        const list = await client.list();
        
        for (const item of list) {
            console.log(`- [${item.type === 2 ? 'DOSSIER' : 'FICHIER'}] ${item.name} (Taille: ${item.size})`);
        }

        // Regardons si on peut entrer dans un dossier 'Backlog' ou 'Stock'
        const potentialFolders = list.filter(i => i.isDirectory && i.name.toLowerCase().includes('backlog'));
        
        for (const folder of potentialFolders) {
            console.log(`\n🔎 Inspection de ${folder.name} :`);
            const subList = await client.list(folder.name);
            // Affiche les 5 premiers fichiers pour voir les dates
            subList.slice(0, 5).forEach(f => console.log(`  > ${f.name}`));
        }

    } catch (err) {
        console.log("❌ Erreur:", err);
    }
    client.close();
}

explore();
