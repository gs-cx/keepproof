"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Pour rediriger vers le dashboard après

export default function NewProofPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'hashing' | 'anchoring' | 'success'>('idle');
  const [txHash, setTxHash] = useState('');
  const router = useRouter();

  // Simulation du processus de dépôt
  const handleSimulateDeposit = async () => {
    if (!file) return;

    // 1. Simulation Upload
    setStatus('uploading');
    await new Promise(r => setTimeout(r, 800));

    // 2. Simulation Hash
    setStatus('hashing');
    await new Promise(r => setTimeout(r, 800));

    // 3. Simulation Blockchain
    setStatus('anchoring');
    
    try {
      // Simulation appel API
      await new Promise(r => setTimeout(r, 1500));

      // Génération des fausses données
      const fakeHash = "0x" + Math.random().toString(16).substring(2, 40) + "..." + Math.random().toString(16).substring(2, 5);
      const today = new Date();
      const dateStr = today.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      setTxHash(fakeHash);
      setStatus('success');

      // --- SAUVEGARDE DANS LE NAVIGATEUR (Simulation BDD) ---
      const newDoc = {
        id: Date.now(), // Un ID unique basé sur l'heure
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " KB",
        date: dateStr,
        hash: fakeHash,
        status: "Certifié"
      };

      // On récupère la liste existante ou on crée une liste vide
      const existingDocs = JSON.parse(localStorage.getItem('keepproof_docs') || '[]');
      // On ajoute le nouveau au début
      localStorage.setItem('keepproof_docs', JSON.stringify([newDoc, ...existingDocs]));
      // -------------------------------------------------------

    } catch (e) {
      alert("Erreur de simulation");
      setStatus('idle');
    }
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-4">
      
      {/* Bouton retour */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full hover:bg-white/10">
          ← Retour au Dashboard
        </Link>
      </div>

      <div className="max-w-md w-full bg-[#0A0A0F] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-bold mb-2">Déposer une preuve</h1>
          <p className="text-gray-400 text-sm">Mode Simulation : Polygon Amoy</p>
        </div>

        {/* ÉTAT 1 : UPLOAD */}
        {status === 'idle' && (
          <div className="space-y-6 relative z-10">
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-blue-500/50 transition-all cursor-pointer bg-white/5 group">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="hidden" 
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                {file ? (
                  <div className="text-blue-400 font-medium break-all bg-blue-500/10 p-2 rounded-lg">
                    {file.name}
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      Cliquez pour choisir un fichier
                    </p>
                  </>
                )}
              </label>
            </div>

            <button
              onClick={handleSimulateDeposit}
              disabled={!file}
              className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 ${
                file 
                  ? 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10' 
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              Lancer la certification
            </button>
          </div>
        )}

        {/* ÉTAT 2 : CHARGEMENT */}
        {(status === 'uploading' || status === 'hashing' || status === 'anchoring') && (
          <div className="text-center py-10 space-y-6 relative z-10">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Traitement...</h3>
              <p className="text-blue-400 text-sm animate-pulse">
                {status === 'anchoring' ? "Écriture Blockchain..." : "Calcul de l'empreinte..."}
              </p>
            </div>
          </div>
        )}

        {/* ÉTAT 3 : SUCCÈS */}
        {status === 'success' && (
          <div className="text-center py-4 space-y-6 relative z-10">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 ring-1 ring-green-500/20">
              ✓
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Preuve Ancrée !</h2>
              <p className="text-gray-400 text-sm">Disponible dans votre Dashboard.</p>
            </div>

            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20"
            >
              Voir dans mon Dashboard →
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
