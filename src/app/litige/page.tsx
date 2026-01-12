'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";

export default function LitigePage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  // États pour le formulaire dynamique
  const [formData, setFormData] = useState({
    myAddress: "",
    infringerName: "[NOM DU CONTREFACTEUR]",
    infringerUrl: "https://droitdu.net/",
    workTitle: "[TITRE DE VOTRE CRÉATION]",
    creationDate: "",
    certDate: "",
    certId: "[ID-KEEPPROOF-XXXX]"
  });

  // Pré-remplir avec l'email utilisateur si connecté
  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            myAddress: `${user.fullName || 'Mon Nom'}\n${user.primaryEmailAddress?.emailAddress || 'mon.email@gmail.com'}`
        }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Le modèle dynamique
  const generateLetter = () => {
    return `Objet : Mise en demeure - Contrefaçon de droits d'auteur

DE :
${formData.myAddress || "[VOS COORDONNÉES]"}

À L'ATTENTION DE :
${formData.infringerName}

Le ${new Date().toLocaleDateString('fr-FR')},

Madame, Monsieur,

Je suis l'auteur et le titulaire des droits de propriété intellectuelle concernant l'œuvre suivante : "${formData.workTitle}", créée le ${formData.creationDate || "[DATE]"}.

J'ai constaté que vous utilisez, reproduisez ou diffusez cette œuvre sur votre site/support suivant : 
${formData.infringerUrl} 
et ce, sans mon autorisation préalable.

Je dispose d'une preuve d'antériorité certifiée par tiers de confiance (KeepProof) et ancrée sur la Blockchain, datée du ${formData.certDate || "[DATE CERTIF]"} (Réf: ${formData.certId}), attestant de mes droits sur cette création bien avant votre publication.

En conséquence, je vous mets en demeure de :
1. Cesser immédiatement toute diffusion de mon œuvre.
2. Me confirmer par écrit la suppression des contenus litigieux sous 48 heures.

À défaut de réaction de votre part, je transmettrai ce dossier, accompagné du certificat d'huissier et de la preuve numérique, à mon conseil juridique pour engager des poursuites civiles et pénales à votre encontre.

Dans l'attente de votre confirmation,
Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateLetter());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-blue-500/30">
      
      {/* HEADER */}
      <div className="pt-32 pb-12 px-6 border-b border-white/5 bg-[#111116]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Assistant Juridique
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Générateur de Mise en Demeure</h1>
          <p className="text-xl text-gray-400">
            Remplissez le formulaire ci-dessous pour générer automatiquement votre courrier juridique prêt à l'envoi.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* COLONNE GAUCHE : FORMULAIRE */}
            <div className="space-y-6">
                <div className="bg-[#111116] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">1</span>
                        Les faits
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Votre œuvre volée (Titre)</label>
                            <input type="text" name="workTitle" placeholder="Ex: Logo Restaurant 'Chez Mario'" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-blue-500 outline-none transition-colors" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Date de création approx.</label>
                            <input type="date" name="creationDate" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-blue-500 outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">URL où se trouve la copie</label>
                            <input type="text" name="infringerUrl" placeholder="Ex: https://site-voleur.com/page" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-blue-500 outline-none text-red-300" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#111116] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs">2</span>
                        Votre Preuve KeepProof
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Date du Certificat</label>
                            <input type="date" name="certDate" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-purple-500 outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">ID du Certificat (Optionnel)</label>
                            <input type="text" name="certId" placeholder="KP-2026-XXXX" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-purple-500 outline-none" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#111116] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs">3</span>
                        La Partie Adverse
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Nom du contrefacteur / Société</label>
                            <input type="text" name="infringerName" placeholder="Ex: Jean Dupont ou SARL Voleur" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-red-500 outline-none" onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>

            {/* COLONNE DROITE : APERÇU EN TEMPS RÉEL */}
            <div className="relative">
                <div className="sticky top-32">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-300">Aperçu du courrier</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => window.print()}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-bold border border-white/10"
                            >
                                🖨️ Imprimer
                            </button>
                            <button 
                                onClick={copyToClipboard}
                                className={`px-4 py-1 rounded text-xs font-bold border transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-blue-600 border-blue-600 hover:bg-blue-500'}`}
                            >
                                {copied ? 'Copié !' : 'Copier le texte'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white text-black p-8 rounded-xl shadow-2xl font-serif text-sm leading-relaxed whitespace-pre-wrap min-h-[600px]">
                        {generateLetter()}
                    </div>
                    
                    <p className="text-center text-xs text-gray-500 mt-4 italic">
                        Ce document est généré automatiquement à titre indicatif. <br/>Envoyez-le de préférence en LRAR (Lettre Recommandée avec Accusé de Réception).
                    </p>
                </div>
            </div>

        </div>

        {/* --- LIENS UTILES --- */}
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
                <h4 className="font-bold text-white mb-2">1. Constituer la preuve</h4>
                <p className="text-sm text-gray-400">Téléchargez votre certificat et faites des captures d'écran.</p>
            </div>
            <div>
                <h4 className="font-bold text-white mb-2">2. Envoyer ce courrier</h4>
                <p className="text-sm text-gray-400">Par email pour commencer, puis par recommandé si pas de réponse.</p>
            </div>
            <div>
                <h4 className="font-bold text-white mb-2">3. Contacter l'hébergeur</h4>
                <p className="text-sm text-gray-400">Si le site ne répond pas, écrivez à "abuse@nom-de-l-hebergeur.com".</p>
            </div>
        </div>

      </div>
    </div>
  );
}
