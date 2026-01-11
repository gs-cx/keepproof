'use client';

import { useState } from 'react';
import { searchProofsAction } from '../actions';
import Header from '@/components/Header';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const response = await searchProofsAction(query);
    setLoading(false);

    if (response.success) {
      setResults(response.results);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans">
      <Header />
      
      <div className="max-w-2xl mx-auto pt-32 px-6">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Moteur de Recherche IA
        </h1>
        <p className="text-gray-400 mb-8">Recherche sémantique vectorielle (pgvector)</p>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="relative mb-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: document juridique, logo bleu..."
            className="w-full bg-[#1A1A20] border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 px-6 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Chercher'}
          </button>
        </form>

        {/* Résultats */}
        <div className="space-y-4">
          {results.map((r) => (
            <div key={r.id} className="bg-[#111116] p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                 <div className={`text-sm font-bold px-2 py-1 rounded ${parseFloat(r.score) > 70 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {r.score}
                 </div>
                 <div>
                    <div className="font-medium text-white">{r.filename}</div>
                    <div className="text-xs text-gray-500">{r.date}</div>
                 </div>
              </div>
              <a href={`/pdf/${r.id}`} target="_blank" className="text-blue-400 hover:text-blue-300 text-sm">
                Voir
              </a>
            </div>
          ))}
          
          {results.length === 0 && !loading && query && (
             <p className="text-center text-gray-600">Aucun résultat pertinent trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
