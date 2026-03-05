'use client';

import React, { useState } from 'react';

// Composant pour une question individuelle
const FaqItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
          {question}
        </span>
        <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-400 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FaqSection = () => {
  return (
    <section className="py-24 bg-black" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Centre d'Aide & FAQ
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Toutes les réponses sur le fonctionnement, la sécurité juridique et la technologie de KeepProof.
          </p>
        </div>

        {/* --- SECTION 1 : COMPRENDRE (Style Jaune) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1A1A1A] border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1.5 1.5-2.5 1.5-3.5a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 1 .5 2 1.5 3.5 2.5 1.8 3.5 2.5 3.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Comprendre KeepProof</h3>
          </div>
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 sm:p-8">
            <FaqItem question="Qu'est-ce que KeepProof exactement ?" answer="KeepProof est un service de certification d'antériorité basé sur la Blockchain. Nous créons une empreinte numérique unique de vos fichiers pour prouver qu'ils existaient à une date précise." />
            <FaqItem question="Pourquoi ne pas simplement m'envoyer un e-mail à moi-même ?" answer="L'e-mail est falsifiable. Une preuve Blockchain est immuable, mathématiquement vérifiable par n'importe qui et reconnue mondialement." />
            <FaqItem question="Est-ce la même chose qu'un brevet ?" answer="Non. Un brevet protège une invention technique. KeepProof protège le Droit d'Auteur (créations graphiques, code, musique, textes) en prouvant l'antériorité." />
            <FaqItem question="Qui a besoin de ce service ?" answer="Les designers, développeurs, musiciens, auteurs, chercheurs et startups. Toute personne souhaitant protéger sa propriété intellectuelle." />
            <FaqItem question="Combien ça coûte ?" answer="Nous proposons des certifications à l'unité (4.90€) pour des besoins ponctuels, ou des packs crédits dégressifs pour les professionnels." />
          </div>
        </div>

        {/* --- SECTION 2 : JURIDIQUE (Style Bleu) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1A1A1A] border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v18" />
                <path d="M16 16a4 4 0 1 0-8 0" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Valeur Juridique</h3>
          </div>
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 sm:p-8">
            <FaqItem question="Quelle est la valeur juridique du certificat ?" answer="Le certificat KeepProof constitue un commencement de preuve par écrit au sens du droit européen (Règlement eIDAS). Il permet d'attester de l'intégrité du fichier et de sa date." />
            <FaqItem question="Puis-je utiliser le certificat à l'international ?" answer="Oui. La technologie Blockchain est reconnue internationalement et la Convention de Berne protège le droit d'auteur dans plus de 170 pays." />
          </div>
        </div>

        {/* --- SECTION 3 : SÉCURITÉ (Style Vert) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1A1A1A] border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Sécurité & Confidentialité</h3>
          </div>
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 sm:p-8">
            <FaqItem question="Mes fichiers sont-ils stockés chez vous ?" answer="Non, jamais. Vos fichiers originaux ne quittent jamais votre ordinateur. Seule l'empreinte numérique (le hash) est envoyée." />
            <FaqItem question="Que se passe-t-il si KeepProof ferme ?" answer="Votre preuve reste valide à vie car elle est inscrite dans la Blockchain publique. Vous pourrez toujours vérifier votre certificat indépendamment de nous." />
          </div>
        </div>

        {/* --- SECTION 4 : TECHNIQUE (Style Violet) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1A1A1A] border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Technique & Utilisation</h3>
          </div>
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 sm:p-8">
            <FaqItem question="Quels types de fichiers sont acceptés ?" answer="Tous : PDF, JPG, PNG, MP3, WAV, ZIP, Code source... La taille maximale par fichier dépend de votre navigateur, mais le processus est instantané." />
            <FaqItem question="Quelle Blockchain utilisez-vous ?" answer="Nous utilisons Polygon (MATIC) pour sa rapidité, son faible impact carbone et sa sécurité héritée d'Ethereum." />
          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
