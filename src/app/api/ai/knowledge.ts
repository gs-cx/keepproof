// BASE DE DONNÉES JURIDIQUE
export const legalCorpus = [
  {
    id: "civil_1366",
    source: "Code Civil - Article 1366",
    themes: ["ecrit", "numerique", "valeur", "force", "probante", "preuve"],
    text_officiel: "L'écrit électronique a la même force probante que l'écrit sur support papier...",
    explication: "Un fichier numérique vaut autant qu'un papier signé si vous prouvez l'identité et l'intégrité."
  },
  {
    id: "civil_1367",
    source: "Code Civil - Article 1367",
    themes: ["signature", "fiabilite", "identite"],
    text_officiel: "La fiabilité de ce procédé est présumée jusqu'à preuve contraire.",
    explication: "L'ancrage Blockchain est un procédé fiable pour signer votre antériorité."
  },
  {
    id: "cpi_335_2",
    source: "Code Propriété Intellectuelle - L.335-2",
    themes: ["contrefacon", "delit", "copie", "prison", "amende", "voler"],
    text_officiel: "La contrefaçon est un délit puni de 3 ans d'emprisonnement et de 300 000 euros d'amende.",
    explication: "Copier votre travail est un délit pénal grave. La preuve d'antériorité permet d'agir."
  },
  {
    id: "penal_323_1",
    source: "Code Pénal - Article 323-1",
    themes: ["intrusion", "piratage", "hacker", "acces", "donnees"],
    text_officiel: "Le fait d'accéder frauduleusement dans un système de traitement automatisé est puni de deux ans d'emprisonnement.",
    explication: "Si on vous vole vos fichiers avant publication, la preuve d'antériorité montre que vous les aviez avant."
  },
  {
    id: "rgpd_5",
    source: "RGPD - Article 5",
    themes: ["rgpd", "donnees", "personnel", "minimisation"],
    text_officiel: "Les données doivent être adéquates, pertinentes et limitées à ce qui est nécessaire.",
    explication: "KeepProof respecte le RGPD : nous ne stockons que l'empreinte (Hash), jamais le fichier."
  },
  {
    id: "commerce_secret",
    source: "Code de Commerce - Secret des Affaires",
    themes: ["secret", "affaires", "business", "concept"],
    text_officiel: "Est protégé tout renseignement ayant une valeur commerciale parce qu'il est secret.",
    explication: "KeepProof permet de prouver que vous aviez le secret à une date T, sans avoir à le dévoiler."
  }
];

export const generalBase = [
  { keywords: ["cout", "tarif", "pay", "gratuit", "prix"], response: "💰 **Tarifs :** Inscription gratuite. Protection par crédits à l'acte. Pas d'abonnement." },
  { keywords: ["stock", "serv", "cloud", "priv", "confiden"], response: "🔒 **Confidentialité :** Technologie Zero-Knowledge. Nous ne stockons JAMAIS vos fichiers." },
  { keywords: ["perd", "perte", "effac", "supprim"], response: "🚨 **Attention :** Si vous perdez votre fichier original, la preuve devient inutile. Faites des sauvegardes !" },
  { keywords: ["duree", "temp", "vie", "valid"], response: "⏳ **Validité :** La preuve est valable à vie et infalsifiable." }
];
