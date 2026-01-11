import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

// 👇 REMPLACEZ PAR VOTRE EMAIL EXACT ICI 👇
const ADMIN_EMAIL = "je.gilginas@gmail.com"; 

export default async function AdminDashboard() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // 1. Sécurité : Si ce n'est pas vous, on bloque.
  if (!user || userEmail !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4 text-red-500">⛔ ACCÈS INTERDIT</h1>
        <p className="text-gray-400">Votre email ({userEmail}) n'a pas les droits d'administration.</p>
        <Link href="/" className="mt-8 text-white underline hover:text-blue-400">Retour à l'accueil</Link>
      </div>
    );
  }

  // 2. Récupération des 50 derniers logs
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: {
        select: { email: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#050507] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Panneau d'Administration
            </h1>
            <p className="text-gray-500 text-sm mt-1">Surveillance des logs et de l'activité</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 font-mono text-xs">
                Connecté : {userEmail}
             </div>
             <Link href="/dashboard" className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
                Retour Site
             </Link>
          </div>
        </div>

        {/* Tableau des Logs */}
        <div className="bg-[#111116] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 text-gray-200 uppercase font-medium text-xs tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500">Aucune activité enregistrée.</td></tr>
                ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-xs whitespace-nowrap text-gray-500">
                          {new Date(log.createdAt).toLocaleString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                            log.status === 'OK' || log.status === 'SUCCESS' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">
                          {log.action}
                        </td>
                        <td className="p-4 text-xs">
                          {log.user?.email || <span className="opacity-30">{log.userId}</span>}
                        </td>
                        <td className="p-4 font-mono text-xs text-gray-500 max-w-xs truncate" title={log.details || ''}>
                          {log.details}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
