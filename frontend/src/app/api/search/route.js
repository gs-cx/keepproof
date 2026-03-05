import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
    const start = Date.now();
    const { searchParams } = new URL(request.url);

    // 1. Récupération des paramètres
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'relevance';
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');

    try {
        // 2. Construction du filtre (Where)
        let where = {};

        // Recherche textuelle (Titre OU Déposant OU Numéro)
        if (q) {
            where.OR = [
                { description: { contains: q } }, // MySQL/Prisma ne supporte pas 'mode: insensitive' par défaut sur certaines versions, mais ok ici
                { deposant: { contains: q } },
                { num_enregistrement: { contains: q } }
            ];
        }

        // Filtre Date
        if (minYear || maxYear) {
            where.date = {};
            if (minYear) where.date.gte = `${minYear}-01-01`;
            if (maxYear) where.date.lte = `${maxYear}-12-31`;
        }

        // 3. Gestion du Tri (Order By)
        let orderBy = {};
        if (sort === 'date:desc') {
            orderBy = { date: 'desc' };
        } else if (sort === 'date:asc') {
            orderBy = { date: 'asc' };
        } else {
            // Par défaut, tri par date desc pour avoir les plus récents
            // (La pertinence "relevance" pure est difficile sans moteur dédié type Meili)
            orderBy = { date: 'desc' };
        }

        // 4. Exécution des requêtes en parallèle (Données + Comptage Total)
        const [hits, total] = await Promise.all([
            prisma.inpi_Design.findMany({
                where,
                take: limit,  // Prends-en 12
                skip: offset, // Saute les X premiers (Pagination)
                orderBy,
            }),
            prisma.inpi_Design.count({ where })
        ]);

        const end = Date.now();

        return NextResponse.json({
            hits,
            estimatedTotalHits: total,
            processingTimeMs: end - start
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
