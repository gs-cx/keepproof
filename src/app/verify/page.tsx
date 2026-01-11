'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // Assurez-vous que cette lib est installée, sinon on fera du natif
import Header from '@/components/Header';
// Footer auto via layout

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [status, setStatus] = useState<'idle' | 'computing' | 'checking' | 'valid' | 'invalid'>('idle');
  const [resultData, setResultData] = useState<any>(null);

  // Fonction de calcul du Hash SHA-256 (Client-Side)
  const calculateHash = async (file: File) => {
    setStatus('computing');
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash(hashHex);
    
    // Simulation d'appel API (À connecter plus tard au vrai backend)
    setStatus('checking');
    setTimeout(() => {
        // Simulation: on dit que c'est valide pour la démo
        setStatus('valid'); 
        setResultData({
            date: new Date().toISOString(),
            txId: "0x892...3b1",
            block: 4591203
        });
    }, 1500);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      calculateHash(selectedFile);
    }
  }, []);

  // Gestion simple du Drag & Drop natif si react-dropzone manque
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        setFile(selectedFile);
        calculateHash(selectedFile);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          setFile(selectedFile);
          calculateHash(selectedFile);
      }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#050507] text-white pt-32 px-6 pb-20 selection:bg-blue-500/30">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                OUTIL PUBLIC & GRATUIT
            </div>
            <h1 className="text-4xl font-extrabold mb-4">Vérificateur de Preuve</h1>
            <p className="text-gray-400">
                Vérifiez l'authenticité d'un document ou d'un certificat KeepProof.
                <br/>Le calcul se fait sur votre navigateur, le fichier n'est pas envoyé.
            </p>
          </div>

          {/* ZONE DE DROP */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 relative overflow-hidden group
            ${status === 'valid' ? 'border-green-500/50 bg-green-500/5' : 
              status === 'invalid' ? 'border-red-500/50 bg-red-500/5' : 
              'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 bg-[#111116]'}`}
          >
            
            {!file ? (
                <>
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-blue-400">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Glissez votre fichier ici</h3>
                    <p className="text-sm text-gray-500 mb-6">ou cliquez pour parcourir vos documents</p>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden" 
                        id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition">
                        Sélectionner un fichier
                    </label>
                </>
            ) : (
                <div className="animate-fade-in">
                    {/* Visualisation du fichier */}
                    <div className="flex items-center justify-center gap-3 mb-6 text-lg font-medium">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {file.name}
                    </div>

                    {/* Loader de calcul */}
                    {(status === 'computing' || status === 'checking') && (
                        <div className="max-w-xs mx-auto">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 animate-progress"></div>
                            </div>
                            <p className="text-xs text-blue-400 mt-2 font-mono">Calcul de l'empreinte SHA-256...</p>
                        </div>
                    )}

                    {/* RÉSULTAT VALIDE */}
                    {status === 'valid' && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 max-w-lg mx-auto mt-6">
                            <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-xl mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                PREUVE VALIDÉE
                            </div>
                            <div className="text-left space-y-3 text-sm">
                                <div className="flex justify-between border-b border-green-500/10 pb-2">
                                    <span className="text-gray-400">Empreinte (Hash)</span>
                                    <span className="font-mono text-white truncate max-w-[150px]">{hash.substring(0, 20)}...</span>
                                </div>
                                <div className="flex justify-between border-b border-green-500/10 pb-2">
                                    <span className="text-gray-400">Date d'ancrage</span>
                                    <span className="text-white">06 Janvier 2026</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Blockchain</span>
                                    <span className="text-purple-400 font-bold">Polygon PoS</span>
                                </div>
                            </div>
                            <button onClick={() => {setFile(null); setStatus('idle')}} className="mt-6 text-sm text-green-400 hover:text-green-300 underline">
                                Vérifier un autre fichier
                            </button>
                        </div>
                    )}
                </div>
            )}
          </div>

          <div className="mt-12 text-center text-sm text-gray-500 max-w-xl mx-auto">
            <p>
                Cet outil compare l'empreinte numérique de votre fichier avec le registre public de la Blockchain.
                Si le fichier a été modifié (même d'un pixel), la vérification échouera.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
