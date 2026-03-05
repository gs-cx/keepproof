import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const DATA_DIR = '/root/frontend/inpi_designs_backlog';
const OUTPUT_FILE = '/root/frontend/image-map.json';

console.log("🚀 Indexation des images V2 (Correction des chemins)...");

const imageMap = {};
// On prend TOUS les zips (Backlog inclus)
const zipFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip') && f.startsWith('dmf_image'));

let totalImages = 0;
let processedZips = 0;

console.log(`📦 ${zipFiles.length} fichiers ZIP à analyser.`);

for (const zipFile of zipFiles) {
    try {
        const zip = new AdmZip(path.join(DATA_DIR, zipFile));
        const entries = zip.getEntries();
        
        entries.forEach(entry => {
            if (!entry.isDirectory) {
                const filename = entry.entryName; // ex: 2020/01/image.jpg
                const basename = path.basename(filename); // ex: image.jpg
                
                // On cherche des images
                if (basename.toLowerCase().endsWith('.jpg') || basename.toLowerCase().endsWith('.tif')) {
                    
                    // 1. On stocke le nom EXACT (avec extension)
                    // CLÉ = image.jpg  => VALEUR = { zip: "file.zip", fullPath: "2020/01/image.jpg" }
                    imageMap[basename] = { z: zipFile, p: filename };

                    // 2. On stocke aussi SANS extension (car la base de données n'a pas toujours l'extension)
                    const nameNoExt = basename.split('.').slice(0, -1).join('.');
                    imageMap[nameNoExt] = { z: zipFile, p: filename };

                    totalImages++;
                }
            }
        });
        
        processedZips++;
        process.stdout.write(`📚 ZIP: ${processedZips}/${zipFiles.length} | Images indexées : ${totalImages}\r`);
        
    } catch (e) {
        console.error(`\n❌ Erreur lecture ${zipFile}`);
    }
}

console.log(`\n\n✅ TERMINÉ ! ${totalImages} images cartographiées.`);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imageMap));
