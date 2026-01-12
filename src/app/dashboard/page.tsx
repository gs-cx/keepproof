'use client';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProofs } from "../actions";

interface Folder { id: string; name: string; }

// Icône SVG Téléchargement
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('all');
  
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'clients', name: 'Projets Clients' },
    { id: 'admin', name: 'Administratif' }
  ]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getUserProofs().then(data => {
        setProofs(data);
        setLoading(false);
      });
    }
  }, [isLoaded, isSignedIn]);

  const createFolder = () => {
    const name = window.prompt("Nom du dossier ?");
    if (name) setFolders([...folders, { id: `f-${Date.now()}`, name }]);
  };

  const getCurrentTitle = () => {
    if (currentView === 'all') return 'Tous les fichiers';
    return folders.find(f => f.id === currentView)?.name || 'Dossier';
  };

  if (!isLoaded || loading) return <div className="bg-[#050507] min-h-screen text-white flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col font-sans">
      {/* Header automatique via layout */}
      
      <div className="flex flex-1 flex-col md:flex-row pt-10 px-4 max-w-[1600px] mx-auto w-full gap-8">
        
        {/* --- NAVIGATION (Mobile: Horizontal Scroll | Desktop: Sidebar) --- */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col">
            {/* Bouton Principal */}
            <button onClick={() => router.push('/new')} className="hidden md:block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl mb-6 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                + Nouvelle Preuve
            </button>

            {/* --- NOUVEAU : Lien Litige REMONTÉ EN HAUT --- */}
            <div className="hidden md:block mb-8">
                <button 
                    onClick={() => router.push('/litige')}
                    className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all text-sm font-bold flex items-center justify-between shadow-lg shadow-red-900/40 group border border-red-400/20"
                >
                    <span className="flex items-center gap-2"><span>⚖️</span> Guide Litige</span>
                    <span className="text-white/70 group-hover:text-white transition-colors">→</span>
                </button>
                <p className="text-[10px] text-gray-500 mt-2 px-2 leading-tight text-center">
                    En cas de plagiat ou vol
                </p>
            </div>
            
            {/* Menu Desktop */}
            <nav className="hidden md:block space-y-2 flex-1 border-t border-white/5 pt-6">
                <button onClick={() => setCurrentView('all')} className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${currentView === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                    <span>📁</span> Tous les fichiers
                </button>
                <div className="pt-6 pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">Vos Dossiers</div>
                {folders.map(f => (
                    <button key={f.id} onClick={() => setCurrentView(f.id)} className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm ml-2 border-l-2 ${currentView === f.id ? 'text-blue-400 border-blue-500 bg-blue-500/5' : 'text-gray-500 border-transparent'}`}>
                        {f.name}
                    </button>
                ))}
                <button onClick={createFolder} className="text-xs text-gray-600 hover:text-blue-400 mt-4 px-4 flex items-center gap-2 transition uppercase"><span>+</span> Créer un dossier</button>
            </nav>

            {/* Menu MOBILE (Scroll Horizontal) */}
            <div className="md:hidden overflow-x-auto flex gap-3 pb-4 pt-2 no-scrollbar">
                <button onClick={() => setCurrentView('all')} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold ${currentView === 'all' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                    📁 Tout
                </button>
                
                {/* Bouton Litige Mobile Mis en avant */}
                <button onClick={() => router.push('/litige')} className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white shadow-lg border border-red-400/30">
                    ⚖️ Urgence Litige
                </button>

                {folders.map(f => (
                    <button key={f.id} onClick={() => setCurrentView(f.id)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold ${currentView === f.id ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {f.name}
                    </button>
                ))}
            </div>
        </aside>

        {/* --- CONTENU PRINCIPAL --- */}
        <main className="flex-1 bg-[#0A0A0F] md:rounded-2xl md:border md:border-white/5 p-4 md:p-8 min-h-[500px] mb-20 md:mb-0">
            <header className="flex justify-between items-end mb-6 border-b border-white/5 pb-6">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {currentView !== 'all' && <span className="text-gray-600 font-normal hidden md:inline">Dossiers /</span>}
                    {getCurrentTitle()}
                </h1>
                <div className="text-xs text-gray-500">{proofs.length} fichier(s)</div>
            </header>
            
            {proofs.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center opacity-50">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-3xl grayscale">📂</div>
                    <p className="text-gray-400 text-sm">Aucun fichier protégé.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {proofs.map((proof) => (
                        <div key={proof.id} className="bg-[#111116] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A20] rounded-lg border border-white/10 flex items-center justify-center text-blue-400 font-bold text-[10px] md:text-xs shadow-inner shrink-0">
                                    {proof.filename.split('.').pop()?.toUpperCase() || 'DOC'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-medium text-gray-200 text-sm truncate">{proof.filename}</div>
                                    <div className="text-xs text-gray-600 flex gap-2 mt-1 font-mono">
                                        <span>{new Date(proof.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{(proof.fileSize / 1024).toFixed(0)} KB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0">
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded border border-green-500/20 md:hidden">
                                    Protégé
                                </span>
                                <a 
                                    href={`/pdf/${proof.id}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-[#1A1A20] active:bg-white/10 text-gray-400 text-xs font-bold rounded-lg border border-white/10"
                                >
                                    <DownloadIcon />
                                    <span>Certificat</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>

        {/* --- BOUTON FLOTTANT MOBILE (FAB) --- */}
        <button 
            onClick={() => router.push('/new')}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.5)] flex items-center justify-center text-3xl font-light z-40 active:scale-90 transition-transform"
        >
            +
        </button>

      </div>
    </div>
  );
}
