import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const DATA_DIR = '/root/frontend/inpi_designs_backlog';
const OUTPUT_FILE = '/root/frontend/image-map.json';

console.log("🚀 Indexation PROFONDE des images (Scan récursif)...");
console.log("Ceci va créer la carte exacte pour trouver les images cachées dans les sous-dossiers.");

const imageMap = {};
// On prend tous les zips d'images
const zipFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip') && f.startsWith('dmf_image'));

let totalImages = 0;
let processedZips = 0;

for (const zipFile of zipFiles) {
    try {
        const zip = new AdmZip(path.join(DATA_DIR, zipFile));
        const entries = zip.getEntries();
        
        entries.forEach(entry => {
            if (!entry.isDirectory) {
                // On récupère le nom du fichier (ex: dmf...001.jpg)
                const filename = path.basename(entry.entryName);
                
                // Si c'est une image (JPG ou TIF)
                if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.tif')) {
                    
                    // ON STOCKE L'INFO CRUCIALE :
                    // z = Le nom du ZIP
                    // p = Le CHEMIN COMPLET à l'intérieur du zip (000/000/.../img.jpg)
                    const fileData = { z: zipFile, p: entry.entryName };

                    // 1. Clé avec extension
                    imageMap[filename] = fileData;

                    // 2. Clé SANS extension (car la base de données n'a pas toujours l'extension)
                    const nameNoExt = filename.split('.').slice(0, -1).join('.');
                    imageMap[nameNoExt] = fileData;

                    totalImages++;
                }
            }
        });
        
        processedZips++;
        // On affiche l'avancement tous les 5 zips
        if (processedZips % 5 === 0) {
            process.stdout.write(`📦 Archives traitées : ${processedZips}/${zipFiles.length} | Images repérées : ${totalImages}\r`);
        }
        
    } catch (e) {
        console.error(`\n❌ Erreur lecture ${zipFile}: ${e.message}`);
    }
}

console.log(`\n\n✅ TERMINÉ ! ${totalImages} images cartographiées.`);
console.log(`💾 Sauvegarde de la carte dans ${OUTPUT_FILE}...`);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imageMap));
console.log("✨ Prêt pour l'affichage !");
