const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');

const DATA_DIR = '/root/frontend/inpi_backlog';

// Parseur XML
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true
});

const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.zip'));

if (files.length === 0) {
    console.log("❌ Aucun ZIP trouvé.");
} else {
    // On prend le premier fichier ZIP
    const firstFile = files[0];
    console.log(`🔍 Analyse approfondie de : ${firstFile}`);

    const zip = new AdmZip(path.join(DATA_DIR, firstFile));
    const entries = zip.getEntries();
    const xmlEntry = entries.find(e => e.entryName.endsWith('.xml'));

    if (xmlEntry) {
        const xmlData = zip.readAsText(xmlEntry);
        const jsonObj = parser.parse(xmlData);

        // On cherche la marque
        let root = jsonObj?.Transaction?.TradeMarkTransactionBody?.TransactionContentDetails?.TransactionData?.TradeMarkDetails;
        if (!root) root = jsonObj?.Transaction?.TradeMarkTransactionBody?.TransactionContentDetails?.TransactionData?.TrademarkBag;

        if (root && root.TradeMark) {
            let tm = Array.isArray(root.TradeMark) ? root.TradeMark[0] : root.TradeMark;

            console.log("\n--- STRUCTURE BRUTE (Copiez tout ceci) ---");
            // On affiche les blocs qui nous intéressent : Titulaire et Classes
            console.log(">>> ApplicantDetails (Propriétaire) :");
            console.log(JSON.stringify(tm.ApplicantDetails, null, 2));

            console.log("\n>>> GoodsServicesDetails (Classes) :");
            console.log(JSON.stringify(tm.GoodsServicesDetails, null, 2));
            console.log("--- FIN DE LA STRUCTURE ---\n");
        } else {
            console.log("❌ Pas de balise TradeMark trouvée dans ce chemin.");
            console.log(JSON.stringify(jsonObj, null, 2).substring(0, 500));
        }
    }
}
