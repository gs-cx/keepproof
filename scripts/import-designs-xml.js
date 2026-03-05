const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');
const { MeiliSearch } = require('meilisearch');
const dotenv = require('dotenv');

dotenv.config();

// --- CONFIGURATION ---
// ⚠️ IMPORTANT : Créez ce dossier et mettez vos ZIP de dessins dedans
const DATA_DIR = '/root/frontend/inpi_designs_backlog'; 

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://127.0.0.1:7700',
  // VOICI LA CLÉ CORRECTE RÉCUPÉRÉE DE VOTRE ANCIEN SCRIPT :
  apiKey: 'MXMJooEjWtujkylMD8rXwzbFgUrHNTg4KA6Rk59oXFM=', 
});

// ON CHANGE L'INDEX ICI
const index = client.index('designs');
const BATCH_SIZE = 5000;

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true
});

// --- FONCTIONS ADAPTÉES AUX DESSINS ---

function findOwner(design) {
    // La structure Applicant est souvent la même que pour les marques
    let applicant = design.ApplicantDetails?.Applicant;
    if (!applicant) return "Inconnu";

    if (Array.isArray(applicant)) applicant = applicant[0];

    const nameObj = applicant?.ApplicantAddressBook?.FormattedNameAddress?.Name;
    if (!nameObj) return "Inconnu";

    // Priorité au nom d'organisation
    if (nameObj.FormattedName?.OrganizationName) return nameObj.FormattedName.OrganizationName;
    if (nameObj.FormattedName?.LastName) return nameObj.FormattedName.LastName;
    
    // Fallback
    if (nameObj.FreeFormatName?.FreeFormatNameDetails?.FreeFormatNameLine) return nameObj.FreeFormatName.FreeFormatNameDetails.FreeFormatNameLine;

    return "Inconnu";
}

function findLocarnoClasses(design) {
    // Les dessins utilisent la classification de Locarno, pas Nice
    let classes = [];
    
    let locarno = design.DesignClassificationDetails?.LocarnoClassificationDetails?.LocarnoClassification;
    
    if (locarno) {
        if (Array.isArray(locarno)) {
            classes = locarno.map(c => c.ClassNumber);
        } else if (locarno.ClassNumber) {
            classes.push(locarno.ClassNumber);
        }
    }
    return classes.length > 0 ? classes.join(", ") : "";
}

async function startImport() {
    console.log("🎨 Démarrage de l'importation DESSINS & MODÈLES...");

    // Configuration de l'index spécifique aux dessins
    await index.updateSettings({
        searchableAttributes: ['titre', 'deposant', 'id', 'description'],
        filterableAttributes: ['locarno', 'date', 'deposant'],
        sortableAttributes: ['date'],
        displayedAttributes: ['id', 'titre', 'deposant', 'date', 'locarno', 'image_preview']
    });

    // Vérification du dossier
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log(`⚠️ Dossier créé : ${DATA_DIR}`);
        console.log("👉 Veuillez y déposer les fichiers ZIP de l'INPI (Dessins) avant de relancer.");
        return;
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip'));
    console.log(`📦 ${files.length} fichiers ZIP trouvés.`);

    let documents = [];
    let totalImported = 0;
    let fileCount = 0;

    for (const file of files) {
        fileCount++;
        const filePath = path.join(DATA_DIR, file);
        
        try {
            const zip = new AdmZip(filePath);
            const zipEntries = zip.getEntries();

            for (const entry of zipEntries) {
                if (!entry.entryName.endsWith('.xml')) continue;
                
                const xmlData = zip.readAsText(entry);
                const jsonObj = parser.parse(xmlData);

                // --- NAVIGATION XML SPÉCIFIQUE DESSINS ---
                // L'INPI utilise souvent TransactionData -> DesignDetails
                let root = jsonObj?.Transaction?.DesignTransactionBody?.TransactionContentDetails?.TransactionData?.DesignDetails;
                
                // Fallback si la structure varie légèrement
                if (!root) root = jsonObj?.Transaction?.DesignTransactionBody?.TransactionContentDetails?.TransactionData;

                if (!root) continue;

                // Parfois c'est une liste de Designs, parfois un seul
                let designsList = [];
                if (root.Design) {
                    designsList = Array.isArray(root.Design) ? root.Design : [root.Design];
                }

                for (const d of designsList) {
                    try {
                        const id = d.DesignIdentifier || d.RegistrationNumber || "0";
                        
                        // Le "Nom" d'un dessin est souvent son "Indication de produit"
                        let title = d.IndicationProductDetails?.IndicationProduct;
                        if (typeof title === 'object') title = title['#text'] || "Sans titre"; // Parfois c'est un objet texte
                        if (!title) title = "Dessin sans titre";

                        const owner = findOwner(d);
                        const locarno = findLocarnoClasses(d);
                        const date = d.DesignDate || d.RegistrationDate;
                        
                        // On essaie de récupérer une description si elle existe
                        const description = d.DescriptionDetails?.Description || "";

                        documents.push({
                            id: String(id),
                            titre: String(title).trim(), // "Sac à main", "Chaise", etc.
                            deposant: String(owner).trim(),
                            date: date || null,
                            locarno: String(locarno),
                            description: String(description).substring(0, 500) // On coupe si trop long
                        });

                    } catch (e) { 
                        // Ignorer les erreurs mineures sur un dessin
                    }
                }
            }

            // Envoi par lot (Batch)
            if (documents.length >= BATCH_SIZE) {
                await index.addDocuments(documents);
                totalImported += documents.length;
                process.stdout.write(`\r✅ Fichiers : ${fileCount}/${files.length} | Dessins : ${totalImported}`);
                documents = [];
            }

        } catch (err) {
            console.error(`\n⚠️ Erreur ZIP ${file}: ${err.message}`);
        }
    }

    if (documents.length > 0) {
        await index.addDocuments(documents);
        totalImported += documents.length;
    }

    console.log(`\n\n🎉 IMPORTATION DESSINS TERMINÉE ! Total : ${totalImported}`);
}

startImport();
