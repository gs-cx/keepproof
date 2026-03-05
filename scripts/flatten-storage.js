const { execSync } = require("child_process");

console.log("🧹 DÉMARRAGE DU GRAND RANGEMENT...");
console.log("Objectif : Sortir les images des sous-dossiers pour les mettre à la racine.");
console.log("-------------------------------------------------------------");

try {
    const dir = "/var/www/designs_storage/";

    // ÉTAPE 1 : On remonte tout (Cette commande peut prendre 1 ou 2 minutes)
    // -mindepth 2 : On ne touche pas à ce qui est déjà bien rangé
    // -type f : On ne déplace que les fichiers
    // mv -n : On déplace, mais on n'écrase pas si un fichier du même nom existe déjà (sécurité)
    console.log("🚀 Déplacement des fichiers vers la racine (Patience)...");
    
    // Note : On utilise 'find' qui est très rapide
    execSync(`find ${dir} -mindepth 2 -type f -exec mv -n {} ${dir} \\;`);
    
    console.log("✅ Tous les fichiers ont été remontés !");

    // ÉTAPE 2 : On supprime les coquilles vides
    console.log("🗑️  Suppression des dossiers vides...");
    execSync(`find ${dir} -mindepth 1 -type d -empty -delete`);
    
    console.log("✨ Nettoyage terminé.");
    console.log("📂 Votre dossier de stockage est maintenant parfaitement plat.");

} catch (error) {
    console.error("❌ Une erreur est survenue (peut-être des permissions ?) :", error.message);
}
