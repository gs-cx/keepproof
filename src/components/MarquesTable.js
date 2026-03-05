"use client";
import { useState, useEffect } from 'react';

export default function MarquesTable() {
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la recherche et le tri
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  // 1. Récupération des données au chargement
  useEffect(() => {
    async function fetchMarques() {
      try {
        const response = await fetch('/api/marques');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setMarques(data.marques);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMarques();
  }, []);

  // 2. Fonction de Tri (Ascendant / Descendant)
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 3. Logique de Filtrage et de Tri
  const sortedAndFilteredMarques = [...marques]
    .filter((marque) => {
      // Recherche insensible à la casse
      const searchLower = searchTerm.toLowerCase();
      // Adaptez 'nom_marque' ou 'numero' selon les vrais noms de vos colonnes dans la DB
      const nom = marque.nom_marque || marque.nom || ''; 
      const numero = marque.numero || marque.id || '';
      const titulaire = marque.titulaire || '';

      return (
        nom.toString().toLowerCase().includes(searchLower) ||
        numero.toString().toLowerCase().includes(searchLower) ||
        titulaire.toString().toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Petit utilitaire pour afficher les flèches de tri
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <span className="text-gray-400">↕</span>;
    return sortConfig.direction === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  if (loading) return <div className="p-4 text-center">Chargement des marques...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Erreur: {error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Dernières Marques Déposées</h2>
        
        {/* Barre de Recherche */}
        <input
          type="text"
          placeholder="Rechercher (Nom, Numéro...)"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* En-têtes cliquables pour le tri */}
              <th 
                onClick={() => handleSort('id')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                ID {getSortIcon('id')}
              </th>
              <th 
                onClick={() => handleSort('nom_marque')} // Vérifiez si c'est 'nom' ou 'nom_marque' dans votre DB
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Nom de la marque {getSortIcon('nom_marque')}
              </th>
              <th 
                onClick={() => handleSort('numero')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Numéro {getSortIcon('numero')}
              </th>
              <th 
                onClick={() => handleSort('date_depot')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Date Dépôt {getSortIcon('date_depot')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredMarques.length > 0 ? (
              sortedAndFilteredMarques.map((marque) => (
                <tr key={marque.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {marque.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {/* Affiche le nom ou un placeholder si vide */}
                    {marque.nom_marque || marque.nom || 'Sans nom'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {marque.numero || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {marque.date_depot ? new Date(marque.date_depot).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {marque.statut || 'Actif'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun résultat trouvé pour "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Affichage de {sortedAndFilteredMarques.length} marque(s).
      </div>
    </div>
  );
}
