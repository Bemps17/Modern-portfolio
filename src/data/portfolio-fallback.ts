import type { Experience, Media, Project, Qualification, Skill } from '@/payload-types'

const LEGACY_SITE = 'https://projet-refonte-portfolio-persov1-0.vercel.app'

function legacyMedia(path: string | null, alt: string): Media | null {
  if (!path) return null
  const url = path.startsWith('http')
    ? path
    : path.startsWith('/projects/') || path.startsWith('/images/')
      ? path
      : `${LEGACY_SITE}${path}`
  return {
    id: 0,
    alt,
    url,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  } as Media
}

type LegacyProject = {
  id: string
  title: string
  description: string
  tags: string[]
  image: string | null
  link: string | null
  github?: string | null
}

export const legacyProjects: LegacyProject[] = [
  {
    id: 'world-cup-scores-2026',
    title: 'World Cup Scores 2026',
    description:
      'Suivi premium des scores et pronostics — Coupe du Monde FIFA 2026. Interface mobile-first, classements live et parcours pronostics.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    image: 'https://world-cup2026-olive.vercel.app/icon.svg',
    link: 'https://world-cup2026-olive.vercel.app/',
    github: null,
  },
  {
    id: 'bscl',
    title: 'BSCL — Black Squad Competitive League',
    description:
      'Ligue compétitive dédiée à Black Squad : PUGs 5v5, classements ELO, équipes et tournois. Auth Discord OAuth, bot Discord.js, Prisma et Supabase.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Node', 'Vercel'],
    image: 'https://bscl-project.vercel.app/favicon.ico',
    link: 'https://bscl.gg',
    github: 'https://github.com/Bemps17/BsclProject',
  },
  {
    id: 'modern-portfolio',
    title: 'Modern Portfolio',
    description:
      'Refonte CMS-driven du portfolio : Next.js 16, Payload 3, Neon Postgres, design glassmorphism et déploiement Vercel. Développé avec Cursor.',
    tags: ['Next.js', 'Payload', 'TypeScript', 'Neon', 'Tailwind', 'Framer Motion'],
    image: '/images/profil-picNb.png',
    link: 'https://modern-portfolio-two-orcin.vercel.app/',
    github: 'https://github.com/Bemps17/Modern-portfolio',
  },
  {
    id: 'ahistory',
    title: 'AHistory',
    description:
      'Application interactive de visualisation historique avec timeline dynamique, cartes géographiques et mode éducation.',
    tags: ['Interactive', 'Timeline', 'Maps'],
    image: '/projects/ahistory-cover.jpg',
    link: 'https://ahistory.netlify.app/',
  },
  {
    id: 'chronorganizer',
    title: 'ChronOrganizer',
    description:
      'Organisateur temporel avec méthode Pomodoro. Gestion de focus, pauses et statistiques de productivité.',
    tags: ['Pomodoro', 'Productivity', 'Audio'],
    image: '/projects/chronorganizer-cover.jpg',
    link: 'https://chronorganizer.netlify.app/',
  },
  {
    id: 'coursfull',
    title: 'CoursFull',
    description:
      "Plateforme d'apprentissage en ligne complète. Gestion des cours, suivi des étudiants, interface d'administration et tableaux de bord.",
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Dashboard'],
    image: '/projects/coursfull-cover.jpg',
    link: 'https://coursfull.netlify.app/',
  },
  {
    id: 'eisenhowermatrix',
    title: 'Eisenhower Matrix',
    description:
      'Matrice de gestion des priorités interactive. Tri visuel des tâches par importance et urgence.',
    tags: ['Priorities', 'Matrix', 'Organization'],
    image: '/projects/eisenhowermatrix-cover.jpg',
    link: 'https://eisenhowermatrixv1.netlify.app/',
  },
  {
    id: 'flutterisation',
    title: 'Flutterisation',
    description:
      'Ressources et outils pour le développement Flutter. Générateurs de code et templates.',
    tags: ['Flutter', 'Dart', 'Code Gen'],
    image: '/projects/flutterisation-cover.jpg',
    link: 'https://flutterisation.netlify.app/',
  },
  {
    id: 'guidestream',
    title: 'GuideStream',
    description:
      'Plateforme de streaming avec guides interactifs synchronisés à la vidéo. Chapitrage et notes.',
    tags: ['Video API', 'Streaming', 'Education'],
    image: '/projects/guidestream-cover.jpg',
    link: 'https://guidestream.netlify.app/',
    github: 'https://github.com/Bemps17/Guide-streaming-',
  },
  {
    id: 'juriaide',
    title: 'JuriAide',
    description:
      "Assistant juridique numérique. Base de connaissances, générateur de documents et chatbot d'assistance.",
    tags: ['Chatbot', 'Document Gen', 'Legal'],
    image: '/projects/juriaide-cover.jpg',
    link: 'https://juriaide.netlify.app/',
  },
  {
    id: 'lehangar8',
    title: 'Le Hangar 8',
    description:
      'Identité visuelle complète pour un tiers-lieu. Branding, signalétique et supports de com.',
    tags: ['Branding', 'Figma', 'Print'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/H8testv1',
  },
  {
    id: 'mapointeuse',
    title: 'MaPointeuse',
    description:
      'Pointeuse digitale pour gestion du temps de travail. Simulation biométrique, rapports PDF et mode hors ligne.',
    tags: ['PWA', 'Biometrics', 'PDF Generation'],
    image: '/projects/mapointeuse-cover.jpg',
    link: 'https://mapointeuse.netlify.app/',
  },
  {
    id: 'poolscore',
    title: 'PoolScore',
    description:
      'Système de notation pour compétitions de billard. Tableaux de classement live et gestion multi-tables.',
    tags: ['WebSocket', 'Real-time', 'Competition'],
    image: '/projects/poolscore-cover.jpg',
    link: 'https://poolscore.netlify.app/',
  },
  {
    id: 'pooltimer',
    title: 'PoolTimer',
    description:
      'Chronomètre professionnel pour joueurs de billard anglais. Statistiques en temps réel et historique des parties.',
    tags: ['PWA', 'Timer', 'Analytics'],
    image: '/projects/pooltimer-cover.jpg',
    link: 'https://pooltimer.netlify.app/',
    github: 'https://github.com/Bemps17/PoolTimer',
  },
  {
    id: 'pooltools',
    title: 'PoolTools',
    description:
      "Suite d'outils pour le billard : calculateur de trajectoires, simulateur de coups et base de techniques.",
    tags: ['Canvas', 'Physics', 'Simulation'],
    image: '/projects/pooltools-cover.jpg',
    link: 'https://pooltools.netlify.app/',
  },
  {
    id: 'seo-checking',
    title: 'SEO Checking',
    description:
      "Outil d'audit SEO rapide. Analyse des balises, performance et suggestions d'optimisation.",
    tags: ['SEO', 'Audit', 'Analytics'],
    image: '/projects/seo-checking-cover.jpg',
    link: 'https://seo-checking.netlify.app/',
  },
  {
    id: 'sitebts',
    title: 'Site BTS Blanc',
    description: "Site vitrine pour l'organisation d'un examen BTS Blanc. Informations et inscriptions.",
    tags: ['WordPress', 'Event', 'Education'],
    image: null,
    link: null,
  },
  {
    id: 'snippetbank',
    title: 'SnippetBank',
    description:
      'Banque de snippets de code pour développeurs. Recherche avancée, tags, syntax highlighting et mode sombre.',
    tags: ['JavaScript', 'LocalStorage', 'Search'],
    image: '/projects/snippetbank-cover.jpg',
    link: 'https://snippetbank.netlify.app/',
    github: 'https://github.com/Bemps17/SnippetBank-',
  },
  {
    id: 'suivijardin',
    title: 'SuiviJardin',
    description:
      'Carnet de suivi pour jardinage. Calendrier des cultures, alertes météo et journal photo.',
    tags: ['Gardening', 'Calendar', 'Photo'],
    image: '/projects/suivijardin-cover.jpg',
    link: 'https://suivijardin.netlify.app/',
  },
  {
    id: 'vacanceslr',
    title: 'VacancesLR',
    description:
      "Planificateur de vacances intelligent avec météo en temps réel, budget et suggestions d'activités.",
    tags: ['API Météo', 'Planning', 'Travel'],
    image: '/projects/vacanceslr-cover.jpg',
    link: 'https://vacanceslr.netlify.app/',
    github: 'https://github.com/Bemps17/la-rochelle-pwa',
  },
  {
    id: 'workfloow',
    title: 'WorkFloow',
    description:
      'Outil de gestion de flux de travail type Kanban. Assignation tâches, collaboration équipe et analytics.',
    tags: ['Kanban', 'Collaboration', 'Analytics'],
    image: '/projects/workfloow-cover.jpg',
    link: 'https://workfloow.netlify.app/',
    github: 'https://github.com/Bemps17/workflow',
  },
  {
    id: 'pomodotask',
    title: 'PomoDoTask',
    description:
      'Gestionnaire de tâches avec technique Pomodoro. Sessions focus, pauses programmées et déploiement Vercel.',
    tags: ['JavaScript', 'Pomodoro', 'Productivity', 'Vercel'],
    image: null,
    link: 'https://pomodotaskv1.vercel.app',
    github: 'https://github.com/Bemps17/Pomodotaskv1',
  },
  {
    id: 'pool-story',
    title: 'Pool Story',
    description:
      'Application web autour du billard — narration et suivi de parties, interface HTML légère.',
    tags: ['HTML5', 'Billiard'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/PoolStory',
  },
  {
    id: 'projet-plato',
    title: 'Projet Plato',
    description:
      'Jeu interactif Plato — React, Vite et NextUI. Expérimentation UI gamifiée.',
    tags: ['React', 'TypeScript', 'Vite'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/ProjetPlato',
  },
  {
    id: 'react-academy',
    title: 'React Academy',
    description:
      "Plateforme d'apprentissage React — parcours guidés et exercices pratiques, déployée sur Vercel.",
    tags: ['React', 'HTML5', 'Education', 'Vercel'],
    image: null,
    link: 'https://reactacademy-beige.vercel.app',
    github: 'https://github.com/Bemps17/Reactacademy',
  },
  {
    id: 'scoreur',
    title: 'Scoreur',
    description:
      'Application de scoring en JavaScript — suivi de points et tableaux de résultats.',
    tags: ['JavaScript', 'Scoring'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/scoreur',
  },
  {
    id: 'calcul-mutuelle',
    title: 'Calcul Mutuelle',
    description:
      'Outil de calcul pour remboursements mutuelle — interface simple et formulaires HTML.',
    tags: ['HTML5', 'Calculator'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/Calculmutuelle',
  },
  {
    id: 'manus-malakoff',
    title: 'Manus Malakoff',
    description:
      'Projet Manus Malakoff — développement web et identité digitale.',
    tags: ['Web'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/ManusMalakoff-',
  },
  {
    id: 'stream-config',
    title: 'Stream Config',
    description:
      'Site web moderne pour aider à débuter le streaming — guides, configuration matérielle et logicielle.',
    tags: ['JavaScript', 'Streaming', 'Education'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/StreamConfigv1',
  },
  {
    id: 'portfolio-v1',
    title: 'Portfolio v1',
    description:
      'Première version du portfolio personnel — site vitrine HTML/CSS, base de la refonte actuelle.',
    tags: ['HTML5', 'CSS3', 'Portfolio'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/Porfolio-final-v1',
  },
  {
    id: 'site-perso-v2',
    title: 'Site Perso v2',
    description:
      'Deuxième itération du site personnel — exploration CSS avancé et mise en page responsive.',
    tags: ['CSS3', 'Portfolio'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/site-perso-v2',
  },
  {
    id: 'vavances-lr',
    title: 'Vacances La Rochelle',
    description:
      'Planificateur de vacances à La Rochelle — PWA avec météo et suggestions locales.',
    tags: ['HTML5', 'PWA', 'Travel'],
    image: null,
    link: null,
    github: 'https://github.com/Bemps17/VavancesLR-v0.1',
  },
]

function toProject(item: LegacyProject, index: number): Project {
  const coverPath = `/projects/${item.id}-cover.webp`
  const cover = legacyMedia(coverPath, item.title) as Media
  return {
    id: index + 1,
    title: item.title,
    slug: item.id,
    excerpt: item.description.slice(0, 200),
    impact: null,
    cover,
    gallery: [],
    stack: item.tags as Project['stack'],
    liveUrl: item.link,
    repoUrl: item.github ?? null,
    featured: index < 6,
    order: index,
    status: 'published',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  } as unknown as Project
}

export const portfolioFallback = {
  siteSettings: {
    siteName: 'Bertrand Fouquet',
    tagline: 'Je transforme les défis complexes en solutions élégantes.',
    aboutIntro:
      'Web Designer Junior & Profil Polyvalent — une expertise unique forgée par 10+ ans d’expérience : Commercial B2B • Création Web • Logistique.',
    aboutHeadline: 'Profil Unique : La Polyvalence au Service de vos Projets',
    aboutBody:
      'Designer-développeur avec 20 ans d’expérience transversale, je combine créativité visuelle, compétences techniques et sens commercial. Expert en prototypage rapide et création d’applications web assistée par IA (« vibe coding »), je recherche un poste où ma polyvalence sera un véritable atout pour votre équipe, dans un environnement privilégiant la qualité et l’équilibre de vie.\n\nMon parcours est atypique, et c’est ma plus grande force. Après plus de 10 ans dans le commerce et la logistique, j’ai pivoté vers le numérique. Cette expérience m’a appris la rigueur, la gestion de projet et l’importance de la relation client.',
    skillsTitle: 'Compétences Clés',
    skillsSubtitle: 'Votre couteau suisse digital',
    whyMePoints: [
      { id: '1', title: 'Polyvalence', description: 'Commerce, logistique, design et dev — un seul interlocuteur.' },
      { id: '2', title: 'Vision 360°', description: 'Du brief client au déploiement, avec le sens du résultat.' },
      { id: '3', title: 'Innovation', description: 'Prototypage rapide, PWA et outils IA au service du produit.' },
      { id: '4', title: 'Basé à La Rochelle', description: 'Disponible sur place, en remote ou en hybride.' },
    ],
    skillGroups: [
      {
        id: '1',
        title: 'Design & Création',
        items:
          'Suite Adobe CC : Photoshop, Illustrator, InDesign (niveau expert)\nUI/UX Design : Figma, création d’interfaces intuitives\nIdentité visuelle : Logos, chartes graphiques, supports print/web',
      },
      {
        id: '2',
        title: 'Développement & Technique',
        items:
          'Front-End : HTML5/CSS3, JavaScript, responsive design\nCMS & Frameworks : WordPress (expert), WooCommerce\nInnovation : PWA (Progressive Web Apps), IA assistée (GitHub Copilot, ChatGPT)\nMéthodes : Agilité, prototypage rapide, versionning Git',
      },
      {
        id: '3',
        title: 'Commercial & Relationnel',
        items:
          'Gestion client : De la prospection à la fidélisation\nPédagogie : Formation utilisateurs, vulgarisation technique\nManagement : Coordination d’équipes (4+ personnes), gestion de projets',
      },
    ],
    personalProjects: [
      {
        id: '1',
        title: 'PWA personnelle (2023–2025)',
        description:
          'Application web progressive pour organiser mes projets et ma veille — offline-first, itérations rapides.',
      },
      {
        id: '2',
        title: 'Veille techno & expérimentation',
        description:
          'Exploration continue des stacks modernes (Next.js, Payload, IA assistée) via side projects et contributions open source.',
      },
    ],
    location: '17138 Puilboreau · ouvert au remote',
    availability: 'available' as const,
    availabilityLabel: 'Disponible immédiatement',
    approachSteps: [
      {
        id: '1',
        title: 'Cadrer',
        description:
          'Clarifier le problème, les contraintes et le résultat attendu avant d’écrire une ligne.',
      },
      {
        id: '2',
        title: 'Construire',
        description:
          'Livrer une UI nette, un code typé et une stack maintenable — du prototype au ship.',
      },
      {
        id: '3',
        title: 'Mesurer',
        description: 'Valider l’impact, itérer vite, documenter ce qui compte pour la suite.',
      },
    ],
    /** Portrait CMS uniquement — null en mode démo (pas de fallback statique). */
    avatar: null,
    logo: null,
    favicon: null,
    email: 'bertrandfouquet@gmail.com',
    socialLinks: [
      { platform: 'github' as const, url: 'https://github.com/Bemps17', label: 'GitHub' },
      {
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/in/bertandfouquet1984/',
        label: 'LinkedIn',
      },
    ],
    phone: '06 66 93 82 35',
    cvPitch:
      'Professionnel expérimenté avec plus de 10 ans d’expérience dans la relation client, la vente terrain, la logistique et la gestion de projet. Titulaire d’un titre professionnel d’attaché commercial et d’une formation récente en infographie/web, je recherche un poste polyvalent où mes compétences commerciales, logistiques et créatives seront pleinement mobilisées.',
    recommendationQuote:
      'Bertrand a su redynamiser notre prospection commerciale avec des méthodes innovantes, entraînant une augmentation de 30% des leads qualifiés en 3 mois.',
    recommendationAuthor: 'Directeur Commercial, Entreprise X',
    mobility: 'Permis B — véhicule personnel, déplacements régionaux',
    interests: 'Création visuelle, Technologie, Art',
    rqthNote:
      'RQTH (Reconnaissance de la qualité de travailleur handicapé) — problèmes de dos. Adaptations possibles du poste de travail.',
    showRqthOnCv: true,
    languages: [
      { name: 'Anglais', level: 'Conversationnel' },
      { name: 'Espagnol', level: 'Scolaire' },
    ],
    cvCompetencies: [
      {
        name: 'Prospection B2B/B2C',
        level: 85,
        description: 'Techniques de prospection, qualification de leads et conversion',
      },
      {
        name: 'Logistique & Exploitation',
        level: 75,
        description: 'Planification de tournées, gestion des flux, optimisation des processus',
      },
      {
        name: 'Gestion de Projet',
        level: 80,
        description: 'Coordination d’équipes, suivi d’objectifs, optimisation des délais',
      },
      {
        name: 'Infographie & Web Design',
        level: 70,
        description: 'Maquettes, identité visuelle, interfaces utilisateur',
      },
      {
        name: 'Relation Client',
        level: 90,
        description: 'Écoute active, résolution de problèmes, fidélisation',
      },
      {
        name: 'CRM & Outils Digitaux',
        level: 80,
        description: 'Logiciels CRM, tableaux de bord, reporting',
      },
      {
        name: 'Organisation & Autonomie',
        level: 85,
        description: 'Priorités, autonomie, respect des délais',
      },
      {
        name: 'Suite Adobe & Office',
        level: 75,
        description: 'Photoshop, Illustrator, InDesign, Excel, Word, PowerPoint',
      },
    ],
  },
  seoDefaults: {
    defaultTitle: 'Bertrand Fouquet | Développeur Web & Designer Junior',
    defaultDescription:
      'Portfolio de Bertrand Fouquet — Web Designer Junior, profil polyvalent (commercial B2B, création web, logistique).',
    ogImage: null,
  },
  projects: legacyProjects.map(toProject),
  experiences: [
    {
      id: 1,
      title: 'Téléconseiller',
      company: 'Malakoff Humanis',
      dateStart: '2025-11-01',
      dateEnd: null,
      current: true,
      earlyCareer: false,
      description:
        'Téléconseiller pour les appels entrants au sein de la mutuelle Malakoff Humanis : accueil téléphonique, écoute et accompagnement des adhérents. Information, orientation et traitement des demandes dans le respect des procédures et de la qualité de service.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Commercial sédentaire B2B',
      company: 'Téléprospection spécialisée',
      dateStart: '2025-01-01',
      dateEnd: '2025-10-01',
      current: false,
      earlyCareer: false,
      description:
        "Qualification des prospects, pilotage scripts et CRM. Valorisation d'offres digitales auprès de décideurs. Transfert des retours utilisateurs aux équipes produit.",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Agent de planning & Assistant d’exploitation',
      company: 'Sonotra / PAPREC La Rochelle — Groupe Hautier',
      dateStart: '2023-10-01',
      dateEnd: '2024-10-01',
      current: false,
      earlyCareer: false,
      description:
        'Deux missions proches au sein de l’écosystème collecte / recyclage (Groupe Hautier) : agent de planning chez PAPREC et assistant d’exploitation chez Sonotra. Organisation et optimisation des circuits de collecte et des plannings chauffeurs, prise en charge des commandes et de la relation client/exploitation, saisie et suivi des données opérationnelles, coordination avec les équipes terrain et suivi des indicateurs (qualité de service, délais, traçabilité des flux).',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'Chargé de projet informatique embarquée',
      company: 'Transports Hautier',
      dateStart: '2023-06-01',
      dateEnd: '2023-09-01',
      current: false,
      earlyCareer: false,
      description:
        'Pilotage de solutions embarquées pour la flotte : cadrage besoin, coordination technique et déploiement terrain. Interface entre métiers transport et équipes IT.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'Chargé de projet digital',
      company: 'Freelance',
      dateStart: '2023-04-01',
      dateEnd: '2023-05-01',
      current: false,
      earlyCareer: false,
      description:
        'Missions digitales : sites WordPress/WooCommerce, maquettes Figma et intégration responsive HTML/CSS/JS. Prototypage PWA via vibe coding (IA assistée).',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      title: 'Alternance Infographiste Designer Web',
      company: 'La Casquette Digital',
      dateStart: '2023-02-01',
      dateEnd: '2023-03-01',
      current: false,
      earlyCareer: false,
      description:
        'Création de maquettes et intégration web responsive. Première immersion en agence digitale : workflow design → intégration → livraison client.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 7,
      title: 'Responsable de tournée marchés',
      company: 'Couleur Marché',
      dateStart: '2017-01-01',
      dateEnd: '2021-12-01',
      current: false,
      earlyCareer: false,
      description:
        "Management de 4 personnes et planification des marchés. Suivi des indicateurs CA/marge, ajustements pricing. Mise en place d'outils de pilotage simples (Excel/Apps web).",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 8,
      title: 'Freelance Infographiste multimédia',
      company: 'Auto-entrepreneur',
      dateStart: '2016-01-01',
      dateEnd: '2017-12-01',
      current: false,
      earlyCareer: false,
      description:
        'Identités visuelles, supports print et motion pour TPE/PME. Gestion complète de la relation client : brief, production et livraison.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 9,
      title: 'Primeur saisonnier sur les marchés',
      company: 'Melon Direct',
      dateStart: '2013-04-01',
      dateEnd: '2013-09-01',
      current: false,
      earlyCareer: true,
      description: 'Vente de fruits et légumes sur les marchés — relation client et gestion du banc.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 10,
      title: 'Attaché commercial',
      company: 'Telenet Services / Espace Média — Charente-Maritime & Deux-Sèvres',
      dateStart: '2012-03-01',
      dateEnd: '2012-06-01',
      current: false,
      earlyCareer: true,
      description:
        'Distributeur Orange Business Services (Telenet) et distributeur SFR Business Team 1er niveau (Espace Média) — prospection et vente B2B télécoms.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 11,
      title: 'Attaché commercial',
      company: 'Paritel — La Rochelle',
      dateStart: '2011-10-01',
      dateEnd: '2011-12-01',
      current: false,
      earlyCareer: true,
      description: 'Vente et location de standards téléphoniques, abonnements télécoms.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 12,
      title: 'V.R.P. exclusif',
      company: 'Berner — Charente-Maritime, Deux-Sèvres, Charente, Vendée',
      dateStart: '2009-06-01',
      dateEnd: '2011-01-01',
      current: false,
      earlyCareer: true,
      description:
        'Distributeur par vente directe pour les métiers du bâtiment — prospection terrain, négociation et fidélisation sur un large secteur géographique.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 13,
      title: 'Attaché commercial B2B',
      company: 'SCT Telecom — Vendée & Deux-Sèvres',
      dateStart: '2009-01-01',
      dateEnd: '2009-04-01',
      current: false,
      earlyCareer: true,
      description:
        '1er courtier en France, négociant en minutes — vente de solutions fixe et mobile.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 14,
      title: 'Attaché commercial B2B',
      company: 'Artyl Bureau — Charente-Maritime',
      dateStart: '2008-09-01',
      dateEnd: '2008-10-01',
      current: false,
      earlyCareer: true,
      description:
        'Concessionnaire multimarque de systèmes d’impression numérique multifonction.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 15,
      title: 'Attaché commercial B2B',
      company: 'S.A.S. DJM — Charente & Vienne',
      dateStart: '2007-06-01',
      dateEnd: '2008-08-01',
      current: false,
      earlyCareer: true,
      description: 'Distributeur pour Orange Business Services — prospection et vente B2B.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 16,
      title: 'Attaché commercial B2B (alternance)',
      company: 'Initial Services Textiles — Poitiers',
      dateStart: '2006-09-01',
      dateEnd: '2007-05-01',
      current: false,
      earlyCareer: true,
      description:
        'Alternance dans le cadre de la formation AFPA (13 semaines en entreprise) — découverte du métier commercial B2B.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 17,
      title: 'Contrats saisonniers et intérim',
      company: 'Commerce, restauration & accueil',
      dateStart: '2001-01-01',
      dateEnd: '2006-08-01',
      current: false,
      earlyCareer: true,
      description:
        'Vendeur, plongeur, écailler, responsable de banc sur les marchés, agent d’accueil et standardiste, télévendeur, employé libre-service — polyvalence terrain et sens du service.',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ] satisfies Experience[],
  qualifications: [
    {
      id: 1,
      title: 'Certification Infographiste Designer Web (Niveau 5)',
      institution: 'AP Formation',
      year: 2023,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Titre Professionnel Attaché Commercial (Niveau 4)',
      institution: 'AFPA Poitiers',
      year: 2007,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: '1re année de DEUG de Géographie',
      institution: 'Université de La Rochelle',
      year: 2005,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: '1re année de DEUG de Philosophie',
      institution: 'Université de Paris I',
      year: 2004,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'Bac économique et social',
      institution: 'Lycée Camille Claudel — Palaiseau',
      year: 2003,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ] satisfies Qualification[],
  skills: [
    { id: 1, name: 'HTML5', category: 'frontend' },
    { id: 2, name: 'CSS3', category: 'frontend' },
    { id: 3, name: 'JavaScript', category: 'frontend' },
    { id: 4, name: 'React', category: 'frontend' },
    { id: 5, name: 'Vue.js', category: 'frontend' },
    { id: 6, name: 'TypeScript', category: 'frontend' },
    { id: 7, name: 'Tailwind CSS', category: 'frontend' },
    { id: 8, name: 'Node.js', category: 'backend' },
    { id: 9, name: 'Express', category: 'backend' },
    { id: 10, name: 'PHP', category: 'backend' },
    { id: 11, name: 'Python', category: 'backend' },
    { id: 12, name: 'PostgreSQL', category: 'backend' },
    { id: 13, name: 'MySQL', category: 'backend' },
    { id: 14, name: 'MongoDB', category: 'backend' },
    { id: 15, name: 'WordPress', category: 'outils' },
    { id: 16, name: 'WooCommerce', category: 'outils' },
    { id: 17, name: 'Figma', category: 'design' },
    { id: 18, name: 'UI/UX', category: 'design' },
    { id: 19, name: 'Design Systems', category: 'design' },
    { id: 20, name: 'Wireframing', category: 'design' },
    { id: 21, name: 'Git', category: 'outils' },
    { id: 22, name: 'GitHub', category: 'outils' },
    { id: 23, name: 'Docker', category: 'outils' },
    { id: 24, name: 'Vercel', category: 'outils' },
    { id: 25, name: 'ChatGPT', category: 'outils' },
    { id: 26, name: 'Claude', category: 'outils' },
    { id: 27, name: 'Autonomie', category: 'soft' },
    { id: 28, name: 'Communication', category: 'soft' },
    { id: 29, name: 'Esprit d’équipe', category: 'soft' },
    { id: 30, name: 'Résolution de problèmes', category: 'soft' },
    { id: 31, name: 'Adaptabilité', category: 'soft' },
    { id: 32, name: 'Curiosité', category: 'soft' },
    { id: 33, name: 'Pédagogie', category: 'soft' },
  ].map(
    (skill) =>
      ({
        ...skill,
        icon: null,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }) as Skill,
  ),
}
