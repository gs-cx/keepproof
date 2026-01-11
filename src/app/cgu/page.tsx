'use client';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CGUPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#050507] text-gray-300 pt-32 px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-[#111116] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Conditions Générales d'Utilisation (CGU) & de Vente (CGV)</h1>
          <p className="text-gray-500 mb-8 border-b border-white/10 pb-4">En vigueur au {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-sm md:text-base leading-relaxed text-justify">
            
            <section>
              <h2 className="text-xl font-bold text-white mb-2">1. Objet du service KeepProof</h2>
              <p>
                KeepProof est un service de <strong>sécurisation et d'horodatage numérique</strong>. Il permet aux utilisateurs de générer une preuve d'existence d'un fichier numérique à une date donnée (Preuve d'Antériorité) en calculant son empreinte cryptographique (Hash SHA-256) et en l'enregistrant dans une base de données sécurisée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">2. Nature de la Preuve & Responsabilité</h2>
              <p>
                KeepProof fournit une <strong>obligation de moyens</strong> pour assurer l'intégrité de l'enregistrement. 
                <br /><br />
                <strong>Limites :</strong> KeepProof certifie que le fichier <em>existait</em> à la date du dépôt. KeepProof ne certifie PAS la véracité du contenu, ni que l'utilisateur est l'auteur légitime de l'œuvre. La preuve numérique fournie constitue un commencement de preuve par écrit admissible en justice, mais reste soumise à l'appréciation souveraine des juges.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">3. Stockage et Confidentialité (Spécifique)</h2>
              <p>
                <strong>Architecture Zéro-Knowledge :</strong> Lors de la protection simple, seul le "Hash" (l'empreinte) est envoyé à nos serveurs. Le fichier original ne quitte jamais l'appareil de l'utilisateur.
                <br />
                <strong>Option Stockage Sécurisé :</strong> Si l'utilisateur choisit l'option de sauvegarde, le fichier est chiffré et stocké sur nos serveurs privés en France. KeepProof s'engage à ne jamais divulguer, vendre ou exploiter les fichiers stockés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">4. Renoncement au Droit de Rétractation</h2>
              <p>
                Conformément à l'article L221-28 du Code de la Consommation relatif aux contenus numériques non fournis sur un support matériel, <strong>le droit de rétractation ne peut être exercé</strong> une fois le service pleinement exécuté. 
                <br />
                En cliquant sur "Protéger" ou "Déposer", l'utilisateur accepte l'exécution immédiate du service d'horodatage et renonce expressément à son droit de rétractation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">5. Tarifs et Paiements</h2>
              <p>
                Les services sont facturés selon la grille tarifaire en vigueur au jour de la commande. Les paiements sont sécurisés par notre prestataire de paiement (Stripe/PayPal). Aucun remboursement ne sera effectué en cas d'erreur de l'utilisateur (ex: mauvais fichier protégé).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">6. Force Majeure & Blockchain</h2>
              <p>
                KeepProof ne saurait être tenu responsable des dysfonctionnements liés à des cas de force majeure, incluant mais non limité à : congestion des réseaux Blockchain publics, coupure générale d'Internet, cyber-attaques majeures ou défaillance de l'hébergeur OVH/AWS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">7. Loi Applicable</h2>
              <p>
                Les présentes CGU/CGV sont soumises au droit français. Tout litige relatif à leur interprétation et/ou à leur exécution relève des tribunaux français compétents.
              </p>
            </section>

          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <button onClick={() => window.history.back()} className="text-blue-500 hover:text-blue-400 underline cursor-pointer">
              Retour au site
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
