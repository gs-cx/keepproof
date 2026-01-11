'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';

// FAQ Statique (Fallback)
const staticFaqs = [
  {
    question: "Quelle est la valeur juridique d'une preuve KeepProof ?",
    answer: "KeepProof génère une preuve d'antériorité numérique conforme au règlement eIDAS. En ancrant l'empreinte de votre fichier sur la Blockchain publique (Polygon), nous créons un horodatage certifié et infalsifiable."
  },
  {
    question: "Mes fichiers sont-ils stockés sur vos serveurs ?",
    answer: "Non, jamais. Nous utilisons une technologie de 'Confidentialité Totale'. Seule l'empreinte numérique (Hash) est envoyée. Votre fichier ne quitte jamais votre ordinateur."
  },
  {
    question: "Combien de temps la preuve est-elle valable ?",
    answer: "Votre preuve est valable à vie. L'empreinte est gravée dans la Blockchain publique indéfiniment."
  },
  {
    question: "Puis-je protéger des fichiers audio ou vidéo ?",
    answer: "Oui, tous les types de fichiers (Audio, Image, PDF, Code) sont acceptés."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  // États pour l'IA
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fonction pour interroger l'IA
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiResponse("");
    setError("");

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();

      if (res.ok) {
        setAiResponse(data.answer);
      } else {
        setError("Désolé, je n'ai pas pu joindre le cerveau juridique. Réessayez plus tard.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-blue-500/30">
      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* --- ZONE 1 : L'IA JURIDIQUE --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6">
            ✨ NOUVEAU : ASSISTANT IA
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Une question juridique ?</h1>
          <p className="text-gray-400 text-lg mb-8">
            Demandez à notre IA experte. Elle connaît tout sur la protection intellectuelle.
          </p>

          {/* Barre de recherche IA */}
          <form onSubmit={handleAskAI} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Est-ce que mon logo est protégé à vie ?"
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl py-4 pl-6 pr-32 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xl"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              )}
              <span className="hidden sm:inline">Demander</span>
            </button>
          </form>

          {/* Réponse de l'IA */}
          {(aiResponse || error) && (
            <div className="mt-8 text-left max-w-2xl mx-auto animate-fade-in-up">
              <div className={`p-6 rounded-2xl border ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-gradient-to-b from-blue-900/10 to-transparent border-blue-500/30'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${error ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {error ? '!' : '🤖'}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold mb-2 uppercase tracking-wide ${error ? 'text-red-400' : 'text-blue-400'}`}>
                      {error ? 'Erreur' : 'Réponse de l\'Assistant KeepProof'}
                    </h3>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {error || aiResponse}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/5 my-16"></div>

        {/* --- ZONE 2 : FAQ CLASSIQUE --- */}
        <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes</h2>
        <div className="space-y-4">
          {staticFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-[#0A0A0F] border rounded-2xl transition-all duration-300 overflow-hidden ${
                openIndex === index ? 'border-white/20' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className={`font-medium ${openIndex === index ? 'text-white' : 'text-gray-300'}`}>
                  {faq.question}
                </span>
                <span className={`text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-45 text-blue-500' : 'text-gray-500'}`}>+</span>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
