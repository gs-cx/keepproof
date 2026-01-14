import React from 'react';
import Link from 'next/link';
// Nous avons retiré l'import de Header car le Menu Burger est maintenant géré par layout.tsx

export default function Home() {
  return (
    <>
      {/* Le Header est désormais géré automatiquement par le fichier layout.tsx pour être responsive */}
      
      <main className="min-h-screen bg-[#050507] text-white overflow-x-hidden selection:bg-blue-500/30">
        
        {/* --- SECTION 1 : HERO --- */}
        {/* Ajustement padding: pt-24 sur mobile, pt-32 sur PC pour éviter que le texte soit sous le menu */}
        <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8">
          
          {/* Correction du blob lumineux pour qu'il ne dépasse pas sur mobile (max-w instead of fixed width) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full opacity-20 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              CERTIFICATION D'ANTÉRIORITÉ
            </div>
            
            {/* Taille de texte ajustée pour mobile (text-4xl) et PC (text-7xl) */}
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">
              Vos idées valent de l'or. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Prouvez qu'elles sont à vous.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Protégez vos créations, fichiers et documents juridiques instantanément grâce à la Blockchain. 
              Une preuve infalsifiable, valable à vie, sans dévoiler vos données.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* BOUTON 1 : PROTEGER */}
              <Link href="/new" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Protéger un fichier
              </Link>

              {/* BOUTON 2 : RECHERCHER (NOUVEAU) */}
              <Link href="/search" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Vérifier une marque
              </Link>

              {/* BOUTON 3 : TARIFS */}
              <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Voir les tarifs
              </Link>
            </div>
          </div>
        </section>

        {/* --- SECTION 2 : BANDEAU DE CONFIANCE --- */}
        <div className="py-10 border-y border-white/5 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold text-gray-600 uppercase tracking-widest mb-8">
              Infrastructures certifiées & Normes de sécurité
            </p>
            
            {/* Flex-wrap permet aux logos de passer à la ligne sur mobile */}
            <div className="flex flex-wrap justify-center items-center gap-y-6 gap-x-8 md:gap-x-12">
              
              {/* 1. POLYGON */}
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-[#8247E5] group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">POLYGON</span>
              </div>

              {/* 2. STRIPE */}
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-[#635BFF] group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">STRIPE</span>
              </div>

              {/* 3. RGPD */}
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-[#003399] group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">RGPD</span>
              </div>

              {/* 4. AES-256 */}
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">AES-256</span>
              </div>

              {/* 5. HEBERGE EN FRANCE */}
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">HÉBERGÉ EN FRANCE</span>
              </div>

              {/* 6. CONFIDENTIALITÉ TOTALE */}
              <div className="flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-yellow-500 group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">CONFIDENTIALITÉ TOTALE</span>
              </div>

            </div>
          </div>
        </div>

        {/* --- SECTION 3 : FEATURES --- */}
        <section className="py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Preuve Juridique</h3>
                <p className="text-gray-400 leading-relaxed">
                  Votre certificat prouve l'existence de votre fichier à une date précise. Idéal pour le droit d'auteur, les contrats et la protection IP.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-2xl hover:border-purple-500/30 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Confidentialité Totale</h3>
                <p className="text-gray-400 leading-relaxed">
                  Vos fichiers ne quittent jamais votre ordinateur. Nous ne certifions que leur empreinte numérique (Hash). Confidentialité garantie.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-2xl hover:border-green-500/30 transition-colors group">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Valable à Vie</h3>
                <p className="text-gray-400 leading-relaxed">
                  Contrairement à un abonnement cloud, une fois ancrée dans la Blockchain, votre preuve est vérifiable éternellement, sans frais cachés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 4 : CTA FINAL --- */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Prêt à sécuriser votre travail ?</h2>
            <p className="text-gray-400 mb-8">
              Rejoignez les créateurs et entreprises qui protègent leur patrimoine intellectuel avec KeepProof.
            </p>
            <Link href="/new" className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
              Commencer maintenant
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
