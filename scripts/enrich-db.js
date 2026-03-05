const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const XML_DIR = '/root/inpi_designs_backlog';

async function main() {
    console.log("🚀 Démarrage de l'enrichissement des données...");
    
    // 1. Trouver tous les fichiers XML
    // On cherche récursivement ou juste à la racine (selon votre structure)
    // Ici on suppose qu'ils sont à la racine ou dans des sous-dossiers
    const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith('.xml'));
    
    console.log(`📂 ${files.length} fichiers XML trouvés à analyser.`);
    
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    let updatedCount = 0;

    for (const file of files) {
        const filePath = path.join(XML_DIR, file);
        try {
            const content = fs.readFileSync(filePath);
            const result = await parser.parseStringPromise(content);
            
            // Navigation dans la structure XML complexe de l'INPI
            let apps = result.Transaction?.DesignTransactionBody?.TransactionContentDetails?.TransactionData?.DesignApplicationDetails?.DesignApplication;
            
            if (!apps) continue;
            if (!Array.isArray(apps)) apps = [apps]; // Gérer le cas où il n'y en a qu'un seul

            for (const app of apps) {
                const date = app.DesignApplicationDate;
                let designs = app.DesignDetails?.Design;
                
                if (!designs) continue;
                if (!Array.isArray(designs)) designs = [designs];

                for (const design of designs) {
                    const titre = design.DesignTitle;
                    
                    // Récupérer la Classe Locarno (Catégorie du produit)
                    let locarno = null;
                    try {
                        locarno = design.IndicationProductDetails?.IndicationProduct?.ClassDescriptionDetails?.ClassDescription?.ClassNumber;
                    } catch(e) {}

                    // Trouver les Numéros de Vue (Lien avec les images)
                    // Structure: DesignRepresentationSheet -> ViewDetails -> View -> ViewNumber
                    let sheets = design.DesignRepresentationSheetDetails?.DesignRepresentationSheet;
                    if (!sheets) continue;
                    if (!Array.isArray(sheets)) sheets = [sheets];

                    for (const sheet of sheets) {
                        let viewDetails = sheet.ViewDetails?.View;
                        if (!viewDetails) continue;
                        if (!Array.isArray(viewDetails)) viewDetails = [viewDetails];

                        for (const view of viewDetails) {
                            const viewNumber = view.ViewNumber; // Ex: 614463
                            
                            // Si on a un numéro, on met à jour la base de données
                            if (viewNumber) {
                                // On nettoie les zéros devant pour matcher l'ID en base (ex: 00614463 -> 614463)
                                const cleanId = parseInt(viewNumber, 10).toString();

                                const update = await prisma.inpi_Design.updateMany({
                                    where: { num_enregistrement: cleanId },
                                    data: {
                                        titre: titre,
                                        date: date,
                                        locarno_class: locarno,
                                        // On ajoute le titre technique dans la description pour aider la recherche
                                        description: view.ViewTitle || titre
                                    }
                                });
                                
                                if (update.count > 0) updatedCount++;
                            }
                        }
                    }
                }
            }
            // Feedback visuel tous les 10 fichiers
            process.stdout.write(".");
            
        } catch (e) {
            console.error(`\nErreur fichier ${file}:`, e.message);
        }
    }

    console.log(`\n\n✅ TERMINÉ !`);
    console.log(`🎉 ${updatedCount} fiches ont été mises à jour avec un vrai titre et une date.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
