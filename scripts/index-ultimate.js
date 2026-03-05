import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const DATA_DIR = '/root/frontend/inpi_designs_backlog';
const OUTPUT_FILE = '/root/frontend/image-map.json';

console.log("🚀 Indexation ULTIMATE (Extraction des numéros)...");

const imageMap = {};
const zipFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip') && f.startsWith('dmf_image'));

let totalImages = 0;
let processedZips = 0;

// Fonction qui extrait le cœur numérique significatif
function extractCoreNumbers(filename) {
    // 1. Enlever l'extension
    const name = filename.split('.').slice(0, -1).join('.');
    
    // 2. Trouver toutes les séquences de chiffres
    // Ex: "dmf0000608242_01" -> ["0000608242", "01"]
    const matches = name.match(/\d+/g);
    
    if (!matches) return [name]; // Fallback

    const keys = [];
    
    // Pour chaque séquence de chiffres trouvée
    matches.forEach(match => {
        // Enlever les zéros du début (0000608242 -> 608242)
        const cleanNum = match.replace(/^0+/, '');
        if (cleanNum.length > 3) { // On ne garde que les "vrais" IDs (plus de 3 chiffres) pour éviter les "_01"
            keys.push(cleanNum);
        }
    });

    // On garde aussi le nom exact sans extension au cas où
    keys.push(name);
    
    return keys;
}

for (const zipFile of zipFiles) {
    try {
        const zip = new AdmZip(path.join(DATA_DIR, zipFile));
        const entries = zip.getEntries();
        
        entries.forEach(entry => {
            if (!entry.isDirectory) {
                const filename = path.basename(entry.entryName);
                const lowerName = filename.toLowerCase();

                if (lowerName.endsWith('.jpg') || lowerName.endsWith('.tif')) {
                    
                    const fileData = { z: zipFile, p: entry.entryName };
                    
                    // On génère toutes les clés possibles pour ce fichier
                    const keys = extractCoreNumbers(filename);
                    
                    keys.forEach(key => {
                        // On enregistre ce fichier pour cette clé
                        imageMap[key] = fileData;
                    });

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
