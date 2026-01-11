'use client';
import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// 👇 L'IMPORT CRITIQUE EST ICI 👇
import { createProofAction } from "../actions";

export default function NewProofPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isComputing, setIsComputing] = useState(false);
  const [msg, setMsg] = useState("Glissez votre fichier sur le disque");

  const processFile = async (selectedFile: File) => {
    if (!user) return;
    setIsComputing(true);
    setMsg("Analyse et sécurisation...");

    try {
        const buffer = await selectedFile.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('fileHash', hashHex);

        setMsg("Écriture sur le disque du serveur...");

        // 👇 C'EST ICI QUE ÇA PLANTAIT AVANT 👇
        const result = await createProofAction(formData);

        if (!result.success) {
            alert("Erreur: " + result.error);
            setIsComputing(false);
            setMsg("Erreur. Réessayez.");
            return;
        }

        setMsg("Sauvegarde terminée !");
        router.push('/dashboard');

    } catch (e: any) {
        console.error(e);
        alert("Erreur technique: " + e.message);
        setIsComputing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#050507] text-white pt-32 px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-12">Nouvelle Protection</h1>
        
        <div className="relative group cursor-pointer flex flex-col items-center">
            <input type="file" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-20" disabled={isComputing} />
            
            {!isComputing ? (
                <>
                    <div className="relative w-64 h-64 mb-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border-4 border-gray-800 transition-all duration-500 group-hover:shadow-[0_0_80px_rgba(37,99,235,0.8)] group-hover:border-blue-500/50 group-hover:scale-105 z-10">
                        <div className="w-20 h-20 rounded-full bg-[#050507] border-4 border-gray-700 group-hover:border-blue-400/50 transition-colors duration-500 relative z-20 shadow-inner"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-180 z-10"></div>
                        <div className="absolute inset-4 rounded-full border border-white/5"></div>
                        <div className="absolute inset-10 rounded-full border border-white/5"></div>
                        <div className="absolute inset-16 rounded-full border border-white/5"></div>
                    </div>

                    <p className="text-2xl font-bold mb-3 transition-all duration-500 group-hover:text-blue-400">{msg}</p>
                    <p className="text-gray-400 max-w-xs mx-auto leading-relaxed text-center transition-all duration-500 group-hover:text-gray-300">Vos fichiers sont chiffrés et stockés physiquement sur votre serveur privé.</p>
                </>
            ) : (
                <div className="z-10 relative flex flex-col items-center">
                    <div className="w-32 h-32 mb-8 rounded-full border-4 border-t-blue-500 border-b-blue-900 border-l-blue-900 border-r-blue-900 animate-spin shadow-[0_0_50px_rgba(37,99,235,0.4)]"></div>
                    <p className="font-mono text-blue-400 text-lg animate-pulse">{msg}</p>
                </div>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
}
