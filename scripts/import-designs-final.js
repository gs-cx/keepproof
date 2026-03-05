const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');
const { MeiliSearch } = require('meilisearch');
const dotenv = require('dotenv');

dotenv.config();

// --- CONFIGURATION ---
const DATA_DIR = '/root/frontend/inpi_designs_backlog';
const BATCH_SIZE = 5000;

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://127.0.0.1:7700',
  // VOTRE CLÉ VALIDÉE
  apiKey: 'MXMJooEjWtujkylMD8rXwzbFgUrHNTg4KA6Rk59oXFM=', 
});

const index = client.index('designs');

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true
});

// --- FONCTIONS UTILITAIRES ---

function findOwner(app) {
    // Le propriétaire est au niveau du Dépôt (Application), pas du dessin individuel
    let applicant = app.ApplicantDetails?.Applicant;
    if (!applicant) return "Inconnu";

    if (Array.isArray(applicant)) applicant = applicant[0];

    // Chercher le nom (Organization ou LastName)
    const nameObj = applicant?.ApplicantAddressBook?.FormattedNameAddress?.Name;
    if (!nameObj) return "Inconnu";

    if (nameObj.FormattedName?.OrganizationName) return nameObj.FormattedName.OrganizationName;
    if (nameObj.FormattedName?.LastName) {
        let fullName = nameObj.FormattedName.LastName;
        if (nameObj.FormattedName.FirstName) fullName += " " + nameObj.FormattedName.FirstName;
        return fullName;
    }
    return "Inconnu";
}

function findImage(design) {
    // On cherche le nom du fichier image
    try {
        const view = design.DesignRepresentationSheetDetails?.DesignRepresentationSheet?.ViewDetails?.View;
        if (!view) return null;
        
        // Si plusieurs vues, on prend la première
        if (Array.isArray(view)) return view[0].ViewFilename;
        return view.ViewFilename;
    } catch (e) {
        return null;
    }
}

async function startImport() {
    console.log("🎨 Démarrage de l'importation DESSINS (Structure Corrigée)...");

    // Configuration de l'index
    await index.updateSettings({
        searchableAttributes: ['titre', 'deposant', 'id'],
        filterableAttributes: ['date', 'deposant', 'statut'],
        sortableAttributes: ['date'],
        displayedAttributes: ['id', 'titre', 'deposant', 'date', 'image_file', 'statut']
    });

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip'));
    console.log(`📦 ${files.length} fichiers ZIP à traiter.`);

    let documents = [];
    let totalImported = 0;
    let fileCount = 0;

    for (const file of files) {
        // On ignore les ZIP d'images pour ne traiter que les données XML
        if (file.includes('dmf_image')) continue; 

        fileCount++;
        const filePath = path.join(DATA_DIR, file);
        
        try {
            const zip = new AdmZip(filePath);
            const zipEntries = zip.getEntries();

            for (const entry of zipEntries) {
                if (!entry.entryName.endsWith('.xml')) continue;
                
                const xmlData = zip.readAsText(entry);
                const jsonObj = parser.parse(xmlData);

                // --- CHEMIN EXACT DÉCOUVERT GRÂCE AU DEBUG ---
                // Transaction -> DesignTransactionBody -> TransactionContentDetails -> TransactionData -> DesignApplicationDetails -> DesignApplication
                
                const transactionData = jsonObj?.Transaction?.DesignTransactionBody?.TransactionContentDetails?.TransactionData;
                if (!transactionData) continue;

                let applications = transactionData.DesignApplicationDetails?.DesignApplication;
                if (!applications) continue;

                // Normaliser en tableau (car peut être un seul objet)
                if (!Array.isArray(applications)) applications = [applications];

                for (const app of applications) {
                    // Infos communes à tous les dessins de ce dépôt
                    const owner = findOwner(app);
                    const dateDepot = app.DesignApplicationDate;
                    const idDepot = app.DesignApplicationNumber;

                    // Récupérer les dessins (Design) dans ce dépôt
                    let designs = app.DesignDetails?.Design;
                    if (!designs) continue;
                    if (!Array.isArray(designs)) designs = [designs];

                    for (const d of designs) {
                        try {
                            const titre = d.DesignTitle || "Sans titre";
                            const statut = d.DesignCurrentStatusCode || "Inconnu";
                            const imageFile = findImage(d);
                            const designId = d.RegistrationNumber || idDepot; // ID Unique

                            documents.push({
                                id: `${designId}_${d.DesignReference || 0}`, // ID composite pour unicité
                                titre: String(titre).trim(),
                                deposant: String(owner).trim(),
                                date: dateDepot,
                                statut: statut,
                                image_file: imageFile // On garde le lien vers l'image !
                            });

                        } catch (e) { }
                    }
                }
            }

            // Envoi par lot
            if (documents.length >= BATCH_SIZE) {
                await index.addDocuments(documents);
                totalImported += documents.length;
                process.stdout.write(`\r✅ XML Traités : ${fileCount} | Dessins indexés : ${totalImported}`);
                documents = [];
            }

        } catch (err) {
            console.error(`\n⚠️ Erreur sur ${file}: ${err.message}`);
        }
    }

    if (documents.length > 0) {
        await index.addDocuments(documents);
        totalImported += documents.length;
    }

    console.log(`\n\n🎉 IMPORTATION TERMINÉE ! ${totalImported} dessins ajoutés.`);
}

startImport();
