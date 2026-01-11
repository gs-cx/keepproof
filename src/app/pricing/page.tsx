'use client';

import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans flex flex-col">
      
      {/* Pas de Header ici, il est géré automatiquement par le Layout */}

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Une protection simple, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              des tarifs transparents.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pas d'abonnement caché. Payez à l'acte ou prenez un pack pour économiser. 
            Vos preuves sont valables à vie.
          </p>
        </div>

        {/* GRILLE DE PRIX */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          
          {/* OFFRE 1 : PONCTUEL */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 flex flex-col">
            <div className="mb-4">
              <span className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Ponctuel
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">À l'unité</h3>
            <p className="text-gray-400 text-sm mb-6">Idéal pour protéger une création unique.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">4.90€</span>
              <span className="text-gray-500"> /fichier</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-blue-500">✓</span> Certificat d'antériorité PDF
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-blue-500">✓</span> Ancrage Blockchain Polygon
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-blue-500">✓</span> Preuve valable à vie
              </li>
            </ul>
            <Link href="/new" className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center font-bold transition-all">
              Sécuriser maintenant
            </Link>
          </div>

          {/* OFFRE 2 : ÉTUDIANT */}
          <div className="bg-[#111116] border border-yellow-500/30 rounded-2xl p-8 hover:border-yellow-400 transition-all duration-300 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/20"></div>
            
            <div className="mb-4">
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Étudiants
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Pack Campus</h3>
            <p className="text-gray-400 text-sm mb-6">Pour vos mémoires, thèses et projets.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">9.90€</span>
              <div className="text-yellow-500 text-sm font-bold mt-1">Soit 1.98€ / fichier</div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-yellow-500">✓</span> <strong className="text-white">5 Crédits</strong> inclus
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-yellow-500">✓</span> Protection Mémoire & Thèse
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-yellow-500">✓</span> Justificatif demandé
              </li>
            </ul>
            <a href="mailto:etudiants@keepproof.com?subject=Offre Etudiant" className="block w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-center font-bold transition-all">
              Demander le Pack
            </a>
          </div>

          {/* OFFRE 3 : POPULAIRE */}
          <div className="bg-[#111116] border border-blue-500 rounded-2xl p-8 shadow-[0_0_30px_rgba(37,99,235,0.15)] relative flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Populaire
            </div>
            <div className="mb-4 mt-2">
              <span className="bg-blue-900/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Pack Crédits
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pack Créateur</h3>
            <p className="text-gray-400 text-sm mb-6">Pour les designers et créatifs réguliers.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">79.00€</span>
              <div className="text-blue-400 text-sm font-bold mt-1">Soit 3.95€ / fichier (20 crédits)</div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-blue-500">✓</span> <strong className="text-white">20 Certifications</strong> incluses
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-blue-500">✓</span> Crédits sans date d'expiration
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-blue-500">✓</span> Support prioritaire
              </li>
            </ul>
            <Link href="/dashboard" className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-center font-bold transition-all shadow-lg shadow-blue-900/20">
              Commander le Pack
            </Link>
          </div>

          {/* OFFRE 4 : ENTREPRISE */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 flex flex-col">
            <div className="mb-4">
              <span className="bg-purple-900/30 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Enterprise
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">API & Volume</h3>
            <p className="text-gray-400 text-sm mb-6">Pour les plateformes et grands comptes.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">Sur Devis</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-purple-500">⚡</span> Accès API REST complet
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-purple-500">⚡</span> Marque blanche (White label)
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-purple-500">⚡</span> Facturation mensuelle
              </li>
            </ul>
            <a href="mailto:contact@keepproof.com" className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center font-bold transition-all">
              Contacter l'équipe
            </a>
          </div>

        </div>

        {/* FAQ Section Rapide */}
        <div className="max-w-3xl mx-auto mt-24 text-center">
            <h2 className="text-2xl font-bold mb-4">Une question ?</h2>
            <p className="text-gray-400">
                Consultez notre <Link href="/faq" className="text-blue-400 hover:underline">FAQ</Link> ou écrivez-nous directement.
                Nos certifications sont valables juridiquement dans 178 pays (Convention de Berne).
            </p>
        </div>

      </main>

      {/* Pas de Footer ici, il est géré automatiquement par le Layout */}
    </div>
  );
}
