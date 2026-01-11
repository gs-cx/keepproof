import { NextRequest, NextResponse } from 'next/server';

// 1. BASE DE DONNEES
const legalCorpus = [
  {
    id: "civil_1366",
    source: "Code Civil - Article 1366",
    themes: ["ecrit", "numerique", "preuve"],
    text_officiel: "L'écrit électronique a la même force probante que l'écrit papier...",
    explication: "Valeur identique au papier si identité et intégrité prouvées."
  },
  {
    id: "cpi_335_2",
    source: "Code Propriété Intellectuelle - L.335-2",
    themes: ["contrefacon", "delit", "copie"],
    text_officiel: "La contrefaçon est un délit puni de 3 ans d'emprisonnement.",
    explication: "Copier est un délit pénal grave."
  }
];

const generalBase = [
  { keywords: ["cout", "tarif", "prix"], response: "💰 **Tarifs :** Inscription gratuite. Paiement à l'acte." },
  { keywords: ["stock", "cloud", "confiden"], response: "🔒 **Confidentialité :** Zero-Knowledge. Pas de stockage." }
];

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[?!.,;:'"()]/g, " ");
}

// 2. CERVEAU
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cleanQuestion = normalizeText(body?.question || "");
    
    console.log("🔹 Question :", body?.question);
    let reponseFinale = "";

    // Recherche Juridique
    let bestLaw = null;
    let maxScore = 0;
    for (const article of legalCorpus) {
      let score = 0;
      for (const theme of article.themes) {
        if (cleanQuestion.includes(normalizeText(theme))) score += 10;
      }
      if (score > maxScore) { maxScore = score; bestLaw = article; }
    }

    if (maxScore >= 10 && bestLaw) {
      reponseFinale = `⚖️ **Cadre Juridique**\n\nSource : **${bestLaw.source}**\n_"${bestLaw.text_officiel}"_\n\n👉 **Analyse :**\n${bestLaw.explication}`;
    }

    // Recherche SAV
    if (!reponseFinale) {
      for (const entry of generalBase) {
        for (const kw of entry.keywords) {
          if (cleanQuestion.includes(normalizeText(kw))) reponseFinale = entry.response;
        }
      }
    }

    if (!reponseFinale) reponseFinale = "🤔 Je n'ai pas compris. Essayez 'prix' ou 'preuve'.";

    return NextResponse.json({ answer: reponseFinale });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ answer: "Erreur interne." }, { status: 500 });
  }
}
