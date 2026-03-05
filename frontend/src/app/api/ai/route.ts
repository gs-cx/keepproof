import { NextRequest, NextResponse } from 'next/server';
import { OllamaEmbeddings } from "@langchain/ollama";
import { ChatOllama } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export async function POST(req: NextRequest) {
  try {
    // 1. On récupère la question du client
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question manquante' }, { status: 400 });
    }

    // 2. Connexion à la Mémoire (ChromaDB)
    const embeddings = new OllamaEmbeddings({
      model: "mistral",
      baseUrl: "http://172.17.0.1:11434", // IP du VPS vue depuis Docker
    });

    const vectorStore = await Chroma.fromExistingCollection(
      embeddings,
      { collectionName: "keepproof-knowledge", url: "http://chromadb:8000" }
    );

    // 3. Recherche des preuves (RAG)
    // On demande les 2 meilleurs morceaux de texte qui correspondent à la question
    const retriever = vectorStore.asRetriever(2);
    const docs = await retriever.invoke(question);
    
    // On assemble le contexte (les textes trouvés)
    const context = docs.map(d => d.pageContent).join("\n\n");

    // 4. Configuration du Cerveau (Mistral)
    const llm = new ChatOllama({
      model: "mistral",
      baseUrl: "http://172.17.0.1:11434",
      temperature: 0, // 0 = Très rigoureux, pas de créativité (bon pour le juridique)
    });

    // 5. L'Instruction (Le Prompt)
    const prompt = PromptTemplate.fromTemplate(`
      Tu es un assistant juridique expert pour la plateforme KeepProof.
      Ta mission est de répondre aux questions des utilisateurs en te basant UNIQUEMENT sur le contexte fourni ci-dessous.
      
      Règles :
      - Si la réponse est dans le contexte, réponds de manière claire, professionnelle et concise (max 3 phrases).
      - Si la réponse n'est pas dans le contexte, dis exactement : "Je ne trouve pas cette information dans ma base juridique actuelle. Veuillez contacter le support."
      - Ne jamais inventer d'information.

      Contexte Juridique :
      {context}

      Question de l'utilisateur : 
      {question}

      Réponse :
    `);

    // 6. Exécution de la chaîne de pensée
    const chain = RunnableSequence.from([
        prompt,
        llm,
        new StringOutputParser()
    ]);

    console.log(`🤖 IA en cours de réflexion sur : "${question}"`);
    
    const response = await chain.invoke({
      context: context,
      question: question
    });

    // 7. On renvoie la réponse au site
    return NextResponse.json({ 
      answer: response, 
      sources: docs.length // On indique combien de sources on a trouvé (debug)
    });

  } catch (error) {
    console.error("❌ Erreur IA:", error);
    return NextResponse.json({ error: 'Erreur de traitement IA' }, { status: 500 });
  }
}
