const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const IMAGE_DIR = '/root/inpi_designs_backlog';

async function main() {
    console.log("🧹 Démarrage du Grand Nettoyage...");
    
    let deleted = 0;
    let checked = 0;
    let cursor = null;

    while (true) {
        const params = {
            take: 5000, // On scanne par paquets de 5000
            orderBy: { id: 'asc' },
            select: { id: true, image_file: true }
        };
        if (cursor) {
            params.cursor = { id: cursor };
            params.skip = 1;
        }

        const designs = await prisma.inpi_Design.findMany(params);
        if (designs.length === 0) break;

        const idsToDelete = [];

        for (const d of designs) {
            checked++;
            // Si pas de fichier OU fichier introuvable sur le disque
            if (!d.image_file || !fs.existsSync(path.join(IMAGE_DIR, d.image_file))) {
                idsToDelete.push(d.id);
            }
        }

        if (idsToDelete.length > 0) {
            await prisma.inpi_Design.deleteMany({ where: { id: { in: idsToDelete } } });
            deleted += idsToDelete.length;
            process.stdout.write("x"); // x = suppression
        } else {
            process.stdout.write("."); // . = ok
        }

        cursor = designs[designs.length - 1].id;
        if (checked % 50000 === 0) console.log(` [${checked}] vérifiés...`);
    }

    console.log(`\n✅ Fini ! ${deleted} fiches vides supprimées.`);
}

main().finally(() => prisma.$disconnect());
