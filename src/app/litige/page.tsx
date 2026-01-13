'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";

export default function LitigePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'guide' | 'generator' | 'export'>('guide');
  const [copied, setCopied] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  // --- LOGIQUE GÉNÉRATEUR ---
  const [formData, setFormData] = useState({
    myAddress: "",
    infringerName: "",
    infringerUrl: "",
    workTitle: "",
    creationDate: "",
    certDate: "",
    certId: ""
  });

  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            myAddress: `${user.fullName || 'Mon Nom'}\n${user.primaryEmailAddress?.emailAddress || 'email@exemple.com'}`
        }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateLetter = () => {
    return `Objet : Mise en demeure - Contrefaçon de droits d'auteur

DE :
${formData.myAddress || "[VOS COORDONNÉES]"}

À L'ATTENTION DE :
${formData.infringerName || "[NOM DU CONTREFACTEUR]"}

Le ${new Date().toLocaleDateString('fr-FR')},

Madame, Monsieur,

Je suis l'auteur et le titulaire des droits de propriété intellectuelle concernant l'œuvre suivante : "${formData.workTitle || "[TITRE]"}", créée le ${formData.creationDate || "[DATE]"}.

J'ai constaté que vous utilisez, reproduisez ou diffusez cette œuvre sur votre site/support suivant : 
${formData.infringerUrl || "[URL]"} 
et ce, sans mon autorisation préalable.

Je dispose d'une preuve d'antériorité certifiée par tiers de confiance (KeepProof) et ancrée sur la Blockchain, datée du ${formData.certDate || "[DATE CERTIF]"} (Réf: ${formData.certId || "Non spécifié"}), attestant de mes droits sur cette création bien avant votre publication.

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

  const handleZipDownload = () => {
    setIsGeneratingZip(true);
    // Simulation du processus de génération
    setTimeout(() => {
        setIsGeneratingZip(false);
        alert("Dossier prêt ! Dans une version réelle, le téléchargement du fichier 'Dossier_Contentieux.zip' se lancerait ici.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-blue-500/30">
      
      {/* HEADER COMMUN */}
      <div className="pt-32 pb-8 px-6 border-b border-white/5 bg-[#111116]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Assistant Juridique
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Que faire en cas de vol <br/>ou de plagiat ?</h1>
          
          {/* --- BARRE D'ONGLETS --- */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button 
                onClick={() => setActiveTab('guide')}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${activeTab === 'guide' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            >
                📖 La Procédure
            </button>
            <button 
                onClick={() => setActiveTab('generator')}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border flex items-center gap-2 ${activeTab === 'generator' ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            >
                <span>⚡</span> Générateur Courrier
            </button>
            <button 
                onClick={() => setActiveTab('export')}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border flex items-center gap-2 ${activeTab === 'export' ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            >
                <span>📂</span> Pack Judiciaire
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ==================== ONGLET 1 : LE GUIDE ==================== */}
        {activeTab === 'guide' && (
             <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl mb-12 flex gap-4 items-start">
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
                        Envoyez une lettre recommandée avec accusé de réception (LRAR). C'est souvent suffisant pour faire peur.
                        </p>
                        <button onClick={() => setActiveTab('generator')} className="text-blue-400 hover:text-blue-300 underline text-sm font-bold">
                            → Accéder au générateur de lettre (Onglet 2)
                        </button>
                    </div>

                    {/* ÉTAPE 3 */}
                    <div className="relative pl-16 md:pl-24">
                        <div className="absolute left-0 md:left-4 top-0 w-8 h-8 md:w-9 md:h-9 bg-[#050507] border-2 border-yellow-500 rounded-full flex items-center justify-center font-bold text-sm text-yellow-500">3</div>
                        <h3 className="text-2xl font-bold mb-3 text-white">L'Action en Justice</h3>
                        <p className="text-gray-400 leading-relaxed">
                        Si nécessaire, saisissez le tribunal. Pour cela, préparez un dossier solide pour votre avocat ou huissier.
                        </p>
                         <button onClick={() => setActiveTab('export')} className="text-purple-400 hover:text-purple-300 underline text-sm font-bold">
                            → Préparer le Pack Judiciaire (Onglet 3)
                        </button>
                    </div>
                </div>
             </div>
        )}


        {/* ==================== ONGLET 2 : LE GÉNÉRATEUR ==================== */}
        {activeTab === 'generator' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* FORMULAIRE (GAUCHE) */}
                <div className="space-y-6">
                    <div className="bg-[#111116] p-6 rounded-xl border border-white/10">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">1</span>
                            Les faits
                        </h3>
                        <div className="space-y-4">
                            <input type="text" name="workTitle" value={formData.workTitle} placeholder="Titre de votre œuvre volée" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-blue-500 outline-none" onChange={handleChange} />
                            <input type="date" name="creationDate" value={formData.creationDate} className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-blue-500 outline-none" onChange={handleChange} />
                            <input type="text" name="infringerUrl" value={formData.infringerUrl} placeholder="URL du site plagiaire" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-blue-500 outline-none text-red-300" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="bg-[#111116] p-6 rounded-xl border border-white/10">
                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs">2</span>
                            KeepProof & Adversaire
                        </h3>
                        <div className="space-y-4">
                             <input type="text" name="certId" value={formData.certId} placeholder="ID Certificat (ex: KP-2026-X)" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-purple-500 outline-none" onChange={handleChange} />
                             <input type="text" name="infringerName" value={formData.infringerName} placeholder="Nom du Voleur / Société" className="w-full bg-[#0A0A0F] border border-white/20 rounded p-3 text-sm focus:border-red-500 outline-none" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* APERÇU (DROITE) */}
                <div className="relative">
                    <div className="sticky top-32">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-300">Aperçu du courrier</h3>
                            <div className="flex gap-2">
                                <button onClick={() => window.print()} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-bold border border-white/10">🖨️ Imprimer</button>
                                <button onClick={copyToClipboard} className={`px-4 py-1 rounded text-xs font-bold border transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-blue-600 border-blue-600 hover:bg-blue-500'}`}>{copied ? 'Copié !' : 'Copier'}</button>
                            </div>
                        </div>
                        <div className="bg-white text-black p-8 rounded-xl shadow-2xl font-serif text-sm leading-relaxed whitespace-pre-wrap min-h-[500px]">
                            {generateLetter()}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ==================== ONGLET 3 : PACK JUDICIAIRE ==================== */}
        {activeTab === 'export' && (
             <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold mb-4">Préparez votre dossier pour un Huissier ou Avocat</h2>
                    <p className="text-gray-400">
                        Ce module rassemble toutes les pièces techniques nécessaires pour faciliter le travail des professionnels du droit <br/>
                        et réduire vos frais de constat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* VISUEL DU PACK */}
                    <div className="bg-[#111116] border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors"></div>
                        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">📁</div>
                        <h3 className="text-xl font-bold mb-2">Dossier Contentieux.zip</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Prêt à l'envoi</p>
                    </div>

                    {/* CHECKLIST */}
                    <div className="space-y-4">
                        <div className="bg-[#1A1A20] p-4 rounded-xl flex items-center gap-4 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">✓</div>
                            <div>
                                <div className="font-bold text-sm">Fichier Original</div>
                                <div className="text-xs text-gray-500">Non altéré, avec métadonnées</div>
                            </div>
                        </div>
                        <div className="bg-[#1A1A20] p-4 rounded-xl flex items-center gap-4 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">✓</div>
                            <div>
                                <div className="font-bold text-sm">Certificat d'Antériorité</div>
                                <div className="text-xs text-gray-500">Preuve Blockchain & Hash SHA-256</div>
                            </div>
                        </div>
                         <div className="bg-[#1A1A20] p-4 rounded-xl flex items-center gap-4 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">✓</div>
                            <div>
                                <div className="font-bold text-sm">Fichier Technique JSON</div>
                                <div className="text-xs text-gray-500">Logs, IP, Horodatage technique (Norme Z67-147)</div>
                            </div>
                        </div>
                         <div className="bg-[#1A1A20] p-4 rounded-xl flex items-center gap-4 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">✓</div>
                            <div>
                                <div className="font-bold text-sm">Lettre de Mise en Demeure</div>
                                <div className="text-xs text-gray-500">Copie du courrier généré</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="text-center">
                    <button 
                        onClick={handleZipDownload}
                        disabled={isGeneratingZip}
                        className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 mx-auto transition-all ${isGeneratingZip ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/30 hover:scale-105'}`}
                    >
                        {isGeneratingZip ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Préparation du dossier...
                            </>
                        ) : (
                            <>
                                <span>📥</span> Générer le Pack (.ZIP)
                            </>
                        )}
                    </button>
                    <p className="mt-4 text-xs text-gray-500 max-w-lg mx-auto">
                        Ce fichier ZIP contient tous les éléments techniques. Transmettez-le directement à votre huissier pour accélérer la procédure de constat.
                    </p>
                </div>

             </div>
        )}

      </div>
    </div>
  );
}
