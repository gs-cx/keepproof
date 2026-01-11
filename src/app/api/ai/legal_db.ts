// --- 📚 BASE DE DONNÉES JURIDIQUE EXPERTE (VERSION MAX) ---
// Contient : Civil, Pénal, CPI, Commerce, RGPD, eIDAS.

export const legalCorpus = [
  // =================================================================
  // 1. LA PREUVE NUMÉRIQUE (CODE CIVIL)
  // =================================================================
  {
    id: "civil_1366",
    source: "Code Civil - Article 1366 (Ex-1316-1)",
    themes: ["ecrit", "numerique", "electronique", "valeur", "force", "probante", "egalite", "papier"],
    text_officiel: "L'écrit électronique a la même force probante que l'écrit sur support papier, sous réserve que puisse être dûment identifiée la personne dont il émane et qu'il soit établi et conservé dans des conditions de nature à en garantir l'intégrité.",
    explication: "C'est la pierre angulaire. Un fichier numérique vaut autant qu'un papier signé si vous prouvez deux choses : l'identité (c'est bien vous) et l'intégrité (le fichier n'a pas bougé). KeepProof garantit cette intégrité via le hachage cryptographique."
  },
  {
    id: "civil_1367",
    source: "Code Civil - Article 1367",
    themes: ["signature", "fiabilite", "presomption", "identite", "signe"],
    text_officiel: "La signature électronique consiste en l'usage d'un procédé fiable d'identification garantissant son lien avec l'acte auquel elle s'attache. La fiabilité de ce procédé est présumée jusqu'à preuve contraire.",
    explication: "L'ancrage Blockchain associé à votre compte utilisateur constitue un faisceau d'indices fiable pour signer votre antériorité sur une œuvre."
  },
  {
    id: "civil_1358",
    source: "Code Civil - Article 1358",
    themes: ["liberte", "moyen", "tous", "moyens", "element", "admissible"],
    text_officiel: "Hors les cas où la loi en dispose autrement, la preuve peut être apportée par tout moyen.",
    explication: "Ce principe de 'liberté de la preuve' est crucial. Même si la Blockchain n'est pas citée nommément dans une vieille loi, l'article 1358 permet à un juge d'accepter une preuve Blockchain comme un élément factuel valide."
  },
  {
    id: "civil_1368",
    source: "Code Civil - Article 1368",
    themes: ["contrat", "accord", "convention", "litige", "parties"],
    text_officiel: "Les parties peuvent convenir par écrit des règles de preuve.",
    explication: "Si vous mettez dans vos CGV (Conditions Générales de Vente) que 'Les registres informatisés de KeepProof font foi entre les parties', cela devient la loi des parties. Très utile pour vos contrats clients."
  },

  // =================================================================
  // 2. PROPRIÉTÉ INTELLECTUELLE (DROIT D'AUTEUR)
  // =================================================================
  {
    id: "cpi_l111_1",
    source: "Code Propriété Intellectuelle - L.111-1",
    themes: ["auteur", "droit", "creation", "esprit", "automatique", "depot", "formalite"],
    text_officiel: "L'auteur d'une œuvre de l'esprit jouit sur cette œuvre, du seul fait de sa création, d'un droit de propriété incorporelle exclusif et opposable à tous.",
    explication: "En France, le dépôt n'est pas obligatoire pour être protégé (contrairement au brevet). La protection naît dès que vous créez. MAIS en cas de vol, vous devez prouver la date de cette création. C'est à ça que sert KeepProof : matérialiser cette date."
  },
  {
    id: "cpi_l112_2",
    source: "Code Propriété Intellectuelle - L.112-2",
    themes: ["liste", "quoi", "protege", "livre", "musique", "logiciel", "photo", "plan", "carte", "mode", "design"],
    text_officiel: "Sont considérés comme œuvres de l'esprit : les livres, conférences, œuvres dramatiques, chorégraphiques, compositions musicales, œuvres cinématographiques, de dessin, de peinture, d'architecture, de sculpture, les logiciels, les créations de mode...",
    explication: "Cette liste prouve que KeepProof peut tout protéger : du code source d'un logiciel aux plans d'architecte, en passant par des croquis de mode ou des chansons."
  },
  {
    id: "cpi_l113_1",
    source: "Code Propriété Intellectuelle - L.113-1",
    themes: ["presomption", "titulaire", "nom", "divulgation"],
    text_officiel: "La qualité d'auteur appartient, sauf preuve contraire, à celui sous le nom duquel l'œuvre est divulguée.",
    explication: "Si vous publiez une œuvre, on présume que c'est la vôtre. Mais si quelqu'un dit 'non c'est moi', c'est celui qui a la preuve la plus ancienne qui gagne. D'où l'importance d'un ancrage Blockchain antérieur à la publication."
  },

  // =================================================================
  // 3. CONTREFACON & SANCTIONS (PÉNAL)
  // =================================================================
  {
    id: "cpi_l335_2",
    source: "Code Propriété Intellectuelle - L.335-2",
    themes: ["contrefacon", "delit", "copie", "plagiat", "sanction", "prison", "amende", "voler"],
    text_officiel: "Toute édition d'écrits, de composition musicale, de dessin [...] au mépris des lois et règlements relatifs à la propriété des auteurs, est une contrefaçon. La contrefaçon est un délit.",
    explication: "Copier votre travail n'est pas juste 'pas sympa', c'est un délit pénal. Avec une preuve d'antériorité, vous pouvez menacer le contrefacteur de poursuites pénales."
  },
  {
    id: "cpi_l335_3",
    source: "Code Propriété Intellectuelle - L.335-3",
    themes: ["logiciel", "code", "piratage", "reproduction"],
    text_officiel: "Est également un délit de contrefaçon toute reproduction, représentation ou diffusion, par quelque moyen que ce soit, d'une œuvre de l'esprit en violation des droits de l'auteur.",
    explication: "Cela s'applique aussi spécifiquement au piratage de logiciels ou à la copie de code source sans licence."
  },
  {
    id: "penal_323_1",
    source: "Code Pénal - Article 323-1",
    themes: ["intrusion", "systeme", "hacker", "acces", "donnees", "fraude"],
    text_officiel: "Le fait d'accéder ou de se maintenir, frauduleusement, dans tout ou partie d'un système de traitement automatisé de données est puni de deux ans d'emprisonnement et de 60 000 euros d'amende.",
    explication: "Si quelqu'un vole vos fichiers en piratant votre ordinateur avant que vous ne les ayez publiés, c'est une intrusion. La preuve d'antériorité permet de montrer que vous aviez les données avant l'attaque."
  },

  // =================================================================
  // 4. CONCURRENCE & SECRET DES AFFAIRES
  // =================================================================
  {
    id: "civil_1240",
    source: "Code Civil - Article 1240 (Concurrence Déloyale)",
    themes: ["concurrence", "deloyale", "parasitisme", "dommage", "reparer", "idee", "concept"],
    text_officiel: "Tout fait quelconque de l'homme, qui cause à autrui un dommage, oblige celui par la faute duquel il est arrivé à le réparer.",
    explication: "Si votre création n'est pas une 'œuvre de l'esprit' (ex: un concept commercial ou une idée brute), le droit d'auteur ne joue pas. MAIS vous pouvez attaquer pour 'Concurrence Déloyale' ou 'Parasitisme'. Pour gagner, il faut prouver que vous avez eu l'idée en premier : KeepProof sert à ça."
  },
  {
    id: "commerce_l151_1",
    source: "Code de Commerce - L.151-1 (Secret des Affaires)",
    themes: ["secret", "affaires", "business", "confidenciel", "savoir-faire", "know-how"],
    text_officiel: "Est protégé au titre du secret des affaires tout renseignement qui n'est pas généralement connu, qui a une valeur commerciale parce qu'il est secret, et qui fait l'objet de mesures de protection raisonnables.",
    explication: "KeepProof permet de prouver que vous déteniez un savoir-faire secret à une date donnée, sans avoir à le révéler publiquement (puisque seul le hash est publié). C'est une 'mesure de protection raisonnable' au sens de la loi."
  },

  // =================================================================
  // 5. EUROPE & INTERNATIONAL (eIDAS / RGPD)
  // =================================================================
  {
    id: "eidas_25",
    source: "Règlement UE eIDAS - Article 25",
    themes: ["europe", "eidas", "recevable", "justice", "international", "refus"],
    text_officiel: "L'effet juridique et la recevabilité d'une signature électronique comme preuve en justice ne peuvent être refusés au seul motif que cette signature se présente sous une forme électronique.",
    explication: "C'est le principe de non-discrimination. Une preuve numérique KeepProof a la même recevabilité potentielle qu'un document papier dans toute l'Union Européenne."
  },
  {
    id: "rgpd_5",
    source: "RGPD - Article 5 (Minimisation)",
    themes: ["rgpd", "donnees", "personnelles", "hash", "anonyme", "minimisation"],
    text_officiel: "Les données à caractère personnel doivent être adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées.",
    explication: "La technologie KeepProof est 'Privacy by Design'. En ne stockant que l'empreinte (Hash) et non le fichier, nous respectons le principe de minimisation du RGPD. Le Hash est considéré comme une donnée pseudonymisée."
  }
];
