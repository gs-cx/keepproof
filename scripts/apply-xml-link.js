const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

const XML_DIR = "/root/frontend/temp_xml_folder";
const STORAGE_DIR = "/var/www/designs_storage/";

async function main() {
    console.log("🔗 DÉMARRAGE DU LINKER XML...");

    // 1. Lire les fichiers XML
    if (!fs.existsSync(XML_DIR)) {
        console.log("❌ Dossier XML introuvable. Avez-vous lancé l'étape précédente ?");
        return;
    }
    const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
    console.log(`📂 Analyse de ${files.length} fichiers XML...`);

    let updates = 0;
    let skipped = 0;

    for (const file of files) {
        const content = fs.readFileSync(path.join(XML_DIR, file), "utf8");

        // 2. Extraction via Regex (plus rapide et tolérant que le parsing XML complet)
        // On cherche le RegistrationNumber
        const regMatch = content.match(/<RegistrationNumber>([^<]+)<\/RegistrationNumber>/);
        // On cherche le ViewNumber (parfois il y en a plusieurs, on prend le premier pour l'instant)
        const viewMatch = content.match(/<ViewNumber>([^<]+)<\/ViewNumber>/);

        if (regMatch && viewMatch) {
            const numEnregistrement = regMatch[1];
            const viewNumber = viewMatch[1];

            // 3. Conversion du ViewNumber en nom de fichier (Padding 9 chiffres)
            // Ex: "727485" -> "000727485.jpg"
            const filename = viewNumber.padStart(9, "0") + ".jpg";
            
            // On vérifie si l'image existe physiquement
            if (fs.existsSync(path.join(STORAGE_DIR, filename))) {
                
                // 4. Mise à jour de la base de données
                try {
                    // On cherche si la fiche existe
                    const design = await prisma.inpi_Design.findFirst({
                        where: { num_enregistrement: numEnregistrement }
                    });

                    if (design) {
                        await prisma.inpi_Design.update({
                            where: { id: design.id },
                            data: { image_file: `/designs/${filename}` }
                        });
                        updates++;
                        process.stdout.write(`\r✅ Lié : ${numEnregistrement} -> ${filename}   `);
                    } else {
                        // La fiche n'est pas dans la base (peut-être une année qu'on n'a pas importée ?)
                        skipped++;
                    }
                } catch (e) {
                    console.log(`❌ Erreur DB sur ${numEnregistrement}: ${e.message}`);
                }
            }
        }
    }

    console.log("\n\n📊 Bilan de cette session :");
    console.log(`✅ ${updates} fiches mises à jour avec succès.`);
    console.log(`⏩ ${skipped} fiches XML ignorées (absentes de la DB).`);
}

main();
