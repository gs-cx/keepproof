"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// --- TYPES ---
type Doc = {
  id: number;
  name: string;
  size: string;
  date: string;
  hash: string;
  status: string;
  folderId?: string; 
};

type Folder = {
  id: string;
  name: string;
  color: string;
};

export default function Dashboard() {
  // --- ETATS ---
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'clients', name: 'Projets Clients', color: 'bg-purple-500' },
    { id: 'admin', name: 'Administratif', color: 'bg-emerald-500' }
  ]);
  const [activeFilter, setActiveFilter] = useState<string>('all'); 

  // --- CHARGEMENT ---
  useEffect(() => {
    const savedDocs = localStorage.getItem('keepproof_docs');
    const demoDocs: Doc[] = [
      { id: 1, name: "H_18663393.pdf", size: "27 KB", date: "11/01/2026", hash: "0x7f...3a", status: "Certifié", folderId: 'clients' },
      { id: 2, name: "Lettre AR.pdf", size: "217 KB", date: "09/01/2026", hash: "0x8b...9c", status: "Certifié", folderId: 'admin' },
    ];
    
    if (savedDocs) {
      setDocuments([...JSON.parse(savedDocs), ...demoDocs]);
    } else {
      setDocuments(demoDocs);
    }

    const savedFolders = localStorage.getItem('keepproof_folders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // --- SAUVEGARDE HELPER ---
  const saveDocs = (newDocs: Doc[]) => {
    setDocuments(newDocs);
    const docsToSave = newDocs.filter(d => d.id > 1000); 
    localStorage.setItem('keepproof_docs', JSON.stringify(docsToSave));
  };

  const saveFolders = (newFolders: Folder[]) => {
    setFolders(newFolders);
    localStorage.setItem('keepproof_folders', JSON.stringify(newFolders));
  };

  // --- ACTIONS FICHIERS ---
  const handleDelete = (id: number) => {
    if (confirm("⚠️ Attention : Vous allez retirer ce fichier de votre tableau de bord.\n\nNote : La preuve d'antériorité restera gravée à vie dans la Blockchain, mais vous perdrez le raccourci ici.\n\nContinuer ?")) {
      saveDocs(documents.filter(doc => doc.id !== id));
    }
  };

  const handleRename = (id: number, currentName: string) => {
    const newName = prompt("Renommer le fichier (pour votre organisation uniquement) :", currentName);
    if (newName) saveDocs(documents.map(doc => doc.id === id ? { ...doc, name: newName } : doc));
  };

  const handleMove = (id: number) => {
    const folderList = folders.map(f => `- ${f.name} (tapez: ${f.id})`).join('\n');
    const targetId = prompt(`Dans quel dossier ranger ce fichier ?\n\nCodes disponibles :\n${folderList}\n\n(Tapez 'all' pour le sortir de tout dossier)`);
    
    if (targetId) {
      const foundFolder = folders.find(f => f.id === targetId || f.name.toLowerCase() === targetId.toLowerCase());
      const finalId = foundFolder ? foundFolder.id : (targetId === 'all' ? undefined : null);

      if (finalId !== null) {
        saveDocs(documents.map(doc => doc.id === id ? { ...doc, folderId: finalId as string } : doc));
      } else {
        alert("Dossier introuvable.");
      }
    }
  };

  // --- ACTIONS DOSSIERS ---
  const handleCreateFolder = () => {
    const name = prompt("Nom du nouveau dossier (ex: Contrats, Photos...) :");
    if (name) {
      const newFolder = { id: name.toLowerCase().replace(/\s/g, '_'), name: name, color: 'bg-blue-500' };
      saveFolders([...folders, newFolder]);
    }
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm("Supprimer ce dossier ?\nLes fichiers qu'il contient ne seront PAS supprimés, ils reviendront dans 'Tous les fichiers'.")) {
      saveFolders(folders.filter(f => f.id !== id));
      setActiveFilter('all');
      saveDocs(documents.map(d => d.folderId === id ? { ...d, folderId: undefined } : d));
    }
  };

  const handleRenameFolder = (id: string, currentName: string) => {
    const newName = prompt("Nouveau nom pour ce dossier :", currentName);
    if (newName) {
      saveFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
    }
  };

  // --- FILTRAGE ---
  const filteredDocs = activeFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.folderId === activeFilter);

  return (
    <div className="min-h-screen bg-[#050507] text-white flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 hidden md:flex flex-col border-r border-white/5 p-6 min-h-screen bg-[#0A0A0F]">
        <div className="mb-8 px-2" title="Retour à la page d'accueil">
           <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold">K</div>
             KeepProof
           </Link>
        </div>

        <div className="mb-8" title="Cliquez ici pour certifier un nouveau document sur la Blockchain">
          <Link href="/new" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center transition shadow-lg shadow-blue-900/20 active:scale-95">
            + Nouvelle Preuve
          </Link>
        </div>

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-4">EXPLORATEUR</div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          <div 
            onClick={() => setActiveFilter('all')}
            title="Afficher la liste complète de tous vos documents certifiés, sans filtre."
            className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 cursor-pointer border transition-all ${
              activeFilter === 'all' ? 'bg-white/10 text-white border-white/10' : 'text-gray-400 border-transparent hover:bg-white/5'
            }`}
          >
             📁 Tous les fichiers
          </div>
          
          <div className="pt-6 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mt-2">
            VOS DOSSIERS
          </div>
          
          {folders.map(folder => (
            <div 
              key={folder.id}
              title={`Cliquez pour voir uniquement les documents du dossier "${folder.name}"`}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                 activeFilter === folder.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'
              }`}
              onClick={() => setActiveFilter(folder.id)}
            >
               <div className="flex items-center gap-2 truncate">
                 <span className={`w-2 h-2 rounded-full ${folder.color} flex-shrink-0`}></span>
                 <span className="truncate text-sm font-medium">{folder.name}</span>
               </div>
               
               {/* BOUTONS DOSSIERS */}
               <div className="flex items-center gap-1 opacity-100">
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleRenameFolder(folder.id, folder.name); }}
                   className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition"
                   title="Renommer ce dossier"
                 >
                   ✏️
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                   className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition"
                   title="Supprimer ce dossier (les fichiers seront conservés)"
                 >
                   🗑️
                 </button>
               </div>
            </div>
          ))}
          
          <button 
            onClick={handleCreateFolder}
            title="Créer une nouvelle catégorie pour organiser vos preuves"
            className="w-full text-left text-gray-500 hover:text-blue-400 px-4 py-3 text-sm flex items-center gap-2 transition mt-2 hover:bg-white/5 rounded-lg border border-dashed border-white/5 hover:border-blue-500/30"
          >
             <span>+</span> Créer un dossier
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {activeFilter === 'all' ? 'Tous les fichiers' : folders.find(f => f.id === activeFilter)?.name || 'Dossier'}
            </h1>
            <p className="text-gray-400 text-sm">Gérez vos preuves sécurisées sur Polygon.</p>
          </div>
          <span title="Nombre total de documents dans cette vue" className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 cursor-help">
            {filteredDocs.length} fichier(s)
          </span>
        </div>

        <div className="space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-gray-500">Ce dossier est vide.</p>
              <button onClick={() => setActiveFilter('all')} className="text-blue-400 text-sm mt-2 hover:underline">Voir tous les fichiers</button>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="group bg-[#0A0A0F] border border-white/5 hover:border-blue-500/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/[0.02]">
                
                <div title="Format du fichier : PDF" className="w-12 h-12 bg-[#1A1A20] rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs border border-white/5 cursor-help">PDF</div>

                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-bold text-white truncate text-sm md:text-base cursor-pointer hover:text-blue-400" 
                    onClick={() => handleRename(doc.id, doc.name)}
                    title="Cliquez pour renommer ce fichier"
                  >
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span title={`Date d'ancrage dans la Blockchain : ${doc.date}`}>{doc.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span title={`Empreinte numérique unique (Hash) : ${doc.hash}`} className="font-mono bg-white/5 px-1.5 rounded text-gray-400 cursor-help">
                      {doc.hash.substring(0, 10)}...
                    </span>
                  </div>
                </div>

                {/* ACTIONS FICHIERS */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleMove(doc.id)} 
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition" 
                    title="Ranger ce fichier dans un dossier spécifique"
                  >
                    📂
                  </button>
                  <button 
                    onClick={() => handleRename(doc.id, doc.name)} 
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition" 
                    title="Renommer le fichier (Titre interne uniquement)"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)} 
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition" 
                    title="Supprimer de la liste (La preuve reste valide sur la Blockchain)"
                  >
                    🗑️
                  </button>
                  <button 
                    title="Télécharger le certificat de preuve officiel (PDF)"
                    className="hidden sm:flex px-4 py-2 bg-[#1A1A20] hover:bg-blue-600 border border-white/10 rounded-lg text-sm font-medium transition ml-2 text-white"
                  >
                    Certificat
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
