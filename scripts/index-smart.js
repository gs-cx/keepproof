import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const DATA_DIR = '/root/frontend/inpi_designs_backlog';
const OUTPUT_FILE = '/root/frontend/image-map.json';

console.log("🚀 Indexation SMART des images...");
console.log("On ignore les zéros inutiles pour garantir la correspondance.");

const imageMap = {};
const zipFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip') && f.startsWith('dmf_image'));

let totalImages = 0;
let processedZips = 0;

// Fonction pour nettoyer le nom (garder uniquement l'identifiant utile)
// Ex: "dmf0000000987149_001.jpg" -> "987149_001"
function cleanName(filename) {
    // Enlève l'extension
    let name = filename.split('.').slice(0, -1).join('.');
    // Enlève 'dmf' et les zéros qui suivent
    name = name.replace(/^dmf0*/i, ''); 
    // Enlève juste les zéros de début si pas de dmf
    name = name.replace(/^0+/, ''); 
    return name;
}

for (const zipFile of zipFiles) {
    try {
        const zip = new AdmZip(path.join(DATA_DIR, zipFile));
        const entries = zip.getEntries();
        
        entries.forEach(entry => {
            if (!entry.isDirectory) {
                const filename = path.basename(entry.entryName);
                
                if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.tif')) {
                    
                    // Données de localisation
                    const fileData = { z: zipFile, p: entry.entryName };
                    
                    // 1. On stocke le nom EXACT (au cas où)
                    imageMap[filename] = fileData;
                    
                    // 2. On stocke le nom "NETTOYÉ" (C'est la clé magique !)
                    const smartKey = cleanName(filename);
                    if (smartKey) {
                        imageMap[smartKey] = fileData;
                    }

                    totalImages++;
                }
            }
        });
        
        processedZips++;
        if (processedZips % 5 === 0) process.stdout.write(`📦 ZIP: ${processedZips}/${zipFiles.length} | Images: ${totalImages}\r`);
        
    } catch (e) {
        // Ignorer erreurs
    }
}

console.log(`\n\n✅ TERMINÉ ! ${totalImages} images indexées.`);
console.log(`💾 Sauvegarde de la carte dans ${OUTPUT_FILE}...`);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imageMap));
