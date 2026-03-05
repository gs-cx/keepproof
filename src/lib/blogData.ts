export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string; // Contenu HTML
}

export const articles: BlogPost[] = [
  // --- FÉVRIER 2026 ---
  {
    slug: "faille-pitch-deck",
    title: "Ce détail dans votre Pitch Deck qui vous met en danger",
    excerpt: "Envoyer un PDF à un investisseur semble anodin. Pourtant, sans cette précaution, vous lui offrez votre business model sur un plateau.",
    date: "07 Fév. 2026",
    category: "Business",
    content: `
      <p>Vous avez passé trois semaines à polir vos slides. Votre "Go-to-market" est brillant. Vous cliquez sur "Envoyer". Stop. Avez-vous réalisé que ce fichier PDF est désormais hors de votre contrôle ?</p>
      <p>Nous avons vu trop de fondateurs retrouver leurs graphiques et leur stratégie dans le dossier d'un concurrent six mois plus tard. L'excuse ? "On a eu la même idée en même temps".</p>
      <p>Pour éviter ce scénario, la méthode douce consiste à créer une empreinte numérique de votre fichier avant l'envoi. C'est invisible pour le destinataire, mais cela constitue une preuve légale irréfutable que le 7 février, cette stratégie venait de vous, et de personne d'autre.</p>
    `
  },
  {
    slug: "cuisine-chef-signature",
    title: "Chefs étoilés : Peut-on protéger une recette ?",
    excerpt: "La cuisine est un art éphémère. Mais quand votre plat signature est copié par le restaurant d'en face, avez-vous un recours ?",
    date: "05 Fév. 2026",
    category: "Art de vivre",
    content: `
      <p>Le droit est complexe en cuisine. On ne brevette pas une recette, car c'est une succession d'instructions techniques. Cependant, le dressage, l'aspect visuel et la combinaison créative peuvent relever du droit d'auteur.</p>
      <p>Pour un Chef, voir sa création signature plagiée est un crève-cœur. Documenter vos fiches techniques et prendre des photos datées de vos dressages permet de constituer un dossier d'antériorité. Si le litige monte, vous pourrez démontrer que vous êtes l'initiateur de cette tendance culinaire.</p>
    `
  },

  // --- JANVIER 2026 ---
  {
    slug: "ia-prompts-engineering",
    title: "Prompt Engineers : Vos prompts valent de l'or",
    excerpt: "Vous avez mis des heures à tuner ce prompt Midjourney. Protégez votre ingénierie textuelle.",
    date: "28 Janv. 2026",
    category: "Tech",
    content: `
      <p>Le "Prompt Engineering" est devenu un métier à part entière. Un prompt complexe de 50 lignes capable de générer un résultat cohérent est une création intellectuelle.</p>
      <p>Ne partagez pas vos "recettes magiques" sur Discord ou Reddit sans avoir figé votre paternité dessus. C'est votre savoir-faire technique qui est en jeu. Un simple horodatage de votre fichier texte contenant vos prompts suffit à prouver votre antériorité.</p>
    `
  },
  {
    slug: "tatoueurs-flashs",
    title: "Tatoueurs : Le fléau du vol de flashs sur Instagram",
    excerpt: "Vos dessins se retrouvent tatoués par d'autres à l'autre bout du monde ? Voici comment réagir.",
    date: "22 Janv. 2026",
    category: "Art",
    content: `
      <p>Instagram est votre vitrine, mais c'est aussi un supermarché gratuit pour les tatoueurs peu scrupuleux. Un "flash" est une œuvre graphique protégée par le droit d'auteur.</p>
      <p>Avant de poster votre planche, prenez le réflexe de certifier le fichier haute définition. Cela ne vous empêchera pas d'être copié, mais cela vous donnera les munitions nécessaires pour faire supprimer les copies via les formulaires DMCA des réseaux sociaux.</p>
    `
  },
  {
    slug: "architectes-bim",
    title: "Architectes : Protéger vos fichiers BIM et rendus 3D",
    excerpt: "Vos concepts finissent parfois dans les projets des autres après un appel d'offres perdu. Sécurisez vos plans.",
    date: "15 Janv. 2026",
    category: "Architecture",
    content: `
      <p>Un concours d'architecture demande des centaines d'heures de travail. Il arrive que le projet lauréat s'inspire "étrangement" des propositions non retenues.</p>
      <p>Vos fichiers BIM et vos rendus 3D sont la preuve de votre travail. Les horodater avant la remise des plis permet de figer l'état de votre création intellectuelle. C'est une assurance peu coûteuse par rapport aux honoraires d'un projet public.</p>
    `
  },
  {
    slug: "standup-blagues",
    title: "Humoristes : On vous a volé votre meilleure vanne ?",
    excerpt: "Le plagiat dans le stand-up est tabou mais réel. Comment prouver que la blague était la vôtre ?",
    date: "08 Janv. 2026",
    category: "Spectacle",
    content: `
      <p>Une blague, c'est un texte, un rythme, une chute. C'est une œuvre de l'esprit. Quand un humoriste plus connu reprend votre sketch à la télé, c'est votre carrière qui en pâtit.</p>
      <p>Enregistrez vos répétitions, écrivez vos textes, et datez-les de manière certaine. Si vous avez la preuve que vous jouiez ce sketch dans un café-théâtre six mois avant lui, le public et la profession sauront rétablir la vérité.</p>
    `
  },

  // --- DÉCEMBRE 2025 ---
  {
    slug: "dev-freelance-impaye",
    title: "Développeurs Freelance : Le client ne paie pas mais garde le code",
    excerpt: "Classique : le projet est fini, le client ne paie pas le solde, mais il met le site en ligne.",
    date: "20 Déc. 2025",
    category: "Tech",
    content: `
      <p>Vous avez livré les sources, et le client fait le mort pour la dernière facture. Pourtant, il utilise votre code. Sans cession de droits signée (souvent conditionnée au paiement complet), il est en contrefaçon.</p>
      <p>Avoir une preuve d'antériorité de votre code source avant la livraison vous permet de démontrer que vous êtes l'auteur unique. C'est un levier de négociation redoutable pour débloquer un paiement : "Soit vous réglez la facture, soit je fais valoir mes droits d'auteur".</p>
    `
  },
  {
    slug: "design-meuble",
    title: "Designers mobilier : De l'atelier à l'usine sans se faire doubler",
    excerpt: "Vous envoyez vos plans techniques à une usine pour un prototype. Et si l'usine lançait la prod sans vous ?",
    date: "14 Déc. 2025",
    category: "Design",
    content: `
      <p>C'est la hantise du designer industriel. Vous envoyez les plans d'une chaise innovante à un fabricant, et vous la retrouvez vendue sous une autre marque l'année suivante.</p>
      <p>Le secret des affaires et le droit d'auteur vous protègent, à condition de prouver que c'est VOUS qui avez envoyé ces plans spécifiques à cette date. Un certificat numérique joint à votre email de commande change tout le rapport de force.</p>
    `
  },
  {
    slug: "journaliste-source",
    title: "Journalistes : Protéger ses sources et ses enquêtes",
    excerpt: "Dans une enquête sensible, prouver qu'on détenait une info à une date précise peut être vital.",
    date: "05 Déc. 2025",
    category: "Média",
    content: `
      <p>Le travail d'investigation prend du temps. Parfois, on se fait "scooper" ou on est accusé de diffamation. Pouvoir prouver que l'on détenait des documents ou des enregistrements à une date donnée renforce la crédibilité du journaliste.</p>
      <p>L'ancrage blockchain permet de sceller des preuves numériques sans avoir à les confier à un tiers, garantissant une confidentialité totale pour vos sources.</p>
    `
  },

  // --- NOVEMBRE 2025 ---
  {
    slug: "musique-remix-bootleg",
    title: "DJs et Producteurs : Le problème des Remix non officiels",
    excerpt: "Vous avez fait un remix incroyable qui cartonne sur Soundcloud. Avez-vous des droits dessus ?",
    date: "28 Nov. 2025",
    category: "Musique",
    content: `
      <p>Juridiquement, un remix sans autorisation est complexe. Mais votre apport créatif (l'arrangement, le drop, la structure) vous appartient.</p>
      <p>Avant de poster votre son, protégez votre projet DAW. Si un label décide un jour d'officialiser le remix ou si un autre DJ vole votre arrangement, vous aurez les preuves pour revendiquer votre part du gâteau.</p>
    `
  },
  {
    slug: "jeux-societe-regles",
    title: "Créateurs de jeux de société : Protéger une mécanique ludique",
    excerpt: "Les règles d'un jeu sont difficiles à protéger. Mais le livret de règles, lui, est un texte protégé.",
    date: "15 Nov. 2025",
    category: "Loisirs",
    content: `
      <p>On ne protège pas l'idée de "lancer des dés pour avancer". En revanche, la rédaction précise de vos règles, le design de vos cartes et l'univers graphique sont protégés.</p>
      <p>Figez l'ensemble de vos éléments (règles PDF, illustrations) avant de présenter votre prototype à des éditeurs ou sur des salons comme Cannes ou Essen.</p>
    `
  },
  {
    slug: "mode-sneakers",
    title: "Custom Sneakers : Quand Nike s'inspire de vous",
    excerpt: "La culture custom est énorme. Mais quand une grande marque sort un coloris identique au vôtre, que faire ?",
    date: "02 Nov. 2025",
    category: "Mode",
    content: `
      <p>Les frontières sont floues entre hommage et copie dans la Street Culture. Si vous avez créé un design original sur une base existante, votre apport artistique est protégeable.</p>
      <p>Une photo datée et certifiée de votre création, publiée avant la sortie officielle de la marque, peut suffire à créer un "bad buzz" pour la marque copieuse et à vous faire reconnaître.</p>
    `
  },

  // --- OCTOBRE 2025 ---
  {
    slug: "science-lab-notes",
    title: "Chercheurs : Le cahier de laboratoire numérique",
    excerpt: "La course à la publication est féroce. Vos résultats préliminaires doivent être datés.",
    date: "25 Oct. 2025",
    category: "Science",
    content: `
      <p>Le cahier de labo papier a vécu. Aujourd'hui, les données sont massives. En horodatant régulièrement vos datasets et vos conclusions intermédiaires, vous créez une timeline scientifique inattaquable.</p>
      <p>C'est essentiel pour revendiquer la paternité d'une découverte en cas de conflit avec une équipe concurrente ou un ancien collaborateur.</p>
    `
  },
  {
    slug: "agence-appel-offre",
    title: "Agences Pub : Le concept volé après une compétition",
    excerpt: "Vous perdez le pitch, mais 3 mois plus tard, la marque sort une campagne qui ressemble à 90% à la vôtre.",
    date: "18 Oct. 2025",
    category: "Business",
    content: `
      <p>C'est un classique douloureux. La marque a aimé votre idée mais pas votre devis. Elle l'a donc donnée à refaire à une agence moins chère.</p>
      <p>Si vous avez pris soin de certifier votre présentation stratégique avant l'envoi, vous pouvez prouver le "parasitisme". Une simple notification juridique suffit souvent à obtenir une indemnisation transactionnelle.</p>
    `
  },
  {
    slug: "dev-jeu-video-lore",
    title: "Game Designers : Protégez votre 'Lore' et vos personnages",
    excerpt: "Le code est important, mais l'univers (Bible, Scénario, Design des persos) l'est tout autant.",
    date: "10 Oct. 2025",
    category: "Tech",
    content: `
      <p>Un studio indépendant mise tout sur son originalité. Si un gros éditeur mobile clone votre univers graphique et votre histoire, c'est votre identité qui est diluée.</p>
      <p>Regroupez vos concept arts, vos fiches personnages et votre bible narrative dans une archive et sécurisez-la. C'est votre patrimoine immatériel.</p>
    `
  },

  // --- SEPTEMBRE 2025 ---
  {
    slug: "traducteur-oeuvre",
    title: "Traducteurs : Votre traduction est une œuvre à part entière",
    excerpt: "On l'oublie souvent, mais le traducteur possède des droits d'auteur sur sa version du texte.",
    date: "28 Sept. 2025",
    category: "Littérature",
    content: `
      <p>Traduire, c'est trahir, mais c'est surtout écrire. Votre choix des mots, votre rythme, votre style vous appartiennent.</p>
      <p>Avant d'envoyer votre manuscrit traduit à une maison d'édition, protégez-le. En cas de litige sur le contrat ou de publication non autorisée, vous pourrez prouver l'état de votre travail.</p>
    `
  },
  {
    slug: "influenceur-format",
    title: "Créateurs TikTok : On vous a volé votre concept de vidéo ?",
    excerpt: "Une trend, c'est viral. Mais un format original d'émission récurrent sur TikTok, ça se protège.",
    date: "20 Sept. 2025",
    category: "Média",
    content: `
      <p>Vous avez inventé un concept d'interview spécifique ? Une mise en scène unique ? Si une marque ou un gros influenceur le reprend à l'identique, c'est du pillage.</p>
      <p>Même si la "trend" appartient à tout le monde, la structure unique de votre format vidéo peut être protégée si elle est bien documentée.</p>
    `
  },
  {
    slug: "logos-rejets",
    title: "Graphistes : Que faire des logos refusés ?",
    excerpt: "Le client a refusé la piste A. Un an plus tard, il l'utilise quand même.",
    date: "12 Sept. 2025",
    category: "Design",
    content: `
      <p>Les pistes refusées restent votre propriété. Le client n'a payé que pour la piste finale retenue.</p>
      <p>En ayant une preuve datée de toutes vos propositions (A, B et C), vous pouvez démontrer que le client a pioché dans vos archives sans payer. C'est une contrefaçon caractérisée.</p>
    `
  },
  {
    slug: "impression-3d",
    title: "Makers & 3D : Protégez vos fichiers STL",
    excerpt: "Vous partagez vos modèles 3D ? Attention aux licences Creative Commons non respectées.",
    date: "05 Sept. 2025",
    category: "Tech",
    content: `
      <p>Vous avez modélisé une pièce unique et vous la retrouvez en vente sur Etsy imprimée par quelqu'un d'autre. Si vous avez mis une licence "Non-Commercial", ils sont en tort.</p>
      <p>Mais pour prouver que VOUS êtes l'auteur original du fichier STL, rien ne vaut un certificat d'antériorité datant de la création du fichier, bien avant leur boutique.</p>
    `
  },

  // --- AOUT 2025 ---
  {
    slug: "coach-methode",
    title: "Coachs & Formateurs : Votre méthode pédagogique est votre business",
    excerpt: "Vos slides de formation et vos exercices se retrouvent chez un concurrent ?",
    date: "25 Aoû. 2025",
    category: "Business",
    content: `
      <p>Le savoir est libre, mais la *forme* de votre enseignement (vos supports, votre structure, vos schémas) est protégée.</p>
      <p>Figez vos supports de cours avant de les distribuer en PDF à vos élèves. Cela dissuade la "réutilisation" commerciale par d'anciens participants.</p>
    `
  },
  {
    slug: "parfumeur-formule",
    title: "Nez & Parfumeurs : La fragrance invisible",
    excerpt: "La protection des parfums est un débat juridique houleux. Mais la formule écrite, elle, se protège.",
    date: "18 Aoû. 2025",
    category: "Art",
    content: `
      <p>Si l'odeur elle-même est difficile à protéger, la formule chimique et le dossier de création marketing sont des œuvres tangibles.</p>
      <p>Garder le secret est vital. Utiliser un horodatage chiffré permet de prouver la possession de la formule sans jamais la dévoiler publiquement.</p>
    `
  },
  {
    slug: "choregraphie-danse",
    title: "Chorégraphes : La danse est aussi une œuvre",
    excerpt: "De Fortnite à TikTok, les pas de danse sont devenus un business. À qui appartiennent-ils ?",
    date: "10 Aoû. 2025",
    category: "Art",
    content: `
      <p>Une chorégraphie est une œuvre de l'esprit si elle est originale. Pour la protéger, il faut la fixer : vidéo, notation Laban, description.</p>
      <p>Déposez une vidéo de votre chorégraphie avant de la montrer en audition ou de la poster. C'est votre meilleure assurance contre l'appropriation.</p>
    `
  },

  // --- JUILLET 2025 ---
  {
    slug: "jardin-paysagiste",
    title: "Paysagistes : Vos plans de jardins sont des œuvres d'art",
    excerpt: "Le client prend vos croquis 'pour réfléchir' et fait réaliser le jardin par un jardinier moins cher.",
    date: "28 Juil. 2025",
    category: "Architecture",
    content: `
      <p>Le plan d'un jardin, le choix des essences, l'agencement des espaces... c'est une création architecturale.</p>
      <p>Ne laissez pas vos idées germer chez les autres sans rémunération. Protégez vos études préliminaires.</p>
    `
  },
  {
    slug: "escape-game-scenario",
    title: "Escape Games : Protéger ses énigmes et mécanismes",
    excerpt: "Concevoir une salle demande des mois. Voir son scénario copié par la concurrence est rageant.",
    date: "15 Juil. 2025",
    category: "Loisirs",
    content: `
      <p>Le scénario, l'enchaînement des énigmes et les plans techniques des mécanismes forment l'identité de votre salle.</p>
      <p>Une "Bible de Salle" horodatée est la preuve de votre investissement créatif face aux copieurs.</p>
    `
  },
  {
    slug: "ux-ui-design",
    title: "Designers UX/UI : Vos wireframes ont de la valeur",
    excerpt: "L'interface est l'âme de l'application. Ne la laissez pas se faire cloner.",
    date: "05 Juil. 2025",
    category: "Tech",
    content: `
      <p>On ne protège pas la fonctionnalité "Panier", mais on protège le design spécifique de votre interface.</p>
      <p>Conservez une trace de vos recherches, de vos maquettes Figma et de vos itérations. C'est l'histoire de votre design.</p>
    `
  },

  // --- JUIN 2025 ---
  {
    slug: "magie-tour",
    title: "Magiciens : Le secret du tour",
    excerpt: "Dans la magie, le secret est tout. Mais la mise en scène du tour vous appartient.",
    date: "22 Juin 2025",
    category: "Spectacle",
    content: `
      <p>Le "truc" n'est pas protégeable, mais le script, la scénographie et la présentation le sont.</p>
      <p>Avant de présenter un nouveau numéro en festival, assurez-vous d'avoir une preuve de sa création.</p>
    `
  },
  {
    slug: "poterie-ceramique",
    title: "Céramistes : Formes et émaux uniques",
    excerpt: "Quand une grande enseigne de déco copie votre vase artisanal...",
    date: "14 Juin 2025",
    category: "Art",
    content: `
      <p>L'artisanat d'art est très exposé à la copie industrielle. Vos formes originales sont protégées par le droit d'auteur.</p>
      <p>Photographiez vos créations sous tous les angles et datez-les avant exposition.</p>
    `
  },
  {
    slug: "podcast-script",
    title: "Podcasteurs : Protéger le script de votre fiction audio",
    excerpt: "Le podcast narratif explose. Les producteurs de cinéma s'y intéressent pour des adaptations.",
    date: "02 Juin 2025",
    category: "Média",
    content: `
      <p>Votre série audio est un scénario comme un autre. Avant d'envoyer le pilote, protégez l'écrit.</p>
      <p>Cela facilite grandement la vente des droits d'adaptation plus tard.</p>
    `
  },

  // --- MAI 2025 ---
  {
    slug: "fanfiction-droit",
    title: "Auteurs de Fanfictions : Avez-vous des droits ?",
    excerpt: "Zone grise juridique : l'univers n'est pas à vous, mais vos mots le sont.",
    date: "25 Mai 2025",
    category: "Littérature",
    content: `
      <p>Fifty Shades of Grey a commencé comme une fanfiction. Si vous changez les noms pour en faire une œuvre originale, vous devez prouver l'origine.</p>
      <p>Gardez vos brouillons originaux précieusement.</p>
    `
  },
  {
    slug: "algo-trading",
    title: "Traders : Protéger un algorithme de trading",
    excerpt: "Votre bot fait des miracles ? Le code est votre secret le mieux gardé.",
    date: "15 Mai 2025",
    category: "Tech",
    content: `
      <p>La finance est impitoyable. Un algo performant volé perd toute sa valeur.</p>
      <p>L'horodatage permet de prouver la paternité du code sans avoir à le déposer chez un tiers (risque de fuite).</p>
    `
  },
  {
    slug: "typographie-font",
    title: "Typographes : Le dessin de la lettre",
    excerpt: "Créer une police de caractères demande des mois. Le piratage de fichiers de font est massif.",
    date: "08 Mai 2025",
    category: "Design",
    content: `
      <p>Une police est un logiciel et une œuvre graphique. Double protection.</p>
      <p>Certifiez vos fichiers sources (.glyphs ou .ufo) régulièrement.</p>
    `
  },

  // --- AVRIL 2025 ---
  {
    slug: "bijoux-createur",
    title: "Joailliers : Le dessin du bijou",
    excerpt: "Un pendentif unique copié en toc dans une chaîne de magasins.",
    date: "20 Avr. 2025",
    category: "Art",
    content: `
      <p>Le croquis initial de votre bijou est la preuve de votre originalité.</p>
      <p>Ne jetez jamais vos carnets de croquis. Numérisez-les et datez-les.</p>
    `
  },
  {
    slug: "cartographie-map",
    title: "Cartographes & Illustrateurs de maps",
    excerpt: "Les cartes imaginaires ou artistiques sont des œuvres graphiques.",
    date: "12 Avr. 2025",
    category: "Art",
    content: `
      <p>Vous avez dessiné une carte pour un roman ou un jeu ? C'est une création protégée.</p>
      <p>Méfiez-vous des utilisations non autorisées sur le web.</p>
    `
  },
  {
    slug: "chimie-formule",
    title: "Industrie : La formule chimique non brevetée",
    excerpt: "Comme pour le Coca-Cola, le secret est parfois mieux que le brevet.",
    date: "05 Avr. 2025",
    category: "Science",
    content: `
      <p>Si vous choisissez le secret plutôt que le brevet, vous devez pouvoir prouver la date de votre invention en interne.</p>
      <p>C'est ce qu'on appelle la possession personnelle antérieure.</p>
    `
  },

  // --- MARS 2025 ---
  {
    slug: "evenementiel-concept",
    title: "Organisateurs d'événements : On vous pique votre thème ?",
    excerpt: "Vous proposez une soirée à thème unique à un lieu, ils la font sans vous.",
    date: "28 Mar. 2025",
    category: "Business",
    content: `
      <p>Le concept de l'événement, la déco, le déroulé... tout cela forme une œuvre.</p>
      <p>Envoyez votre dossier de présentation avec une preuve d'antériorité pour calmer les ardeurs.</p>
    `
  },
  {
    slug: "sport-tactique",
    title: "Coachs sportifs : Une méthode d'entraînement unique",
    excerpt: "Votre programme PDF se retrouve vendu par un autre coach.",
    date: "15 Mar. 2025",
    category: "Sport",
    content: `
      <p>La rédaction et la structure de votre programme sont protégées par le droit d'auteur.</p>
      <p>Signez numériquement vos PDF avant vente.</p>
    `
  },
  {
    slug: "tricot-patron",
    title: "Designers Tricot & Couture : Le vol de patrons",
    excerpt: "Ravelry et Etsy sont des jungles. Vos PDF sont copiés et revendus.",
    date: "02 Mar. 2025",
    category: "Art de vivre",
    content: `
      <p>Un patron est une œuvre technique et littéraire. Vous avez des droits.</p>
      <p>La preuve de création vous aide à faire tomber les boutiques illégales.</p>
    `
  },

  // --- FEVRIER 2025 ---
  {
    slug: "startup-nom",
    title: "Naming : J'ai trouvé un nom génial, comment le garder ?",
    excerpt: "Le nom de domaine est libre, mais la marque ?",
    date: "20 Fév. 2025",
    category: "Business",
    content: `
      <p>Avant de déposer la marque (coûteux), prouvez que vous utilisiez ce nom commercialement.</p>
      <p>Cela peut constituer une antériorité d'usage.</p>
    `
  },
  {
    slug: "street-art-graffiti",
    title: "Street Art : L'éphémère a-t-il des droits ?",
    excerpt: "Votre fresque murale finit dans une pub télé sans votre accord.",
    date: "10 Fév. 2025",
    category: "Art",
    content: `
      <p>Même illégal (parfois), le graffiti est une œuvre protégée par le droit d'auteur.</p>
      <p>Prenez une photo datée dès la fin de la réalisation. C'est votre seule preuve une fois le mur repeint.</p>
    `
  },
  {
    slug: "modding-jeux",
    title: "Moddeurs : Quand les fans améliorent le jeu",
    excerpt: "Vous avez créé un mod téléchargé 1 million de fois. Le studio l'intègre sans vous citer.",
    date: "01 Fév. 2025",
    category: "Tech",
    content: `
      <p>La relation avec les éditeurs est complexe, mais votre code et vos assets vous appartiennent.</p>
      <p>Gardez une trace de vos versions.</p>
    `
  },

  // --- JANVIER 2025 ---
  {
    slug: "menuiserie-plans",
    title: "Menuisiers & Artisans : Vos plans techniques",
    excerpt: "Le client part avec votre plan pour le faire fabriquer moins cher ailleurs.",
    date: "20 Janv. 2025",
    category: "Artisanat",
    content: `
      <p>Le devis est gratuit, mais le plan est une œuvre intellectuelle.</p>
      <p>Mentionnez que les plans restent votre propriété tant que le devis n'est pas signé.</p>
    `
  },
  {
    slug: "livre-blanc",
    title: "Consultants : Protéger votre méthodologie (Livre Blanc)",
    excerpt: "Votre ebook gratuit est une mine d'or pour vos concurrents qui le copient-collent.",
    date: "12 Janv. 2025",
    category: "Business",
    content: `
      <p>Votre expertise écrite est votre meilleur atout marketing.</p>
      <p>Horodatez votre contenu avant publication pour prouver que vous êtes l'expert original.</p>
    `
  },
  {
    slug: "restauration-art",
    title: "Restaurateurs d'art : Documenter l'avant/après",
    excerpt: "Prouver l'état de l'œuvre avant votre intervention est crucial pour l'assurance.",
    date: "05 Janv. 2025",
    category: "Art",
    content: `
      <p>En cas de problème durant la restauration, vos photos certifiées font foi.</p>
      <p>C'est une protection juridique indispensable pour votre responsabilité professionnelle.</p>
    `
  },

  // --- 2024 (Archives) ---
  {
    slug: "bd-webtoon",
    title: "Auteurs BD & Webtoon : Le storyboard",
    excerpt: "Ne montrez pas tout tout de suite. Protégez le découpage.",
    date: "15 Déc. 2024",
    category: "Art",
    content: `
      <p>Le storyboard est l'architecture de votre récit. C'est là que tout se joue.</p>
      <p>Une protection précoce évite bien des soucis de plagiat narratif.</p>
    `
  },
  {
    slug: "data-science-dataset",
    title: "Data Scientists : La valeur du Dataset nettoyé",
    excerpt: "Le code est open source, mais vos données nettoyées valent cher.",
    date: "20 Nov. 2024",
    category: "Tech",
    content: `
      <p>Le nettoyage de données est un travail colossal. Protégez la base de données (droit sui generis).</p>
      <p>Horodatez l'état de votre base à intervalles réguliers.</p>
    `
  },
  {
    slug: "yoga-sequence",
    title: "Profs de Yoga : Une séquence originale",
    excerpt: "L'enchaînement spécifique de postures peut être une chorégraphie protégée.",
    date: "10 Oct. 2024",
    category: "Sport",
    content: `
      <p>Si votre "Flow" est créatif et unique, c'est une œuvre.</p>
      <p>Filmez-le et datez-le avant de le mettre en ligne.</p>
    `
  },
  {
    slug: "app-mobile-mockup",
    title: "Entrepreneurs App : Le mockup interactif",
    excerpt: "Votre prototype InVision circule. Êtes-vous sûr de qui le voit ?",
    date: "15 Sept. 2024",
    category: "Tech",
    content: `
      <p>Le prototype fonctionnel est plus parlant qu'un cahier des charges.</p>
      <p>C'est la matérialisation de votre idée. Protégez-le.</p>
    `
  },
  {
    slug: "histoire-these",
    title: "Historiens : Une découverte dans les archives",
    excerpt: "Vous trouvez un document inédit. Comment prouver votre primauté ?",
    date: "20 Aoû. 2024",
    category: "Science",
    content: `
      <p>La découverte d'un fait n'est pas protégeable, mais votre texte d'analyse l'est.</p>
      <p>Datez votre brouillon dès la rédaction.</p>
    `
  },
  {
    slug: "spectacle-lumiere",
    title: "Régisseurs lumière : La création lumière est une œuvre",
    excerpt: "L'éclairage d'un spectacle fait partie de la mise en scène.",
    date: "05 Juil. 2024",
    category: "Spectacle",
    content: `
      <p>Le plan de feu et la conduite lumière sont des documents techniques protégés.</p>
      <p>Ne laissez pas la prod les réutiliser pour la tournée sans vous.</p>
    `
  },
  {
    slug: "entreprise-process",
    title: "Industrie : Le savoir-faire non écrit",
    excerpt: "Vos employés partent avec vos méthodes de fabrication.",
    date: "10 Juin. 2024",
    category: "Business",
    content: `
      <p>Formalisez vos processus internes par écrit et horodatez-les.</p>
      <p>C'est la base pour attaquer en concurrence déloyale.</p>
    `
  },
  {
    slug: "photo-drone",
    title: "Pilotes de Drone : Vidéos aériennes volées",
    excerpt: "Vos plans magnifiques finissent dans des clips immobiliers.",
    date: "15 Mai 2024",
    category: "Art",
    content: `
      <p>La vidéo aérienne est très prisée. Conservez les fichiers bruts (Rushs).</p>
      <p>Ils contiennent les métadonnées prouvant votre propriété.</p>
    `
  },
  {
    slug: "maquillage-fx",
    title: "Maquilleurs FX : Créatures et prothèses",
    excerpt: "Votre design de monstre est repris dans un autre film.",
    date: "20 Avr. 2024",
    category: "Art",
    content: `
      <p>Le design d'un personnage (Character Design) est protégé.</p>
      <p>Gardez vos moules et vos croquis préparatoires.</p>
    `
  }
];
