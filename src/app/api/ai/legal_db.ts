export const LEGAL_KNOWLEDGE_BASE = [
  // --- SECTION JURIDIQUE & LÉGALE ---
  {
    category: "Juridique",
    topic: "Valeur légale et recevabilité en justice",
    content: `La preuve générée par KeepProof est juridiquement recevable en France et en Europe. Elle repose sur deux piliers : 
    1. L'article 1366 du Code civil français, qui accorde à l'écrit électronique la même force probante que l'écrit papier, sous réserve que l'on puisse identifier l'auteur et garantir l'intégrité de l'acte.
    2. Le règlement européen eIDAS (n°910/2014), qui interdit aux juges de refuser une preuve au seul motif qu'elle est électronique.
    En cas de litige, le certificat KeepProof fournit une date certaine et une preuve d'intégrité (via le Hash) qui sont opposables aux tiers.`
  },
  {
    category: "Juridique",
    topic: "Différence entre Droit d'auteur et Dépôt",
    content: `En France (et dans les 179 pays de la Convention de Berne), le droit d'auteur naît automatiquement dès la création de l'œuvre. Vous n'avez pas besoin de "déposer" pour être protégé.
    Cependant, le problème est la PREUVE. Si quelqu'un vous copie, vous devez prouver que vous étiez le premier. C'est là que KeepProof intervient : nous ne créons pas le droit (il existe déjà), mais nous créons la PREUVE irréfutable de l'antériorité de votre création à une date précise.`
  },
  {
    category: "Comparatif",
    topic: "KeepProof vs Enveloppe Soleau vs Notaire",
    content: `
    - Enveloppe Soleau (INPI) : Coûte 15€, limitée à 7 pages, valable 5 ans (renouvelable 1 fois). Pas de fichier numérique lourd (vidéo/code).
    - Notaire / Huissier : Très fort juridiquement, mais coûteux (200€ à 500€ le constat) et lent.
    - KeepProof : Instantané, coûte quelques crédits, permet de protéger des fichiers lourds (vidéo, son, ZIP de code source) et la preuve est valable à vie grâce à la Blockchain, sans renouvellement payant.`
  },

  // --- SECTION TECHNIQUE & SÉCURITÉ (ZERO KNOWLEDGE) ---
  {
    category: "Sécurité",
    topic: "Confidentialité et Zero-Knowledge (Stockage des fichiers)",
    content: `C'est le point fort de KeepProof : nous sommes en architecture "Zero-Knowledge".
    Concrètement : Votre fichier original ne quitte JAMAIS votre ordinateur ou votre navigateur vers nos serveurs de stockage définitif.
    1. Votre navigateur calcule l'empreinte numérique (Hash SHA-256) du fichier localement.
    2. Seule cette empreinte (une suite de chiffres et lettres) est envoyée à KeepProof pour être ancrée dans la Blockchain.
    3. Nous ne pouvons pas voir, lire, ou voler vos idées car nous ne possédons mathématiquement pas le fichier source. Vous restez le seul gardien de vos secrets.`
  },
  {
    category: "Technique",
    topic: "Qu'est-ce qu'un Hash (Empreinte numérique) ?",
    content: `Le Hash (SHA-256) est l'ADN numérique de votre fichier. C'est une fonction mathématique à sens unique.
    - Si vous modifiez une seule virgule ou un seul pixel de votre fichier, le Hash change totalement.
    - Il est impossible de "deviner" le fichier original à partir du Hash.
    C'est ce qui garantit l'intégrité : si le Hash sur la Blockchain correspond au Hash de votre fichier actuel, alors le fichier n'a pas été modifié depuis la date du dépôt.`
  },
  {
    category: "Technique",
    topic: "Fonctionnement de la Blockchain Polygon",
    content: `Nous utilisons la Blockchain publique Polygon (compatible Ethereum). Contrairement à une base de données privée (qui pourrait être falsifiée par l'administrateur), la Blockchain est un registre public, décentralisé et immuable.
    Une fois votre preuve ancrée dans un bloc, elle y est gravée pour toujours. Personne, pas même l'équipe de KeepProof, ne peut revenir en arrière pour changer la date ou le contenu.`
  },

  // --- SECTION "SCÉNARIOS CATASTROPHES" (RASSURANCE) ---
  {
    category: "Rassurance",
    topic: "Que se passe-t-il si KeepProof fait faillite ?",
    content: `C'est la force de la technologie Blockchain décentralisée : votre preuve survit à l'entreprise KeepProof.
    Comme la preuve est ancrée sur la Blockchain publique (Polygon) et non sur nos serveurs privés :
    1. Vous conservez votre certificat (PDF) et votre fichier original.
    2. Même si le site web KeepProof.com disparaît, vous pouvez utiliser n'importe quel outil de vérification Blockchain public (comme Etherscan ou des outils open-source) pour prouver que votre Hash a bien été enregistré à la date indiquée. Vous ne dépendez pas de nous pour la validité de votre preuve dans le temps.`
  },
  {
    category: "Utilisation",
    topic: "Durée de validité de la preuve",
    content: `La validité est illimitée dans le temps (A vie et au-delà). Tant que la technologie cryptographique (SHA-256) et la Blockchain existent, la preuve est mathématiquement vérifiable. Contrairement à un brevet (20 ans) ou une marque (10 ans renouvelables), le droit d'auteur et sa preuve d'antériorité n'expirent pas tant que l'œuvre n'est pas tombée dans le domaine public (70 ans après la mort de l'auteur).`
  },

  // --- SECTION CAS D'USAGE ---
  {
    category: "Cas d'usage",
    topic: "Que peut-on protéger ?",
    content: `Tout fichier numérique peut être protégé :
    - Créatifs : Logos, designs UX/UI, photos HD, maquettes.
    - Musique & Audio : Pistes WAV, compositions, paroles.
    - Tech : Code source (fichiers .js, .py, ou archives .zip), algorithmes.
    - Business : Business plans, concepts de startup, contrats confidentiels, bases de données clients.
    - Recherche : Thèses, découvertes scientifiques avant publication.`
  },
  {
    category: "Litige",
    topic: "Comment utiliser la preuve au tribunal ?",
    content: `La procédure est standard :
    1. Vous remettez à votre avocat ou à l'huissier de justice deux éléments : votre fichier original (que vous avez précieusement conservé) et le certificat de preuve KeepProof (PDF).
    2. L'expert judiciaire calcule le Hash de votre fichier actuel.
    3. Il vérifie sur la Blockchain que ce Hash a bien été enregistré à la date T.
    4. La correspondance confirme que vous déteniez ce fichier exact à cette date, prouvant votre antériorité face à la partie adverse.`
  }
];
