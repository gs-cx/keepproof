'use client';
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
// Footer géré par layout.tsx

export default function SecurityPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-blue-500/30">
      
      {/* HERO SECTION */}
      <div className="pt-32 pb-20 px-6 border-b border-white/5 bg-[#111116]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
            Architecture "Zero-Knowledge"
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Vos secrets ne quittent <br/> <span className="text-blue-500">jamais</span> votre ordinateur.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Nous avons conçu KeepProof avec une obsession : garantir que vous soyez le seul propriétaire de vos données. Voici comment nous protégeons votre propriété intellectuelle.
          </p>
        </div>
      </div>

      {/* CORE CONCEPT : LE HASHING */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Le principe du Coffre-Fort aveugle</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Beaucoup de services cloud reçoivent vos fichiers, les stockent, et promettent de ne pas les regarder. Chez KeepProof, nous ne demandons pas de promesse, nous utilisons les mathématiques.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Lorsque vous déposez un fichier, notre technologie (SHA-256) calcule son empreinte numérique unique <strong>directement dans votre navigateur</strong>.
            </p>
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <p className="font-bold text-white">Ce que nous recevons :</p>
              <p className="font-mono text-blue-300 text-sm mt-2 break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
              <p className="text-sm text-gray-400 mt-2">C'est une suite de caractères aléatoires. Il est mathématiquement impossible de reconstituer votre fichier original (image, roman, code) à partir de cette empreinte.</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-[#1A1A20] border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">📄</div>
                    <div className="h-1 flex-1 bg-gray-700 rounded overflow-hidden">
                        <div className="h-full w-1/2 bg-green-500 animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center font-bold">🔒</div>
                </div>
                <p className="text-center text-sm text-gray-400 font-mono">
                    Votre Ordi ➔ Calcul du Hash ➔ Envoi du Hash uniquement
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE SÉCURITÉ */}
      <div className="bg-[#0A0A0F] py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Une forteresse à 4 niveaux</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#111116] p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-bold mb-3">Immuabilité Blockchain</h3>
              <p className="text-gray-400 text-sm">
                Votre preuve n'est pas stockée dans une base de données modifiable. Elle est ancrée sur la Blockchain (Polygon). Même si KeepProof disparaît demain, votre preuve reste vérifiable à vie.
              </p>
            </div>

            <div className="bg-[#111116] p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-3">Paiements Sécurisés</h3>
              <p className="text-gray-400 text-sm">
                Nous ne voyons et ne stockons jamais vos informations bancaires. Toutes les transactions sont sécurisées par <strong>Stripe</strong> (audit niveau 1 PCI DSS).
              </p>
            </div>

            <div className="bg-[#111116] p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3">Authentification Forte</h3>
              <p className="text-gray-400 text-sm">
                La gestion des comptes est déléguée à <strong>Clerk</strong>. Nous ne stockons pas vos mots de passe. Vos accès sont protégés par les meilleurs standards.
              </p>
            </div>

            <div className="bg-[#111116] p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Confidentialité Totale</h3>
              <p className="text-gray-400 text-sm">
                Conformément au RGPD : nous ne revendons aucune donnée. Vos titres de projets et vos informations personnelles sont strictement privés.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SÉCURITÉ - VERSION ENRICHIE */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-12 text-center">Questions fréquentes sur la sécurité</h2>
        
        <div className="space-y-12">
          
          {/* GROUPE 1 : Pérennité */}
          <div className="border-l-2 border-blue-500 pl-6">
            <h3 className="text-xl font-bold mb-2 text-white">Que se passe-t-il si KeepProof fait faillite ?</h3>
            <p className="text-gray-400 leading-relaxed">
              C'est la force de la Blockchain. Une fois votre certificat généré, la preuve existe sur le réseau public décentralisé. Vous n'avez pas besoin de nos serveurs pour prouver votre antériorité dans 10 ans. Vous êtes indépendant de nous (Self-Sovereignty).
            </p>
          </div>

          {/* GROUPE 2 : Confidentialité Concurrentielle */}
          <div className="border-l-2 border-purple-500 pl-6">
            <h3 className="text-xl font-bold mb-2 text-white">Mes concurrents peuvent-ils voir ce que j'ai déposé sur la Blockchain ?</h3>
            <p className="text-gray-400 leading-relaxed">
              Non. La Blockchain est publique, mais elle ne contient que des "Hashes" (des séries de chiffres illisibles). Personne ne peut deviner que le hash <code>0x8f...2a</code> correspond à votre "Projet Secret 2026.pdf". La preuve est publique, mais le contenu reste secret tant que VOUS ne décidez pas de le révéler.
            </p>
          </div>
          
          {/* GROUPE 3 : Risque Technique */}
          <div className="border-l-2 border-gray-700 pl-6">
            <h3 className="text-xl font-bold mb-2 text-white">Un pirate peut-il voler mon idée sur vos serveurs ?</h3>
            <p className="text-gray-400 leading-relaxed">
              Non. Comme nous ne stockons que l'empreinte numérique et pas le fichier original, un pirate ne trouverait qu'une liste de codes inutilisables. Votre secret industriel reste physiquement sur votre machine.
            </p>
          </div>

           {/* GROUPE 4 : Validité Juridique */}
           <div className="border-l-2 border-green-500 pl-6">
            <h3 className="text-xl font-bold mb-2 text-white">Ma preuve est-elle recevable en justice ?</h3>
            <p className="text-gray-400 leading-relaxed">
              Oui. En France et en Europe (Règlement eIDAS), la preuve numérique sur Blockchain est reconnue comme un commencement de preuve par écrit. Elle permet d'établir une date certaine infalsifiable, élément clé pour renverser la charge de la preuve dans un litige en contrefaçon.
            </p>
          </div>

          {/* GROUPE 5 : Vérification Indépendante (Argument d'autorité) */}
          <div className="border-l-2 border-yellow-500 pl-6">
            <h3 className="text-xl font-bold mb-2 text-white">Comment vérifier ma preuve si votre site est hors ligne ?</h3>
            <p className="text-gray-400 leading-relaxed">
              Vous pouvez recalculer l'empreinte de votre fichier avec n'importe quel outil tiers (commande <code>shasum</code> sur Mac/Linux ou outils en ligne). Il suffira ensuite de chercher cette empreinte sur un explorateur public comme PolygonScan pour voir qu'elle a bien été ancrée à la date promise.
            </p>
          </div>

          {/* GROUPE 6 : Avertissement Honnête */}
          <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
            <h3 className="text-xl font-bold mb-2 text-red-400">⚠️ Que se passe-t-il si je perds mon fichier original ?</h3>
            <p className="text-gray-300 leading-relaxed">
              Attention : <strong>La preuve est liée mathématiquement au fichier exact.</strong> Si vous perdez votre fichier original (ou si vous le modifiez et ne gardez pas la version certifiée), le lien est rompu et la preuve devient inutile. Nous ne stockant pas vos fichiers, <strong>c'est votre responsabilité de conserver précieusement vos originaux certifiés</strong> (disque dur, cloud, clé USB).
            </p>
          </div>

        </div>

        <div className="mt-16 text-center">
            <Link href="/new" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105">
                Protéger un fichier en sécurité
            </Link>
        </div>

      </div>

    </div>
    </>
  );
}
