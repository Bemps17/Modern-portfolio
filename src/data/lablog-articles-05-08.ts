import type { LablogArticleDefinition } from './lablog-article-types'

export const lablogArticles05to08: LablogArticleDefinition[] = [
  {
    slug: 'npus-puces-ia-embarquees',
    title: 'NPUs et Puces IA Embarquées : La Révolution du Compute sur Appareils Mobiles',
    excerpt:
      'CPU, GPU, NPU : architectures, efficience énergétique et nouvelles applications on-device en 2026.',
    category: 'veille',
    coverTheme: 'npu-chip',
    publishedAt: '2026-07-20T09:30:00.000Z',
    order: 4,
    blocks: [
      {
        type: 'p',
        text: 'Votre smartphone de 2026 exécute en local des tâches que seuls des serveurs cloud géants pouvaient traiter il y a trois ans. Transcription en temps réel, séparation de pistes audio, retouche photo générale, détection de scène pour l\'accessibilité : tout cela repose sur des NPUs (Neural Processing Units) intégrés aux SoC. Cette vague de compute embarqué redéfinit l\'expérience utilisateur et la stratégie produit des éditeurs d\'apps.',
      },
      {
        type: 'h2',
        text: 'CPU, GPU et NPU : trois philosophies',
      },
      {
        type: 'p',
        text: 'Le CPU excelle dans la logique séquentielle généraliste et les branches conditionnelles. Le GPU parallélise des milliers d\'opérations identiques — idéal pour le rendu 3D et certaines matrices denses. Le NPU, lui, est un accélérateur ASIC optimisé pour les opérations des réseaux de neurones : convolutions, multiplications matricielles bas précision, activations. Il offre un tops/Watt (trillions d\'opérations par watt) bien supérieur pour l\'inférence IA.',
      },
      {
        type: 'h3',
        text: 'Différences architecturales clés',
      },
      {
        type: 'ul',
        items: [
          'NPU : mémoire proche du compute, pipelines systoliques, quantification INT8/INT4 native.',
          'GPU : flexibilité shader, moins efficace en inférence pure petit batch.',
          'CPU : fallback universel quand le modèle ou l\'op n\'est pas supporté par le NPU.',
        ],
      },
      {
        type: 'h2',
        text: 'Gains d\'efficience énergétique',
      },
      {
        type: 'p',
        text: 'Exécuter un modèle de vision sur NPU peut consommer dix à vingt fois moins d\'énergie qu\'un portage GPU non optimisé. Conséquence directe : features IA toujours actives (assistant vocal permanent, traduction live) sans vider la batterie en deux heures. Les fabricants publient des SDK (Core ML, NNAPI, QNN) qui compilent les graphes vers les instructions NPU spécifiques.',
      },
      {
        type: 'p',
        text: 'Pour les PC, les Copilot+ PC et Mac Apple Silicon généralisent des NPUs capables de faire tourner des SLM légers pour résumé et recherche sémantique locale — réduisant la dépendance au cloud pour le travail quotidien.',
      },
      {
        type: 'h2',
        text: 'Nouvelles applications permises on-device',
      },
      {
        type: 'h3',
        text: 'Cas concrets 2026',
      },
      {
        type: 'ul',
        items: [
          'Photo / vidéo : débruitage, upscaling, recadrage intelligent sans upload.',
          'Santé : analyse de signaux biométriques avec privacy by design.',
          'Accessibilité : description d\'image et sous-titrage offline.',
          'Jeux : NPCs avec dialogues locaux et animation faciale temps réel.',
          'Sécurité : détection de deepfake et phishing visuel avant envoi cloud.',
        ],
      },
      {
        type: 'p',
        text: 'Les développeurs doivent penser « NPU-first » : quantifier tôt, profiler sur appareils réels, prévoir un fallback CPU pour les modèles exotiques. L\'ère du « tout cloud » pour l\'IA consommateur touche à sa fin ; le edge devient le lieu par défaut de l\'inférence.',
      },
    ],
  },
  {
    slug: 'cybersecurite-2026-ia-quantique',
    title: 'Cybersécurité 2026 : L\'IA contre l\'IA et l\'ère Post-Quantique',
    excerpt:
      'Attaques automatisées par IA générative, défense temps réel et migration vers la cryptographie post-quantique : état des lieux RSSI.',
    category: 'veille',
    coverTheme: 'cybersecurity',
    publishedAt: '2026-07-19T15:00:00.000Z',
    order: 5,
    blocks: [
      {
        type: 'p',
        text: 'La cybersécurité entre dans une guerre asymétrique accélérée par l\'IA. D\'un côté, des acteurs malveillants utilisent des LLM pour générer du phishing hyper-personnalisé, muter des malwares et automatiser la reconnaissance. De l\'autre, les défenseurs déploient des systèmes de détection comportementale, des copilotes SOC et préparent la transition vers des algorithmes résistants au quantique. 2026 est l\'année où ces deux courbes se croisent.',
      },
      {
        type: 'h2',
        text: 'Explosion des cyberattaques automatisées',
      },
      {
        type: 'p',
        text: 'Les campagnes de spear-phishing ne se contentent plus de fautes d\'orthographe : elles imitent le style d\'un collègue, référencent des projets internes scrapés sur LinkedIn et s\'adaptent à la langue de la cible. Des kits « phishing-as-a-service » intègrent des agents qui testent des variantes jusqu\'à contourner un filtre. Les vulnérabilités zero-day sont analysées plus vite ; le temps entre publication CVE et exploitation scan massif se compresse.',
      },
      {
        type: 'h3',
        text: 'Vecteurs en hausse',
      },
      {
        type: 'ul',
        items: [
          'Credential stuffing augmenté par génération de wordlists contextuelles.',
          'Deepfake vocal/vidéo pour fraude au président.',
          'Poisoning de modèles open-source et supply chain ML.',
          'Abus d\'API LLM pour reconnaissance OSINT industrialisée.',
        ],
      },
      {
        type: 'h2',
        text: 'Défense automatisée et temps réel',
      },
      {
        type: 'p',
        text: 'Les SOC modernes intègrent des pipelines où chaque alerte est enrichie automatiquement : corrélation MITRE, recherche de IoC similaires, proposition de containment. L\'humain valide les actions à fort impact ; la machine absorbe le bruit. Les EDR embarquent des modèles légers détectant des séquences syscall anormales sans signature statique.',
      },
      {
        type: 'h3',
        text: 'Leviers efficaces',
      },
      {
        type: 'ul',
        items: [
          'SOAR avec playbooks testés et rollback documenté.',
          'Zero Trust : MFA passkeys, segmentation micro-réseau.',
          'Red teaming continu incluant scénarios IA-assisted.',
          'Formation simulée anti-phishing avec contenu généré réaliste.',
        ],
      },
      {
        type: 'h2',
        text: 'Migration post-quantique',
      },
      {
        type: 'p',
        text: 'Même si un ordinateur quantique capable de casser RSA2048 n\'est pas commercial demain, le principe « harvest now, decrypt later » impose d\'agir. Le NIST a standardisé des algorithmes post-quantiques (ML-KEM, ML-DSA). Les entreprises inventorient leurs dépendances crypto (TLS, signatures code, PKI interne) et planifient une migration hybride classique + PQC sur cinq à dix ans.',
      },
      {
        type: 'p',
        text: 'La cybersécurité 2026 se gagne à la vitesse de l\'automatisation défensive et à la rigueur de la gouvernance — pas à la panique. Investir dans l\'observabilité, la crypto-agilité et la culture sécurité reste le meilleur antidote à une IA offensive de plus en plus accessible.',
      },
    ],
  },
  {
    slug: 'biotech-ia-medecine-personnalisee',
    title: 'Biotech & IA : L\'ère de la médecine ultra-personnalisée',
    excerpt:
      'Deep Learning, prédiction de structures protéiques et vaccins sur-mesure : accélération de la découverte et enjeux éthiques genomics.',
    category: 'ia',
    coverTheme: 'biotech',
    publishedAt: '2026-07-18T10:00:00.000Z',
    order: 6,
    blocks: [
      {
        type: 'p',
        text: 'La biotech vit sa révolution silencieuse. Des modèles comme AlphaFold et leurs successeurs ont transformé la prédiction de structure protéique en commodity computationnelle. Couplés à des pipelines de design moléculaire génératif, ils réduisent des cycles de découverte de médicaments de plusieurs années à quelques mois. En 2026, les premiers essais cliniques de phase 3 issus majoritairement de l\'IA valident — ou infirment — cette promesse à grande échelle.',
      },
      {
        type: 'h2',
        text: 'Accélération de la découverte de médicaments',
      },
      {
        type: 'p',
        text: 'Traditionnellement, identifier une cible thérapeutique, synthétiser des milliers de composés et les tester in vitro prenait une décennie et des milliards. Aujourd\'hui, un modèle génératif propose des candidats respectant des contraintes d\'affinité, toxicité prédite et synthèse faisable. Le labo ne part plus de zéro : il part d\'une short-list optimisée par simulation.',
      },
      {
        type: 'h3',
        text: 'Étapes transformées par le Deep Learning',
      },
      {
        type: 'ul',
        items: [
          'Cible : analyse omics pour identifier des voies pathologiques.',
          'Hit discovery : génération de molécules novel vs screening aveugle.',
          'Lead optimization : prédiction ADMET in silico avant animal.',
          'Essais : stratification de patients via biomarqueurs IA.',
        ],
      },
      {
        type: 'h2',
        text: 'Vaccins et traitements sur-mesure',
      },
      {
        type: 'p',
        text: 'L\'ARNm a prouvé la flexibilité des plateformes vaccinales. L\'IA permet d\'adapter rapidement un design aux variants émergents ou à un profil génomique individuel — thérapies CAR-T dont la cible est choisie par analyse tumorale, vaccins neoantigéniques personnalisés en oncologie. Les premiers résultats de phase 3 montrent des taux de réponse encourageants sur des cohortes restreintes mais bien stratifiées.',
      },
      {
        type: 'h2',
        text: 'Questions éthiques et genomics',
      },
      {
        type: 'p',
        text: 'Plus on personnalise, plus on touche à des données génétiques ultra-sensibles. Qui possède le génome ? Comment éviter la discrimination assurantielle ? Les biais dans les datasets d\'entraînement sous-représentent certaines populations, risquant des traitements moins efficaces pour elles. La transparence algorithmique devient un enjeu réglementaire au même titre que la validation clinique.',
      },
      {
        type: 'ul',
        items: [
          'Consentement éclairé pour usage secondaire des données génomiques.',
          'Équité d\'accès : médecine personnalisée ne doit pas rester un luxe.',
          'Traçabilité : chaîne de preuve du design moléculaire à la fabrication.',
        ],
      },
      {
        type: 'p',
        text: 'La biotech & IA n\'efface pas la rigueur scientifique : elle la compresse. Les gagnants seront ceux qui combinent excellence computationnelle, validation expérimentale humble et éthique intégrée dès la conception des modèles.',
      },
    ],
  },
  {
    slug: 'spatial-computing-bci',
    title: 'Spatial Computing & BCI : Vers la Fin des Écrans et du Clavier ?',
    excerpt:
      'Réalité mixte et interfaces cerveau-machine non invasives : cas d\'usage industrie/santé et UX de demain.',
    category: 'veille',
    coverTheme: 'spatial-bci',
    publishedAt: '2026-07-17T13:30:00.000Z',
    order: 7,
    blocks: [
      {
        type: 'p',
        text: 'Pendant des décennies, l\'interface homme-machine a convergé vers le rectangle lumineux et le clavier QWERTY. En 2026, deux courants remettent ce paradigme en question : le spatial computing (VR/AR/mixed reality) qui ancre l\'UI dans l\'espace 3D, et les BCI (Brain-Computer Interfaces) non invasives qui détectent l\'intention avant le geste. Leur fusion promet des interactions « mains libres » radicales — encore loin du grand public, déjà tangible en industrie et santé.',
      },
      {
        type: 'h2',
        text: 'Fusion casques MR et signaux neuronaux',
      },
      {
        type: 'p',
        text: 'Les casques mixed reality (Vision Pro, Quest Pro, HoloLens nouvelle génération) cartographient la pièce, superposent des hologrammes persistants et suivent regard + mains. Les BCI consommatrices utilisent EEG sec ou fNIRS pour classifier des intentions grossières : « sélectionner », « faire défiler », « confirmer ». Combinées, elles permettent à un technicien les mains occupées de valider une étape checklist par intention focalisée, sans toucher un écran.',
      },
      {
        type: 'h3',
        text: 'État de l\'art non invasif',
      },
      {
        type: 'ul',
        items: [
          'Précision suffisante pour menus binaires et macros, pas pour dicter un roman.',
          'Latence 200-500 ms — acceptable pour contrôle industriel, frustrant pour gaming compétitif.',
          'Calibration individuelle requise à chaque session longue.',
        ],
      },
      {
        type: 'h2',
        text: 'Cas d\'usage industriels et médicaux',
      },
      {
        type: 'p',
        text: 'En chirurgie assistée, un chirurgien consulte des imageries flottantes sans quitter le champ stérile. En maintenance aéronautique, un AR guide les gestes tandis que le BCI confirme les étapes critiques. En rééducation, des interfaces combinent feedback moteur et signaux cérébraux pour mesurer l\'effort d\'un patient post-AVC. Ces contextes tolèrent le coût et la complexité setup.',
      },
      {
        type: 'h2',
        text: 'Expérience utilisateur de demain',
      },
      {
        type: 'p',
        text: 'Le clavier ne disparaîtra pas : il reste optimal pour la production textuelle dense. En revanche, la navigation spatialisée, la collaboration à distance en présence partagée et les assistants contextuels ancrés dans l\'environnement deviendront banals pour la conception, la formation et le support expert. Les BCI resteront une couche d\'accessibilité et de productivité niche avant d\'éventuellement fusionner avec des implants — sujet éthique à part entière.',
      },
      {
        type: 'p',
        text: 'Spatial computing + BCI ne signifient pas la fin des écrans demain, mais le début d\'un spectre d\'interfaces où l\'intention compte autant que le clic. Les product builders gagneront à designer pour le regard, la voix et l\'attention — pas seulement pour le pointeur.',
      },
    ],
  },
]
