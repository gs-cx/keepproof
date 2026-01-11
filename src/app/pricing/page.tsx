"use client";
import Link from "next/link";
import Header from "@/components/Header"; // On réutilise le header global si possible, sinon on le refait

export default function Pricing() {
  return (
    <>
      <div className="min-h-screen bg-[#050507] text-white selection:bg-blue-500/30">
        
        {/* NAVBAR SIMPLIFIÉE (Si le Header component n'est pas utilisé ici) */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050507]/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tighter">KeepProof</div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                <Link href="/" className="hover:text-white transition">Accueil</Link>
                <Link href="/pricing" className="text-white transition">Tarifs</Link>
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition">Mes Preuves</Link>
            </div>
            <Link href="/new" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
                Protéger un fichier
            </Link>
            </div>
        </nav>

        <div className="pt-40 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center mb-20">
            <h1 className="text-5xl font-bold mb-6">Une protection simple,<br/> des tarifs transparents.</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Pas d'abonnement caché. Payez à l'acte ou prenez un pack pour économiser.
              Vos preuves sont valables à vie.
            </p>
          </div>

          {/* GRILLE DES TARIFS */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            
            {/* OFFRE 1 : À L'UNITÉ */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#111116] hover:border-white/20 transition flex flex-col">
              <div className="mb-4">
                <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Ponctuel
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">À l'unité</h3>
              <p className="text-gray-400 text-sm mb-6">Idéal pour protéger une création unique.</p>
              <div className="text-4xl font-bold mb-6">4.90€ <span className="text-lg text-gray-500 font-normal">/fichier</span></div>
              
              <ul className="space-y-4 mb-8 text-gray-300 text-sm flex-1">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Certificat d'antériorité PDF
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Ancrage Blockchain Polygon
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Preuve valable à vie
                </li>
              </ul>

              <Link href="/new" className="w-full block text-center bg-white/10 hover:bg-white text-white hover:text-black py-3 rounded-lg font-bold transition">
                Sécuriser maintenant
              </Link>
            </div>

            {/* OFFRE 2 : PACK CRÉATEUR (POPULAIRE) */}
            <div className="p-8 rounded-2xl border border-blue-500/50 bg-blue-900/10 hover:border-blue-500 transition flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
              <div className="mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Pack Crédits
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pack Créateur</h3>
              <p className="text-blue-200/70 text-sm mb-6">Pour les designers et créatifs réguliers.</p>
              <div className="text-4xl font-bold mb-2">79.00€</div>
              <p className="text-sm text-blue-400 mb-6 font-medium">Soit 3.95€ / fichier (20 crédits)</p>
              
              <ul className="space-y-4 mb-8 text-gray-300 text-sm flex-1">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <strong>20 Certifications</strong> incluses
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Crédits sans date d'expiration
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Support prioritaire
                </li>
              </ul>

              {/* Redirection mailto en attendant le dev du système de crédits */}
              <a href="mailto:contact@keepproof.com?subject=Commande Pack Créateur 20" className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-blue-900/50">
                Commander le Pack
              </a>
            </div>

            {/* OFFRE 3 : SUR DEVIS */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#111116] hover:border-white/20 transition flex flex-col">
              <div className="mb-4">
                <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Enterprise
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">API & Volume</h3>
              <p className="text-gray-400 text-sm mb-6">Pour les plateformes et grands comptes.</p>
              <div className="text-4xl font-bold mb-6">Sur Devis</div>
              
              <ul className="space-y-4 mb-8 text-gray-300 text-sm flex-1">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Accès API REST complet
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Marque blanche (White label)
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Facturation mensuelle
                </li>
              </ul>

              <a href="mailto:pro@keepproof.com" className="w-full block text-center border border-white/20 hover:bg-white hover:text-black text-white py-3 rounded-lg font-bold transition">
                Contacter l'équipe
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
