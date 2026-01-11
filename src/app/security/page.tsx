import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Security() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-[#050507] text-white pt-32 px-6 pb-20 selection:bg-blue-500/30">
        <div className="max-w-6xl mx-auto">
          
          {/* HERO SECTION - MODIFIÉ */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Sécurité et <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Conformité</span>.
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              La protection de vos données est notre priorité absolue.
              <br />
              Découvrez l'infrastructure certifiée, auditable et décentralisée sur laquelle repose KeepProof.
            </p>
          </div>

          {/* SECTION 1: INFRASTRUCTURE PARTNERS (Le "Bouclier") */}
          <section className="mb-24">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-4">Une infrastructure certifiée</h2>
              <p className="text-gray-400">Nous construisons notre service sur des fondations technologiques éprouvées et auditées par les leaders du marché.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Carte AWS/Vercel */}
              <div className="bg-[#111116] p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition">
                <div className="h-12 flex items-center mb-4">
                  <span className="text-xl font-bold tracking-widest">▲ Vercel</span>
                </div>
                <h3 className="font-bold mb-2">Hébergement & Cloud</h3>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">✓ Certifié SOC 2 Type II</li>
                  <li className="flex items-center gap-2">✓ Certifié ISO 27001</li>
                  <li className="flex items-center gap-2">✓ Protection DDoS</li>
                </ul>
              </div>

              {/* Carte Stripe */}
              <div className="bg-[#111116] p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition">
                <div className="h-12 flex items-center mb-4">
                  <span className="text-xl font-bold tracking-tighter text-indigo-400">stripe</span>
                </div>
                <h3 className="font-bold mb-2">Paiements Sécurisés</h3>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">✓ Conformité PCI-DSS Niv 1</li>
                  <li className="flex items-center gap-2">✓ Chiffrement bancaire</li>
                  <li className="flex items-center gap-2">✓ Anti-Fraude Radar</li>
                </ul>
              </div>

              {/* Carte Clerk */}
              <div className="bg-[#111116] p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition">
                <div className="h-12 flex items-center mb-4">
                  <span className="text-xl font-bold tracking-tight text-blue-400">Clerk</span>
                </div>
                <h3 className="font-bold mb-2">Authentification</h3>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">✓ Conformité SOC 2 Type II</li>
                  <li className="flex items-center gap-2">✓ Gestion de sessions sécurisée</li>
                  <li className="flex items-center gap-2">✓ Hachage de mots de passe</li>
                </ul>
              </div>

              {/* Carte Polygon */}
              <div className="bg-[#111116] p-6 rounded-xl border border-white/5 hover:border-purple-500/30 transition">
                <div className="h-12 flex items-center mb-4">
                  <span className="text-xl font-bold tracking-tight text-purple-500">Polygon</span>
                </div>
                <h3 className="font-bold mb-2">Blockchain Publique</h3>
                <ul className="text-xs text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">✓ Décentralisation totale</li>
                  <li className="flex items-center gap-2">✓ Immutabilité des preuves</li>
                  <li className="flex items-center gap-2">✓ Disponibilité 99.99%</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2: STANDARDS TECHNIQUES & JURIDIQUES */}
          <section className="grid md:grid-cols-2 gap-12 mb-24 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Standards et Protocoles</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Notre architecture a été conçue pour respecter les exigences légales strictes en matière de preuve numérique et de protection des données.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Alignement eIDAS</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Nos certificats fournissent un horodatage électronique conforme aux exigences techniques du règlement européen eIDAS, garantissant l'intégrité des données et l'exactitude du temps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Chiffrement de bout en bout</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      TLS 1.3 pour les données en transit. AES-256 pour les données au repos. SHA-256 pour le calcul d'empreinte. Nous utilisons les standards cryptographiques de l'industrie bancaire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111116] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
               {/* Effet visuel code */}
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
               <h3 className="font-mono text-blue-400 mb-4 text-sm">architecture_security.json</h3>
               <pre className="text-xs text-gray-400 font-mono overflow-x-auto">
{`{
  "security_mode": "ZERO_KNOWLEDGE",
  "data_privacy": {
    "file_storage": false,
    "hash_only": true,
    "gdpr_compliant": true
  },
  "encryption": {
    "transit": "TLS_1_3",
    "hashing": "SHA_256",
    "blockchain": "POLYGON_POS"
  },
  "auditability": "PUBLIC_LEDGER"
}`}
               </pre>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center border-t border-white/10 pt-16">
            <h3 className="text-2xl font-bold mb-6">Vous avez des exigences de sécurité spécifiques ?</h3>
            <div className="flex justify-center gap-4">
              <Link href="/new" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
                Commencer à protéger
              </Link>
              <a href="mailto:security@keepproof.com" className="bg-white/10 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition">
                Contacter l'équipe Sécurité
              </a>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
