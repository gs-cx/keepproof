const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');
const { MeiliSearch } = require('meilisearch');

// --- CONFIGURATION ---
const DATA_DIR = '/root/frontend/inpi_backlog';
const MEILI_HOST = 'http://127.0.0.1:7700';
const MEILI_KEY = 'MXMJooEjWtujkylMD8rXwzbFgUrHNTg4KA6Rk59oXFM=';
const BATCH_SIZE = 5000;

const client = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_KEY });
const index = client.index('brands');

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true
});

// --- FONCTIONS DE RECHERCHE INTELLIGENTE ---

function findOwner(tm) {
    // On essaie de trouver le demandeur (Applicant)
    let applicant = tm.ApplicantDetails?.Applicant;
    if (!applicant) return "Inconnu";

    // Si tableau, on prend le premier
    if (Array.isArray(applicant)) applicant = applicant[0];

    // On navigue jusqu'au nom
    const nameObj = applicant?.ApplicantAddressBook?.FormattedNameAddress?.Name;
    if (!nameObj) return "Inconnu";

    // CAS 1 : Format Moderne (OrganizationName)
    if (nameObj.FormattedName?.OrganizationName) return nameObj.FormattedName.OrganizationName;

    // CAS 2 : Format Particulier (LastName)
    if (nameObj.FormattedName?.LastName) return nameObj.FormattedName.LastName;

    // CAS 3 : Format Ancien (FreeFormatName) - C'est celui de Louis Vuitton 1978 !
    const freeName = nameObj.FreeFormatName?.FreeFormatNameDetails?.FreeFormatNameLine;
    if (freeName) return freeName;

    // CAS 4 : Format très ancien (PersonName)
    if (nameObj.PersonName?.PersonNameDetails?.PersonNameSurname) return nameObj.PersonName.PersonNameDetails.PersonNameSurname;

    return "Inconnu";
}

function findClasses(tm) {
    let classes = [];

    // CAS 1 : Format Moderne (ClassDescriptionDetails)
    let gs = tm.GoodsServicesDetails?.GoodsServices?.ClassDescriptionDetails?.ClassDescription;
    
    // CAS 2 : Format Ancien (BasicRegistrationDetails)
    if (!gs) {
        gs = tm.BasicRegistrationDetails?.GoodsServicesDetails?.GoodsServices?.ClassDescriptionDetails?.ClassDescription;
    }

    if (gs) {
        if (Array.isArray(gs)) {
            classes = gs.map(c => c.ClassNumber);
        } else if (gs.ClassNumber) {
            classes.push(gs.ClassNumber);
        }
    }

    return classes.length > 0 ? classes.join(", ") : "";
}

async function startImport() {
    console.log("🚀 Démarrage de l'importation INPI (Mode 4x4 - Compatible 1970-2025)...");

    await index.updateSettings({
        searchableAttributes: ['name', 'owner', 'id'],
        filterableAttributes: ['classes', 'date', 'owner'],
        sortableAttributes: ['date'],
        displayedAttributes: ['id', 'name', 'owner', 'date', 'classes', 'status']
    });

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip'));
    console.log(`📦 ${files.length} fichiers ZIP.`);

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

                let root = jsonObj?.Transaction?.TradeMarkTransactionBody?.TransactionContentDetails?.TransactionData?.TradeMarkDetails;
                if (!root) root = jsonObj?.Transaction?.TradeMarkTransactionBody?.TransactionContentDetails?.TransactionData?.TrademarkBag;

                if (!root || !root.TradeMark) continue;

                let trademarks = Array.isArray(root.TradeMark) ? root.TradeMark : [root.TradeMark];

                for (const tm of trademarks) {
                    try {
                        const id = tm.ApplicationNumber || tm.RegistrationNumber || "0";
                        
                        let name = tm.WordMarkSpecification?.MarkVerbalElementText;
                        if (!name) name = tm.MarkImageDetails?.MarkImage?.MarkImageText;
                        
                        if (!name) continue;

                        // --- UTILISATION DES FONCTIONS INTELLIGENTES ---
                        const owner = findOwner(tm);
                        const classes = findClasses(tm);
                        const date = tm.ApplicationDate;

                        documents.push({
                            id: String(id),
                            name: String(name).trim(),
                            owner: String(owner).trim(),
                            date: date || null,
                            classes: String(classes),
                            status: 'Enregistrée'
                        });

                    } catch (e) { }
                }
            }

            if (documents.length >= BATCH_SIZE) {
                await index.addDocuments(documents);
                totalImported += documents.length;
                process.stdout.write(`\r✅ Fichiers : ${fileCount}/${files.length} | Marques : ${totalImported}`);
                documents = [];
            }

        } catch (err) {
            console.error(`\n⚠️ Erreur ZIP ${file}`);
        }
    }

    if (documents.length > 0) {
        await index.addDocuments(documents);
        totalImported += documents.length;
    }

    console.log(`\n\n🎉 IMPORTATION TERMINÉE !`);
}

startImport();
