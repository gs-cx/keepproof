import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';

// On charge les mots de passe depuis le fichier .env
dotenv.config();

async function explore() {
    const client = new ftp.Client();
    
    // Config récupérée de votre .env
    const config = {
        host: process.env.INPI_DM_HOST,
        user: process.env.INPI_DM_USER,
        password: process.env.INPI_DM_PASS,
        secure: false, 
        port: 21
    };

    try {
        console.log(`📡 Connexion à ${config.host}...`);
        await client.access(config);
        console.log("✅ Connecté !");

        console.log("\n📂 --- CONTENU DE LA RACINE DU FTP ---");
        const list = await client.list();
        
        for (const item of list) {
            let type = item.isDirectory ? '[DOSSIER]' : '[FICHIER]';
            console.log(`${type.padEnd(10)} ${item.name} \t(Taille: ${item.size})`);
        }

        // Si on trouve un dossier qui ressemble à des archives, on regarde dedans
        // On cherche tout ce qui contient 'Stock', 'Backlog' ou 'Ancien'
        const folders = list.filter(i => i.isDirectory);
        
        for (const folder of folders) {
            // On jette un oeil rapide dans chaque dossier (juste les 5 premiers fichiers)
            console.log(`\n🔎 Aperçu de : /${folder.name}`);
            const subList = await client.list(folder.name);
            
            // On affiche les 5 premiers éléments
            subList.slice(0, 5).forEach(f => {
                 console.log(`   - ${f.name}`);
            });
            
            if (subList.length > 5) console.log(`   ... (+ ${subList.length - 5} autres fichiers)`);
        }

    } catch (err) {
        console.error("❌ Erreur:", err);
    }
    client.close();
}

explore();
