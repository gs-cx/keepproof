const fs = require("fs");

console.log("🕵️‍♂️ Recherche des fichiers de l'année 2024 sur le disque...");

const dir = "/var/www/designs_storage/";

try {
    const files = fs.readdirSync(dir);
    
    // On cherche tout ce qui contient "2024"
    const matches = files.filter(f => f.includes("2024") && f.endsWith(".jpg"));
    
    console.log(`\n📄 Total fichiers trouvés avec '2024' dans le nom : ${matches.length}`);
    
    if (matches.length > 0) {
        console.log("✅ EXCELLENTE NOUVELLE ! Voici 5 exemples :");
        matches.slice(0, 5).forEach(f => console.log(`   - ${f}`));
    } else {
        console.log("❌ Aïe. Aucun fichier ne semble porter le nom '2024'.");
        console.log("   Il faudra comprendre comment ils sont nommés.");
    }

} catch (e) {
    console.log("❌ Erreur : " + e.message);
}

