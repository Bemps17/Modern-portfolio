import type { LablogArticleDefinition } from './lablog-article-types'

export const lablogArticles09to12: LablogArticleDefinition[] = [
  {
    slug: 'graph-rag-ia-entreprise',
    title: 'Graph RAG : Pourquoi la recherche hybride transforme l\'IA d\'entreprise',
    excerpt:
      'Au-delà du RAG vectoriel classique : graphes de connaissances, contexte préservé et pipeline d\'implémentation pour l\'IA d\'entreprise.',
    category: 'ia',
    coverTheme: 'graph-rag',
    publishedAt: '2026-07-16T09:00:00.000Z',
    order: 8,
    blocks: [
      {
        type: 'p',
        text: 'Le RAG (Retrieval-Augmented Generation) a permis aux LLM d\'accéder à la connaissance interne sans réentraînement complet. Mais le RAG « chunks + embeddings » montre ses limites dès que les questions exigent de relier des entités dispersées : « Quel contrat référence le fournisseur X pour le projet Y lancé sous la direction Z ? ». En 2026, le Graph RAG — combinaison de bases vectorielles et de graphes de connaissances — devient le standard pour les assistants d\'entreprise exigeants.',
      },
      {
        type: 'h2',
        text: 'RAG traditionnel vs Graph RAG',
      },
      {
        type: 'p',
        text: 'Le RAG classique découpe des documents en morceaux, les vectorise et récupère les k plus proches sémantiquement. Problème : le contexte relationnel se perd. Deux paragraphes liés par une entité commune peuvent ne jamais être retrieved ensemble. Le Graph RAG extrait entités et relations (client → contrat → projet → équipe), les stocke dans un graphe, puis enrichit la requête par traversal avant la génération.',
      },
      {
        type: 'h3',
        text: 'Comparatif rapide',
      },
      {
        type: 'ul',
        items: [
          'RAG vectoriel : excellent pour FAQ, docs homogènes, questions factuelles localisées.',
          'Graph RAG : supérieur pour multi-hop, compliance, due diligence, support complexe.',
          'Hybride : vectoriel pour recall large, graphe pour précision relationnelle.',
        ],
      },
      {
        type: 'h2',
        text: 'Intérêt des graphes de connaissances',
      },
      {
        type: 'p',
        text: 'Un graphe préserve la structure métier : qui rapporte à qui, quelle clause dépend de quel amendement, quel composant software appartient à quel service. Les hallucinations diminuent quand le LLM reçoit non seulement du texte brut mais un sous-graphe vérifiable avec citations de nœuds. Les équipes juridiques et finance adoptent cette approche pour tracer la provenance de chaque affirmation.',
      },
      {
        type: 'h3',
        text: 'Bénéfices mesurables',
      },
      {
        type: 'ul',
        items: [
          'Réponses multi-documents cohérentes sans duplication contradictoire.',
          'Explicabilité : chemin graphe = justification utilisateur.',
          'Mises à jour incrémentales quand un contrat change, sans re-index massif.',
          'Requêtes type « impact analysis » impossibles en pur vectoriel.',
        ],
      },
      {
        type: 'h2',
        text: 'Exemple d\'implémentation',
      },
      {
        type: 'p',
        text: 'Pipeline type : ingestion → NER + relation extraction (LLM ou modèle dédié) → upsert Neo4j ou équivalent → embedding par nœud/document → à la question, classifier intent → retrieval hybride (similarité + Cypher query générée) → prompt structuré avec subgraph + chunks → LLM avec consigne de citer les IDs source.',
      },
      {
        type: 'p',
        text: 'Commencez petit : un domaine (support produit, RH policies) avec schéma d\'entités figé. Mesurez faithfulness et latence avant d\'étendre. Le Graph RAG coûte plus cher à construire qu\'un RAG naïf, mais il scale en confiance — la ressource rare en IA d\'entreprise.',
      },
    ],
  },
  {
    slug: 'ia-eco-responsable-green-ai',
    title: 'IA et Empreinte Carbone : Réconcilier Puissance de Calcul et Éco-responsabilité',
    excerpt:
      'Datacenters IA, refroidissement innovant, quantification de modèles et Green AI : construire une IA puissante et responsable.',
    category: 'ia',
    coverTheme: 'green-ai',
    publishedAt: '2026-07-15T11:30:00.000Z',
    order: 9,
    blocks: [
      {
        type: 'p',
        text: 'L\'IA générative a un coût énergétique devenu impossible à ignorer. Un entraînement frontier consomme des MWh ; l\'inférence mondiale quotidienne rivalise avec la consommation de pays entiers. En 2026, régulateurs, clients B2B et ingénieurs convergent vers la sobriété numérique appliquée au ML : mesurer, optimiser, choisir le bon modèle plutôt que le plus grand.',
      },
      {
        type: 'h2',
        text: 'Défis énergétiques des datacenters',
      },
      {
        type: 'p',
        text: 'Les clusters GPU denses chauffent ; le refroidissement représente jusqu\'à 40 % de la facture énergie. Les hyperscalers investissent dans le liquid cooling direct-to-chip, des sites nordiques et des PPAs renouvelables. Mais la demande croît plus vite que l\'efficacité : loi de Jevons appliquée à l\'IA — plus c\'est cheap en perf, plus on en consomme.',
      },
      {
        type: 'h3',
        text: 'Ordres de grandeur',
      },
      {
        type: 'ul',
        items: [
          'Inférence : majorité du carbon footprint en production continue.',
          'Entraînement : pics massifs mais amortis si modèle réutilisé.',
          'Embodied carbon : hardware remplacé tous 3-4 ans.',
        ],
      },
      {
        type: 'h2',
        text: 'Innovations refroidissement et réutilisation thermique',
      },
      {
        type: 'p',
        text: 'Les datacenters nordiques récupèrent la chaleur pour chauffer des quartiers. Les designs immersion cooling permettent des densités GPU impossibles à l\'air. En edge, les NPUs réduisent le besoin de round-trip cloud. Ces leviers infrastructurels complètent — ne remplacent pas — l\'optimisation algorithmique.',
      },
      {
        type: 'h2',
        text: 'Quantification et Green AI',
      },
      {
        type: 'p',
        text: 'Techniques clés : distillation (petit modèle imite grand), pruning, quantification INT4/INT8, early exit, batching intelligent. Outils comme CodeCarbon ou dashboards cloud exposent kgCO2eq par requête. Les équipes fixent des budgets carbone par feature comme des budgets latence.',
      },
      {
        type: 'h3',
        text: 'Bonnes pratiques équipe',
      },
      {
        type: 'ul',
        items: [
          'SLM d\'abord, frontier seulement si KPI qualité l\'exige.',
          'Cache sémantique pour éviter regénérations identiques.',
          'Éteindre clusters dev la nuit ; spot instances pour batch offline.',
          'Reporting ESG incluant scope 3 IA dans les RFP enterprise.',
        ],
      },
      {
        type: 'p',
        text: 'Green AI n\'est pas anti-innovation : c\'est de l\'ingénierie mature. Les produits qui documentent leur empreinte et l\'optimisent gagnent des appels d\'offres publics et la confiance des utilisateurs conscients.',
      },
    ],
  },
  {
    slug: 'informatique-quantique-commerciale',
    title: 'Informatique Quantique : Des Laboratoires aux Premières Applications Commerciales',
    excerpt:
      'Avantage quantique hybride, finance, chimie, logistique : des POC aux premiers cas d\'usage commerciaux et perspectives 2030.',
    category: 'veille',
    coverTheme: 'quantum',
    publishedAt: '2026-07-14T10:00:00.000Z',
    order: 10,
    blocks: [
      {
        type: 'p',
        text: 'L\'informatique quantique sort progressivement des labos de physique. En 2026, on ne parle plus seulement de « qubits record » mais de workflows hybrides où un processeur quantique traite un sous-problème difficile (optimisation combinatoriale, simulation Hamiltonien) orchestré par un supercalculateur classique. Les premières factures commerciales apparaissent — modestes, mais réelles.',
      },
      {
        type: 'h2',
        text: 'Avantage quantique hybride',
      },
      {
        type: 'p',
        text: 'La « suprématie quantique » brute (un calcul impossible classiquement mais sans utilité) a cédé la place à l\'avantage quantique utile : résoudre plus vite ou mieux un problème métier avec un coût total inférieur. Les algorithmes VQE, QAOA et simulations quantiques s\'exécutent sur NISQ devices bruités, avec correction d\'erreur partielle et boucles classiques de paramètres.',
      },
      {
        type: 'h3',
        text: 'Ce qui fonctionne aujourd\'hui',
      },
      {
        type: 'ul',
        items: [
          'Optimisation portefeuille avec contraintes non linéaires (banques pilotes).',
          'Simulation de catalyseurs et matériaux batterie (chimie computationnelle).',
          'Routing logistique sur graphes de taille moyenne avec heuristiques quantiques.',
          'Cryptanalyse recherche pour calibrer timelines PQC — côté défense.',
        ],
      },
      {
        type: 'h2',
        text: 'Secteurs précurseurs',
      },
      {
        type: 'p',
        text: 'La finance cherche l\'edge sur l\'optimisation risque-rendement et le pricing d\'instruments exotiques. L\'industrie chimique et pharma veut simuler des molécules sans approximations brutales DFT classiques. La logistique teste le quantum pour planification tournées avec contraintes temps réel. Aucun n\'a remplacé ses systèmes classiques : ils explorent en parallèle via cloud quantique (IBM, IonQ, Pasqal).',
      },
      {
        type: 'h2',
        text: 'Perspectives d\'ici 2030',
      },
      {
        type: 'p',
        text: 'Les experts tablent sur des machines à correction d\'erreur partielle permettant des circuits plus profonds. Les standards logiciels (Qiskit, Cirq, interop) mûrissent. Les formations hybrid quantum-classical developer se généralisent. Le quantum ne remplacera pas le cloud classique ; il deviendra une ligne optionnelle du menu compute pour problèmes spécifiques — comme le GPU l\'est devenu pour le ML.',
      },
      {
        type: 'p',
        text: 'Pour les entreprises curieuses : identifier un problème d\'optimisation ou simulation où le classique plafonne, lancer un POC budget maîtrisé sur cloud quantique, mesurer honnêtement vs meilleure heuristique classique. C\'est ainsi que se construisent les premières applications commerciales — pas via le hype des qubits purs.',
      },
    ],
  },
  {
    slug: 'depin-decentralisation-hardware',
    title: 'DePIN : Comment la décentralisation révolutionne le hardware et le cloud',
    excerpt:
      'Réseaux d\'infrastructure physique décentralisée, tokenomics et accès au compute GPU pour l\'IA — décryptage DePIN & Web3.',
    category: 'veille',
    coverTheme: 'depin',
    publishedAt: '2026-07-13T08:30:00.000Z',
    order: 11,
    blocks: [
      {
        type: 'p',
        text: 'DePIN — Decentralized Physical Infrastructure Networks — désigne des protocoles qui coordonnent du hardware réel (GPU, stockage, capteurs, antennes 5G) via blockchain et incitations tokenisées. Plutôt que d\'acheter des datacenters, le réseau rémunère des contributeurs individuels ou des PME qui mettent leurs ressources en commun. En 2026, le DePIN devient un canal alternatif d\'accès au compute pour l\'IA, surtout quand les GPU cloud centralisés sont chers ou indisponibles.',
      },
      {
        type: 'h2',
        text: 'Fonctionnement des réseaux DePIN',
      },
      {
        type: 'p',
        text: 'Un protocole DePIN définit des standards : nœud logiciel à installer, preuves de contribution (Proof of Work utile, Proof of Storage, uptime mesuré), récompenses en tokens natifs. Les clients paient en stablecoin ou token pour consommer la ressource. La gouvernance on-chain ajuste paramètres et pénalités slashing si un nœud triche ou est offline.',
      },
      {
        type: 'h3',
        text: 'Exemples de catégories',
      },
      {
        type: 'ul',
        items: [
          'Compute GPU : inférence distribuée pour modèles open-source.',
          'Stockage : fragments chiffrés répliqués géographiquement.',
          'Wireless : hotspots 5G/LoRaWAN avec roaming tokenisé.',
          'Capteurs : données IoT agrégées pour smart cities décentralisées.',
        ],
      },
      {
        type: 'h2',
        text: 'Modèle économique tokenisé',
      },
      {
        type: 'p',
        text: 'Les tokens alignent incitations : fournir du hardware fiable = revenus récurrents ; utiliser le réseau = coût variable souvent inférieur aux hyperscalers en période de pénurie GPU. Risques : volatilité token, régulation securities, qualité de service hétérogène. Les projets matures offrent SLA partiels et paiement fiat on-ramp.',
      },
      {
        type: 'h2',
        text: 'Impact sur l\'accès au compute IA',
      },
      {
        type: 'p',
        text: 'Pour startups IA, le DePIN compute permet de lancer fine-tuning et batch inference sans contrat enterprise AWS. Pour regions mal desservies, des mesh locaux émergent. Limites : latence inter-nœuds, confidentialité des données (méfiance à envoyer des datasets sensibles sur hardware anonyme), compatibilité CUDA hétérogène.',
      },
      {
        type: 'ul',
        items: [
          'Idéal : workloads publics, modèles open, batch non urgent.',
          'Déconseillé : PII, entraînement propriétaire sans TEE.',
          'Tendance : hybrid DePIN + cloud central pour burst capacity.',
        ],
      },
      {
        type: 'p',
        text: 'DePIN ne remplace pas le cloud : il le fragmente et le démocratise. Comme le peer-to-peer a transformé la distribution de contenu, ces réseaux transforment l\'accès à l\'infrastructure physique — à condition de naviguer prudemment entre promesse décentralisée et réalité opérationnelle.',
      },
    ],
  },
]
