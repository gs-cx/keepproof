'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function LitigePage() {
  const [copied, setCopied] = useState(false);

  const letterTemplate = `Objet : Mise en demeure - Contrefaçon de droits d'auteur
[VOTRE NOM]
[VOTRE ADRESSE]

À l'attention de [NOM DU CONTREFACTEUR],

Le [DATE DU JOUR],

Madame, Monsieur,

Je suis l'auteur et le titulaire des droits de propriété intellectuelle concernant l'œuvre suivante : "[NOM DE VOTRE CRÉATION]", créée le [DATE DE CRÉATION].

J'ai constaté que vous utilisez, reproduisez ou diffusez cette œuvre sur votre site/support [ADRESSE DU SITE LITIGIEUX] sans mon autorisation.

Je dispose d'une preuve d'antériorité certifiée par tiers de confiance (KeepProof) et ancrée sur la Blockchain, datée du [DATE DE VOTRE CERTIFICAT], attestant de mes droits sur cette création bien avant votre publication.

En conséquence, je vous mets en demeure de :
1. Cesser immédiatement toute diffusion de mon œuvre.
2. Me confirmer par écrit la suppression des contenus litigieux sous 48 heures.

À défaut de réaction de votre part, je transmettrai ce dossier, accompagné du certificat d'huissier et de la preuve numérique, à mon conseil juridique pour engager des poursuites civiles et pénales à votre encontre.

Dans l'attente de votre confirmation,
Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[SIGNATURE]`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-blue-500/30">
      <div className="pt-32 pb-12 px-6 border-b border-white/5 bg-[#111116]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Guide Juridique
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Que faire en cas de vol <br/>ou de plagiat ?</h1>
          <p className="text-xl text-gray-400">
            Vous avez constaté qu'un tiers utilise votre création sans autorisation ? <br/>
            Voici la procédure étape par étape pour faire valoir vos droits.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl mb-16 flex gap-4 items-start">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-blue-200">
            <p className="font-bold mb-1">Information importante</p>
            KeepProof fournit la preuve technique (antériorité). Ce guide est une aide informative et ne remplace pas les conseils d'un avocat.
          </div>
        </div>

        <div className="space-y-12 relative before:absolute before:left-4 md:before:left-8 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/10">
          
          {/* ÉTAPE 1 */}
          <div className="relative pl-16 md:pl-24">
            <div className="absolute left-0 md:left-4 top-0 w-8 h-8 md:w-9 md:h-9 bg-[#050507] border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-sm text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]">1</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Constituer la preuve</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Avant de contacter le contrefacteur, figez la situation.
            </p>
            <ul className="bg-[#111116] p-6 rounded-xl border border-white/5 space-y-3 text-sm text-gray-300">
              <li className="flex gap-3"><span>📸</span><span>Faites des <strong>captures d'écran</strong> datées.</span></li>
              <li className="flex gap-3"><span>📥</span><span>Téléchargez votre <strong>Certificat KeepProof</strong> et le fichier original.</span></li>
            </ul>
          </div>

          {/* ÉTAPE 2 */}
          <div className="relative pl-16 md:pl-24">
            <div className="absolute left-0 md:left-4 top-0 w-8 h-8 md:w-9 md:h-9 bg-[#050507] border-2 border-purple-500 rounded-full flex items-center justify-center font-bold text-sm text-purple-500">2</div>
            <h3 className="text-2xl font-bold mb-3 text-white">La Mise en demeure</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Envoyez une lettre recommandée avec accusé de réception (LRAR).
            </p>
            <div className="bg-[#111116] border border-white/10 rounded-xl overflow-hidden mt-6">
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Modèle à copier</span>
                <button onClick={copyToClipboard} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-transparent border-white/20 text-gray-300 hover:bg-white/10'}`}>{copied ? 'Copié !' : 'Copier le texte'}</button>
              </div>
              <pre className="p-6 text-sm text-gray-400 whitespace-pre-wrap font-mono leading-relaxed bg-black/20">{letterTemplate}</pre>
            </div>
          </div>

          {/* ÉTAPE 3 */}
          <div className="relative pl-16 md:pl-24">
            <div className="absolute left-0 md:left-4 top-0 w-8 h-8 md:w-9 md:h-9 bg-[#050507] border-2 border-red-500 rounded-full flex items-center justify-center font-bold text-sm text-red-500">3</div>
            <h3 className="text-2xl font-bold mb-3 text-white">L'Action en Justice</h3>
            <p className="text-gray-400 leading-relaxed">
              Si nécessaire, saisissez le tribunal. Votre certificat KeepProof servira à prouver votre antériorité et renverser la charge de la preuve.
            </p>
          </div>

        </div>

        <div className="mt-20 text-center border-t border-white/10 pt-12">
            <div className="flex gap-4 justify-center">
                <Link href="/dashboard" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all">Voir mes preuves</Link>
                <Link href="/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">Nouvelle protection</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
