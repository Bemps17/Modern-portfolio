import type { LablogArticleDefinition } from './lablog-article-types'

export const lablogArticles01to04: LablogArticleDefinition[] = [
  {
    slug: 'agents-ia-autonomes-2026',
    title: '2026 : Comment les agents IA autonomes redéfinissent l\'efficacité en entreprise',
    excerpt:
      'Des LLM réactifs aux agents proactifs : planification, orchestration multi-agents et automatisation métier à l\'échelle entreprise en 2026.',
    category: 'ia',
    coverTheme: 'agentic-ai',
    publishedAt: '2026-07-24T09:00:00.000Z',
    order: 0,
    blocks: [
      {
        type: 'p',
        text: 'Pendant deux ans, l\'IA en entreprise s\'est surtout manifestée sous la forme de chatbots capables de répondre à des questions isolées. En 2026, la bascule est nette : les organisations déploient des agents autonomes capables de planifier, d\'exécuter et de coordonner des workflows métier complets. Là où un LLM réactif attend une instruction, un agent proactif observe un objectif, décompose le problème, choisit des outils et itère jusqu\'à livrer un résultat vérifiable. Cette évolution transforme la productivité des équipes opérationnelles, pas seulement celle des développeurs.',
      },
      {
        type: 'h2',
        text: 'Des cas d\'usage concrets en entreprise',
      },
      {
        type: 'p',
        text: 'Les premiers déploiements matures ne visent pas la science-fiction, mais les processus à forte friction documentaire. En support client, un agent peut lire un ticket, consulter la base de connaissances, reproduire l\'erreur dans un environnement de test, proposer un correctif et ouvrir une pull request — le tout avec des points de contrôle humains configurables. En finance, des agents spécialisés rapprochent des flux bancaires, détectent des anomalies et préparent des dossiers de conformité avant revue par un analyste.',
      },
      {
        type: 'h3',
        text: 'Où l\'impact est le plus immédiat',
      },
      {
        type: 'ul',
        items: [
          'Onboarding fournisseurs et vérification KYC accélérés par collecte documentaire autonome.',
          'Gestion de projet : mise à jour automatique des statuts, relances et synthèses hebdomadaires.',
          'Ops IT : tri des alertes, corrélation d\'incidents et exécution de runbooks standardisés.',
          'Marketing B2B : recherche de comptes, personnalisation d\'emails et enrichissement CRM.',
        ],
      },
      {
        type: 'p',
        text: 'Le gain mesurable ne vient pas de la vitesse de génération de texte, mais de la réduction des allers-retours entre systèmes. Un agent bien outillé évite à un collaborateur de jongler entre dix onglets et trois outils SaaS pour accomplir une tâche récurrente de quarante minutes.',
      },
      {
        type: 'h2',
        text: 'Architecture d\'un système multi-agents',
      },
      {
        type: 'p',
        text: 'Un système agentique robuste ressemble davantage à une micro-architecture logicielle qu\'à un unique prompt géant. On y trouve typiquement un orchestrateur (souvent un LLM de raisonnement), des agents spécialisés par domaine, une couche d\'outils sécurisés (API internes, bases SQL, moteurs de recherche) et une mémoire structurée — vectorielle pour le contexte documentaire, relationnelle pour l\'état des tâches.',
      },
      {
        type: 'h3',
        text: 'Les composants clés',
      },
      {
        type: 'ul',
        items: [
          'Planificateur : décompose l\'objectif en sous-tâches avec critères de succès explicites.',
          'Exécuteur : appelle des outils via des contrats typés, jamais via du code arbitraire non sandboxé.',
          'Critique / validateur : vérifie format, permissions et cohérence avant persistance.',
          'Observabilité : traces, coûts par tâche, journaux d\'actions pour audit et amélioration continue.',
        ],
      },
      {
        type: 'p',
        text: 'La collaboration inter-agents s\'appuie sur des bus de messages et des files de tâches. Plutôt que de laisser deux agents négocier librement, les architectures 2026 imposent des protocoles : un agent « recherche » produit un dossier sourcé, un agent « rédaction » ne part que de ce dossier, un agent « conformité » valide les claims sensibles. Cette séparation limite les hallucinations en cascade.',
      },
      {
        type: 'h2',
        text: 'Les risques de sur-automatisation',
      },
      {
        type: 'p',
        text: 'Automatiser plus vite n\'équivaut pas à automatiser mieux. Les erreurs d\'un agent autonome peuvent se propager à grande échelle si les garde-fous sont absents : envoi massif d\'emails incorrects, modification de données CRM, exécution de remboursements erronés. Les RSSI s\'inquiètent aussi de l\'élargissement de la surface d\'attaque : chaque outil connecté à un agent devient une porte d\'entrée potentielle.',
      },
      {
        type: 'h3',
        text: 'Bonnes pratiques de gouvernance',
      },
      {
        type: 'ul',
        items: [
          'Principe du moindre privilège sur chaque identité machine et clé API.',
          'Human-in-the-loop obligatoire au-delà de seuils financiers ou réglementaires.',
          'Environnements de simulation pour tester les politiques avant production.',
          'KPI de qualité (taux de rework, escalades humaines) aussi suivis que le gain de temps.',
        ],
      },
      {
        type: 'p',
        text: 'En conclusion, les agents IA autonomes ne remplacent pas les équipes : ils absorbent le travail de coordination répétitif pour libérer du jugement humain là où il crée de la valeur. Les entreprises qui réussissent en 2026 traitent l\'agentique comme un produit interne — avec owners, SLA et itérations — plutôt comme une démo impressionnante branchée sur trop d\'outils critiques.',
      },
    ],
  },
  {
    slug: 'vibe-coding-qualite-architecture',
    title: 'Le Vibe Coding : Produire plus vite sans sacrifier la qualité architecturale',
    excerpt:
      'IDE IA, génération assistée et relecture disciplinée : comment le vibe coding accélère la livraison tout en maîtrisant la dette technique.',
    category: 'veille',
    coverTheme: 'vibe-coding',
    publishedAt: '2026-07-23T10:30:00.000Z',
    order: 1,
    blocks: [
      {
        type: 'p',
        text: 'Le « vibe coding » décrit une façon de développer où l\'intention et le ressenti du produit priment sur la frappe ligne par ligne. Avec Cursor, Windsurf ou Copilot Next, le développeur formule un objectif, laisse l\'IA produire des brouillons, puis sculpte le résultat par itérations rapides. Ce n\'est pas de la paresse : c\'est un changement de rôle. Le dev devient chef d\'orchestre, reviewer et garant de l\'architecture pendant que la machine accélère l\'exécution.',
      },
      {
        type: 'h2',
        text: 'Comprendre le vibe coding',
      },
      {
        type: 'p',
        text: 'Contrairement au copier-coller aveugle, le vibe coding assume un cycle court : prompt → diff → test → ajustement. On travaille par « vibes » — clarté de l\'API, fluidité UX, cohérence visuelle — plutôt que par micro-optimisations prématurées. L\'IA excelle à produire du code standard (CRUD, tests boilerplate, migrations) ; l\'humain conserve la vision des invariants métier et des contraintes non écrites.',
      },
      {
        type: 'h3',
        text: 'Synergie avec les IDE IA modernes',
      },
      {
        type: 'ul',
        items: [
          'Contexte repo entier : l\'IA respecte les patterns existants si le projet est propre.',
          'Agents multi-fichiers : refactors transverses impossibles à tenir manuellement en une session.',
          'Terminal intégré : exécution de tests et lint dans la boucle de feedback.',
          'Rules / skills : garde-fous d\'équipe injectés dans chaque génération.',
        ],
      },
      {
        type: 'h2',
        text: 'Relire et valider le code généré',
      },
      {
        type: 'p',
        text: 'La qualité ne naît pas de la génération mais de la relecture systématique. Chaque PR issue d\'un flux vibe coding doit passer les mêmes gates qu\'une PR classique : lint, types, tests, revue pair. Méfiance particulière sur les imports fantômes, les types `any` discrets et la duplication de logique métier déjà présente ailleurs.',
      },
      {
        type: 'h3',
        text: 'Checklist de revue pragmatique',
      },
      {
        type: 'ul',
        items: [
          'Le diff résout-il exactement le ticket, sans feature creep ?',
          'Les noms et la structure suivent-ils les conventions du repo ?',
          'Les effets de bord (auth, cache, i18n) sont-ils couverts ?',
          'Existe-t-il un test qui casse si l\'IA invente une hypothèse fausse ?',
        ],
      },
      {
        type: 'p',
        text: 'Documenter les prompts efficaces dans l\'équipe accélère l\'onboarding : un bon prompt de migration Payload vaut une heure de tâtonnements. Inversement, ne jamais merger un bloc de cent lignes non compris « parce que les tests passent ».',
      },
      {
        type: 'h2',
        text: 'Maîtriser la dette technique',
      },
      {
        type: 'p',
        text: 'Le risque principal du vibe coding est l\'accumulation silencieuse de code homogène mais incohérent : trois façons de fetcher la même ressource, des composants quasi identiques, des abstractions prématurées suggérées par l\'IA. La dette n\'est pas dans la vitesse, mais dans l\'absence de décisions explicites.',
      },
      {
        type: 'h3',
        text: 'Garder le contrôle architectural',
      },
      {
        type: 'ul',
        items: [
          'Définir des « zones sacrées » (auth, billing) où la génération est assistée, jamais autonome.',
          'Imposer des ADR pour tout pattern nouveau introduit via IA.',
          'Refactor hebdomadaire des zones à fort churn généré.',
          'Mesurer la complexité cyclomatique et la duplication comme en CI.',
        ],
      },
      {
        type: 'p',
        text: 'Le vibe coding est un multiplicateur de vélocité pour les équipes qui ont déjà de la discipline. Utilisé sans garde-fous, il produit des prototypes brillants et des bases de production fragiles. La bonne formule en 2026 : générer vite, comprendre tout, tester tout, posséder l\'architecture.',
      },
    ],
  },
  {
    slug: 'robotique-incarnee-industrie',
    title: 'La Robotique Incarnée : Quand l\'IA prend corps dans l\'industrie',
    excerpt:
      'Vision-action, humanoïdes en entrepôt et usine : état des lieux 2026, défis mécaniques et retombées économiques de l\'Embodied AI.',
    category: 'ia',
    coverTheme: 'embodied-ai',
    publishedAt: '2026-07-22T14:00:00.000Z',
    order: 2,
    blocks: [
      {
        type: 'p',
        text: 'L\'intelligence artificielle quitte progressivement l\'écran pour entrer dans l\'atelier. L\'Embodied AI — IA incarnée — désigne des systèmes qui perçoivent le monde physique via capteurs, planifient des actions motrices et s\'adaptent aux imprévus du réel. En 2026, la convergence entre modèles multimodaux et robotique industrielle permet des déploiements pilotes à grande échelle dans la logistique et l\'automobile, là où la main-d\'œuvre est rare et les tâches répétitives coûteuses.',
      },
      {
        type: 'h2',
        text: 'L\'évolution des modèles vision-action',
      },
      {
        type: 'p',
        text: 'Historiquement, un robot industriel suivait des trajectoires préprogrammées dans un environnement figé. Les nouvelles approches apprennent des politiques visuo-motrices : la caméra observe une scène, le modèle prédit une séquence de mouvements de préhension ou d\'assemblage. Les architectures combinent transformers pour la scène, réseaux de diffusion pour la planification de trajectoire et contrôleurs bas niveau assurant la stabilité.',
      },
      {
        type: 'h3',
        text: 'Progrès clés depuis 2024',
      },
      {
        type: 'ul',
        items: [
          'Sim-to-real : entraînement massif en simulation avec randomisation de domaine.',
          'Données propriétaires d\'usines alimentant des modèles spécialisés par tâche.',
          'Fine-tuning sur quelques heures de démonstration humaine pour une nouvelle pièce.',
          'Fusion LiDAR + RGB pour la navigation en entrepôt dynamique.',
        ],
      },
      {
        type: 'h2',
        text: 'Déploiements chez les géants industriels',
      },
      {
        type: 'p',
        text: 'Les annonces 2025-2026 ne sont plus des keynotes isolées. Des constructeurs automobiles testent des humanoïdes pour le reapprovisionnement de lignes. Des opérateurs logistiques expérimentent le picking mixte SKU dans des zones non structurées. Amazon, BMW, Hyundai et des startups comme Figure ou Agility multiplient les POCs avec des centaines, parfois des milliers d\'heures d\'exploitation monitorée.',
      },
      {
        type: 'p',
        text: 'Le modèle économique reste sensible au TCO : coût d\'acquisition, maintenance, supervision humaine résiduelle et MTBF (temps moyen entre pannes). Pour l\'instant, le ROI est plus crédible sur des tâches 3D (pick & place variable) que sur la marche libre en environnement non contrôlé.',
      },
      {
        type: 'h2',
        text: 'Défis mécaniques, énergétiques et sociétaux',
      },
      {
        type: 'p',
        text: 'Un humanoïde consomme beaucoup d\'énergie pour des gestes qu\'un humain exécute intuitivement. Les batteries limitent l\'autonomie en shift continu ; les actionneurs chauffent ; la précision repeatability peine face aux pièces usinées avec tolérances serrées. Parallèlement, les syndicats et régulateurs exigent des cadres clairs sur la cohabitation homme-robot et la responsabilité en cas d\'incident.',
      },
      {
        type: 'h3',
        text: 'Perspectives fin 2026',
      },
      {
        type: 'ul',
        items: [
          'Spécialisation : robots dédiés par vertical plutôt qu\'humanoïde universel.',
          'Contrats « robot-as-a-service » lissant le capex pour les PME industrielles.',
          'Normes ISO accélérées sur la sécurité collaborative et la cybersécurité embarquée.',
          'Marché du travail : reconversion vers supervision, maintenance et ingénierie de tâches.',
        ],
      },
      {
        type: 'p',
        text: 'L\'Embodied AI n\'est pas une mode : c\'est la condition pour que l\'IA transforme la production physique, pas seulement les bureaux. Les entreprises qui investissent dès maintenant dans la donnée capteur, la simulation et l\'intégration MES/ERP seront prêtes quand le hardware passera du pilote au déploiement massif.',
      },
    ],
  },
  {
    slug: 'cloud-public-vs-slm-local',
    title: 'Cloud Public vs IA en Local : Pourquoi les entreprises adoptent les SLM',
    excerpt:
      'SLM, NPU et cloud souverain : comparatif sécurité, latence, coûts et grille de décision pour choisir entre API cloud et inférence locale.',
    category: 'veille',
    coverTheme: 'sovereign-cloud',
    publishedAt: '2026-07-21T11:00:00.000Z',
    order: 3,
    blocks: [
      {
        type: 'p',
        text: 'Après la ruée vers les API de grands LLM, 2026 marque un retour de balancier. Coûts variables imprévisibles, clauses de sous-traitance cloud et exigences RGPD sectorielles poussent les entreprises vers des Small Language Models (SLM) exécutés localement ou sur des clouds souverains. L\'enjeu n\'est plus « le plus gros modèle », mais le bon modèle au bon endroit pour la bonne tâche.',
      },
      {
        type: 'h2',
        text: 'Sécurité, latence et maîtrise des coûts',
      },
      {
        type: 'p',
        text: 'Un SLM de 3 à 8 milliards de paramètres quantifié peut tourner sur un serveur équipé de GPU ou NPU dédié. Les données sensibles — dossiers médicaux, contrats, code source — ne quittent jamais le périmètre. La latence devient prévisible : pas de file d\'attente API, pas de rate limit externe. Financièrement, le capex initial se compare favorablement à des factures cloud qui explosent avec l\'adoption transverse.',
      },
      {
        type: 'h3',
        text: 'Avantages mesurables des SLM locaux',
      },
      {
        type: 'ul',
        items: [
          'Confidentialité : zéro transit vers des tiers, audit simplifié.',
          'Latence sub-seconde pour classification, extraction, résumé court.',
          'Coût marginal faible après amortissement du hardware.',
          'Personnalisation fine sur corpus métier sans réentraînement massif.',
        ],
      },
      {
        type: 'h2',
        text: 'Architectures d\'hébergement local',
      },
      {
        type: 'p',
        text: 'Le spectre va du poste développeur (NPU laptop + Ollama) au cluster on-premise orchestré par Kubernetes et vLLM. Les NPUs Intel, Apple ou Qualcomm accélèrent l\'inférence INT4/INT8. Les clouds souverains français ou européens offrent un intermédiaire : SLM dédiés, clés HSM, localisation des données garantie contractuellement.',
      },
      {
        type: 'h3',
        text: 'Stack type 2026',
      },
      {
        type: 'ul',
        items: [
          'Modèle : Mistral Small, Phi, Llama variant quantifié selon la tâche.',
          'Serving : vLLM, llama.cpp, ou appliance OEM clé en main.',
          'RAG local : base vectorielle + connecteurs documents internes.',
          'Observabilité : logs, quotas par équipe, red teaming interne.',
        ],
      },
      {
        type: 'h2',
        text: 'Grille de décision Cloud vs Local',
      },
      {
        type: 'p',
        text: 'Restez sur le cloud public pour le raisonnement complexe occasionnel, la veille non sensible et les prototypes. Passez en local pour les flux à volume élevé, les données réglementées et les applications embarquées offline. L\'architecture hybride domine : SLM local pour le tri et l\'extraction, LLM cloud pour la synthèse rare sous contrôle DLP.',
      },
      {
        type: 'ul',
        items: [
          'Volume > 1M tokens/jour ? Évaluez le local.',
          'Données secret défense / santé ? Local ou souverain obligatoire.',
          'Besoin de créativité longue forme ? Cloud premium ponctuel.',
          'Équipe sans ops GPU ? Cloud souverain managé.',
        ],
      },
      {
        type: 'p',
        text: 'Les SLM ne remplacent pas les frontier models : ils les complètent en absorbant 80 % des requêtes simples à coût fixe. En 2026, la maturité des outils de quantification et du hardware dédié rend cette stratégie accessible au-delà des hyperscalers.',
      },
    ],
  },
]
