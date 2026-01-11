import Header from "@/components/Header";

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050507] text-gray-300 py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <h1 className="text-4xl font-bold text-white mb-8">Mentions Légales</h1>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Éditeur du site</h2>
            <p>
              Le site <strong>KeepProof.com</strong> est édité par la société <strong>KeepProof SAS</strong>.<br />
              Société par Actions Simplifiée au capital de 1 000 €.<br />
              Immatriculée au RCS de Lille Métropole sous le numéro [VOTRE SIRET].<br />
              Siège social : [VOTRE ADRESSE].<br />
              Email : contact@keepproof.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Hébergement</h2>
            <p>
              Le site est hébergé sur des serveurs situés en Europe.<br />
              Prestataire : [Nom de l'hébergeur].<br />
              Adresse : [Adresse de l'hébergeur].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Propriété Intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
