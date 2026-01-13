'use client';
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
// Footer géré par layout.tsx

export default function ComparisonPage() {
  
  // Fonction pour le scroll doux vers les ancres
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-blue-500/30">
      
      {/* HERO SECTION */}
      <div className="pt-32 pb-20 px-6 border-b border-white/5 bg-[#111116]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
            Guide de choix
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Quelle protection choisir <br/>pour vos créations ?
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Huissier, Recommandé, Blockchain... Chaque méthode a son utilité.<br/>
            Comparons objectivement avec les textes de loi à l'appui.
          </p>
        </div>
      </div>

      {/* TABLEAU COMPARATIF */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                <th className="py-6 px-4 font-medium">Critères</th>
                <th className="py-6 px-4 font-medium text-center">L'Huissier de Justice</th>
                <th className="py-6 px-4 font-medium text-center">Le Recommandé</th>
                <th className="py-6 px-4 font-medium text-center">Le Cloud</th>
                <th className="py-6 px-4 font-bold text-center text-blue-400 bg-blue-500/5 rounded-t-xl border-t border-x border-blue-500/20">
                  KeepProof
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {/* PRIX */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-6 px-4 font-bold">Investissement</td>
                <td className="py-6 px-4 text-center text-gray-400">Important (~300€)</td>
                <td className="py-6 px-4 text-center text-gray-400">Modéré (15€ / unité)</td>
                <td className="py-6 px-4 text-center text-green-400">Gratuit</td>
                <td className="py-6 px-4 text-center font-bold text-white bg-blue-500/5 border-x border-blue-500/20">
                  Inclus (Illimité)
                </td>
              </tr>
              
              {/* VALIDITÉ (Lien vers Ancre 1) */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-6 px-4 font-bold">Valeur Juridique</td>
                <td className="py-6 px-4 text-center text-green-400">Optimale (Acte Authentique)</td>
                <td className="py-6 px-4 text-center text-yellow-400">Forte</td>
                <td className="py-6 px-4 text-center text-red-400">Faible</td>
                <td className="py-6 px-4 text-center font-bold text-white bg-blue-500/5 border-x border-blue-500/20 cursor-pointer hover:bg-blue-500/10 transition"
                    onClick={() => scrollToSection('ref-juridique')}>
                  <span className="border-b border-dashed border-blue-400 pb-0.5">Forte (Conforme eIDAS) ⓘ</span>
                </td>
              </tr>

              {/* USAGE (Lien vers Ancre 2) */}
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-6 px-4 font-bold">Usage idéal</td>
                <td className="py-6 px-4 text-center text-sm">Litige avéré</td>
                <td className="py-6 px-4 text-center text-sm">Envoi unique</td>
                <td className="py-6 px-4 text-center text-sm">Stockage</td>
                <td className="py-6 px-4 text-center font-bold text-blue-300 text-sm bg-blue-500/5 border-x border-blue-500/20 cursor-pointer hover:bg-blue-500/10 transition"
                    onClick={() => scrollToSection('ref-usage')}>
                  <span className="border-b border-dashed border-blue-400 pb-0.5">Protection Préventive ⓘ</span>
                </td>
              </tr>

               {/* RAPIDITÉ (Lien vers Ancre 3) */}
               <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-6 px-4 font-bold">Intégrité</td>
                <td className="py-6 px-4 text-center text-gray-400">Constat humain</td>
                <td className="py-6 px-4 text-center text-gray-400">Cachet Poste</td>
                <td className="py-6 px-4 text-center text-green-400">Logs serveur</td>
                <td className="py-6 px-4 text-center font-bold text-green-400 bg-blue-500/5 border-x border-b border-blue-500/20 rounded-b-xl cursor-pointer hover:bg-blue-500/10 transition"
                    onClick={() => scrollToSection('ref-technique')}>
                  <span className="border-b border-dashed border-green-500 pb-0.5">Infalsifiable ⓘ</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-center text-xs text-gray-500 mt-4">ⓘ Cliquez sur les éléments soulignés pour voir la référence légale.</p>
        </div>
      </div>

      {/* SECTION PREUVES JURIDIQUES (NOUVEAU) */}
      <div className="bg-[#111116] py-24 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Références Légales & Justificatifs</h2>

          {/* PREUVE 1 : VALEUR JURIDIQUE */}
          <div id="ref-juridique" className="mb-12 p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl">⚖️</span>
              <h3 className="text-xl font-bold text-blue-400">Pourquoi la preuve KeepProof est-elle valide ?</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Contrairement aux idées reçues, la loi française reconnaît parfaitement la preuve numérique si elle garantit l'intégrité de l'acte et l'identité de l'auteur.
            </p>
            <div className="bg-[#050507] p-4 rounded border-l-4 border-blue-500 italic text-gray-400 text-sm">
              <p className="mb-2"><strong>Article 1366 du Code Civil :</strong></p>
              "L'écrit électronique a la même force probante que l'écrit sur support papier, sous réserve que puisse être dûment identifiée la personne dont il émane et qu'il soit établi et conservé dans des conditions de nature à en garantir l'intégrité."
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">Source : Légifrance / Code Civil</p>
          </div>

          {/* PREUVE 2 : USAGE (DROIT D'AUTEUR) */}
          <div id="ref-usage" className="mb-12 p-8 rounded-2xl border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl">🎨</span>
              <h3 className="text-xl font-bold text-purple-400">Pourquoi protéger dès la création ?</h3>
            </div>
            <p className="text-gray-300 mb-4">
              En France, il n'y a pas besoin de "déposer" une œuvre pour qu'elle soit protégée. La protection naît automatiquement. Le seul problème est de <strong>prouver la date</strong>. C'est le rôle exclusif de KeepProof.
            </p>
            <div className="bg-[#050507] p-4 rounded border-l-4 border-purple-500 italic text-gray-400 text-sm">
              <p className="mb-2"><strong>Article L111-1 du Code de la Propriété Intellectuelle :</strong></p>
              "L'auteur d'une œuvre de l'esprit jouit sur cette œuvre, du seul fait de sa création, d'un droit de propriété incorporelle exclusif et opposable à tous."
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">Source : Légifrance / CPI</p>
          </div>

          {/* PREUVE 3 : TECHNIQUE (INTEGRITÉ) */}
          <div id="ref-technique" className="p-8 rounded-2xl border border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl">🔒</span>
              <h3 className="text-xl font-bold text-green-400">Pourquoi est-ce infalsifiable ?</h3>
            </div>
            <p className="text-gray-300 mb-4">
              KeepProof utilise l'ancrage Blockchain (Polygon). Contrairement à un serveur privé, la Blockchain est un registre public inaltérable reconnu par le règlement européen eIDAS comme un procédé fiable.
            </p>
            <div className="bg-[#050507] p-4 rounded border-l-4 border-green-500 italic text-gray-400 text-sm">
              <p className="mb-2"><strong>Règlement (UE) n° 910/2014 (eIDAS) - Article 25 :</strong></p>
              "L’effet juridique et la recevabilité d’une signature électronique comme preuve en justice ne peuvent être refusés au seul motif que cette signature se présente sous une forme électronique."
            </div>
             <p className="text-xs text-gray-500 mt-2 text-right">Source : Journal Officiel de l'UE</p>
          </div>

        </div>
      </div>

      {/* DÉTAILS DES ALTERNATIVES */}
      <div className="bg-[#0A0A0F] py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* ANALYSE 1 : HUISSIER */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-3xl flex-shrink-0">⚖️</div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Le Commissaire de Justice (Huissier)</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                C'est l'étalon-or de la preuve. L'officier ministériel dresse un procès-verbal de constat qui a une force probante quasi-absolue devant les tribunaux.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                <p className="text-gray-300 text-sm">
                  <strong>Notre conseil :</strong> Faites appel à un huissier pour constater une contrefaçon <em>externe</em> (le constat d'achat). Utilisez KeepProof en amont pour certifier vos créations (le constat d'origine).
                </p>
              </div>
            </div>
          </div>

          {/* ANALYSE 2 : ENVELOPPE */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-3xl flex-shrink-0">✉️</div>
            <div>
              <h3 className="text-2xl font-bold mb-3">L'Enveloppe Scellée & e-Soleau</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Une méthode éprouvée gérée par l'INPI. Elle permet de dater une création de manière certaine pour une durée de 5 ans.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* CTA FINAL */}
      <div className="text-center py-24 px-6 border-t border-white/5">
        <h2 className="text-3xl font-bold mb-8">La sécurité de l'Huissier, la simplicité du Cloud</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Protégez vos créations conformément à l'article L111-1 du CPI, sans vous ruiner.
        </p>
        <Link href="/new" className="inline-block px-10 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105">
            Protéger mon travail maintenant
        </Link>
      </div>

    </div>
    </>
  );
}
