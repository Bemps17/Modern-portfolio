import type { Field, GlobalConfig } from 'payload'

import { revalidateGlobals } from '../lib/revalidate'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

const identityFields: Field[] = [
  {
    name: 'siteName',
    type: 'text',
    required: true,
    defaultValue: 'Portfolio',
  },
  {
    name: 'tagline',
    type: 'text',
    required: true,
  },
  {
    name: 'logo',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Logo du site (sidebar / header). PNG ou SVG carré recommandé.',
    },
  },
  {
    name: 'favicon',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Favicon navigateur (PNG 32×32 ou SVG).',
    },
  },
  {
    name: 'avatar',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Portrait affiché dans le Hero et la page À propos.',
    },
  },
  {
    name: 'themeColor',
    type: 'text',
    defaultValue: '#0a0a0a',
    admin: {
      description: 'Couleur barre navigateur (hex). Ex. #0a0a0a',
    },
  },
]

const contactFields: Field[] = [
  {
    name: 'email',
    type: 'email',
    required: true,
  },
  {
    name: 'phone',
    type: 'text',
    admin: {
      description: 'Téléphone affiché sur le CV PDF et les pages légales.',
    },
  },
  {
    name: 'location',
    type: 'text',
    admin: {
      description: 'Ex. « La Rochelle · ouvert au remote ».',
    },
  },
  {
    name: 'availability',
    type: 'select',
    defaultValue: 'available',
    options: [
      { label: 'Disponible', value: 'available' },
      { label: 'Disponibilité limitée', value: 'limited' },
      { label: 'Indisponible', value: 'unavailable' },
    ],
    admin: {
      description: 'Badge de statut dans le Hero et le bandeau contact.',
    },
  },
  {
    name: 'availabilityLabel',
    type: 'text',
    admin: {
      description: 'Libellé custom du badge (sinon libellé selon le statut).',
    },
  },
  {
    name: 'socialLinks',
    type: 'array',
    fields: [
      {
        name: 'platform',
        type: 'select',
        required: true,
        options: [
          { label: 'GitHub', value: 'github' },
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'X / Twitter', value: 'x' },
          { label: 'Dribbble', value: 'dribbble' },
          { label: 'Autre', value: 'other' },
        ],
      },
      {
        name: 'url',
        type: 'text',
        required: true,
      },
      {
        name: 'label',
        type: 'text',
      },
    ],
  },
  {
    name: 'contactPageSubtitle',
    type: 'textarea',
    admin: {
      description: 'Sous-titre de la page Contact (sinon email affiché).',
    },
  },
  {
    name: 'enableContactForm',
    type: 'checkbox',
    defaultValue: true,
    label: 'Activer le formulaire de contact',
  },
  {
    name: 'contactAutoReplyEnabled',
    type: 'checkbox',
    defaultValue: false,
    label: 'Envoyer un accusé de réception automatique',
    admin: {
      description:
        'Envoie un email de confirmation au visiteur après soumission du formulaire de contact (nécessite Resend).',
    },
  },
  {
    name: 'contactAutoReplySubject',
    type: 'text',
    defaultValue: 'Merci pour votre message, {{name}}',
    admin: {
      description: 'Objet de l’accusé de réception. Placeholder disponible : {{name}}.',
      condition: (_, siblingData) => Boolean(siblingData?.contactAutoReplyEnabled),
    },
  },
  {
    name: 'contactAutoReplyBody',
    type: 'textarea',
    defaultValue:
      'Bonjour {{name}},\n\nNous avons bien reçu votre message et vous répondrons dès que possible.\n\nCordialement.',
    admin: {
      description: 'Corps du message d’accusé de réception. Placeholder disponible : {{name}}.',
      condition: (_, siblingData) => Boolean(siblingData?.contactAutoReplyEnabled),
    },
  },
]

const contentFields: Field[] = [
  {
    name: 'aboutIntro',
    type: 'textarea',
    admin: {
      description: 'Résumé court (Hero + intro À propos).',
    },
  },
  {
    name: 'aboutHeadline',
    type: 'text',
    admin: {
      description: 'Titre fort sous le profil (ex. « Profil Unique : La Polyvalence… »).',
    },
  },
  {
    name: 'aboutBody',
    type: 'textarea',
    admin: {
      description: 'Texte long de la page À propos (CMS-first, pas de copy en dur).',
    },
  },
  {
    name: 'skillsTitle',
    type: 'text',
    admin: {
      description: 'Titre de la section Compétences (À propos).',
    },
  },
  {
    name: 'skillsSubtitle',
    type: 'text',
    admin: {
      description: 'Sous-titre de la section Compétences (À propos).',
    },
  },
  {
    name: 'approachSteps',
    type: 'array',
    labels: { singular: 'Étape', plural: 'Approche' },
    admin: {
      description: 'Section « Approche » sur l’accueil (3 étapes recommandées).',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    name: 'whyMePoints',
    type: 'array',
    labels: { singular: 'Argument', plural: 'Pourquoi moi' },
    admin: {
      description: 'Arguments différenciants (accordéon À propos).',
    },
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Titre' },
      { name: 'description', type: 'text', label: 'Complément' },
    ],
  },
  {
    name: 'skillGroups',
    type: 'array',
    labels: { singular: 'Famille', plural: 'Compétences (à propos)' },
    admin: {
      description: 'Blocs compétences (accordéon À propos).',
    },
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Catégorie' },
      {
        name: 'items',
        type: 'textarea',
        required: true,
        label: 'Compétences',
        admin: {
          description: 'Une ligne par sous-compétence (ex. « Suite Adobe CC : Photoshop… »).',
        },
      },
    ],
  },
  {
    name: 'personalProjects',
    type: 'array',
    labels: { singular: 'Projet personnel', plural: 'Projets personnels' },
    admin: {
      description: 'Initiatives perso sur la page À propos.',
    },
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Titre' },
      { name: 'description', type: 'textarea', required: true, label: 'Description' },
    ],
  },
]

const cvFields: Field[] = [
  {
    name: 'cv',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Override optionnel : PDF statique. Si vide, /api/cv génère le PDF dynamiquement.',
    },
  },
  {
    name: 'cvJobTitle',
    type: 'text',
    admin: {
      description:
        'Intitulé de poste sous le nom sur le CV (ATS). Ex. « Chargé de Clientèle & Projets Digitaux | Commercial B2B ».',
    },
  },
  {
    name: 'cvPitch',
    type: 'textarea',
    admin: {
      description: 'Projet professionnel / pitch long pour le CV PDF (sinon aboutIntro).',
    },
  },
  {
    name: 'mobility',
    type: 'text',
    admin: {
      description: 'Ex. « Permis B — véhicule personnel, déplacements régionaux ».',
    },
  },
  {
    name: 'interests',
    type: 'text',
    admin: {
      description: "Centres d'intérêt (CV PDF).",
    },
  },
  {
    name: 'rqthNote',
    type: 'textarea',
    admin: {
      description: 'Mention RQTH / aménagements (sensible — contrôlé par showRqthOnCv).',
    },
  },
  {
    name: 'showRqthOnCv',
    type: 'checkbox',
    defaultValue: false,
    label: 'Afficher la mention RQTH sur le CV PDF',
  },
  {
    name: 'languages',
    type: 'array',
    labels: { singular: 'Langue', plural: 'Langues' },
    admin: {
      description: 'Langues pour le CV PDF.',
    },
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Langue' },
      { name: 'level', type: 'text', required: true, label: 'Niveau' },
    ],
  },
  {
    name: 'cvCompetencies',
    type: 'array',
    labels: { singular: 'Catégorie CV', plural: 'Compétences CV' },
    admin: {
      description:
        'Catégories de compétences textuelles pour le CV (ATS) — sans pourcentages ni jauges.',
    },
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Catégorie' },
      {
        name: 'description',
        type: 'textarea',
        required: true,
        label: 'Compétences (liste)',
        admin: {
          description:
            'Séparer par virgules ou retours à la ligne (ex. Prospection B2B/B2C, CRM, Relation Client).',
        },
      },
    ],
  },
]

const legalFields: Field[] = [
  {
    name: 'legalPublisher',
    type: 'text',
    admin: {
      description: 'Éditeur du site (mentions légales). Par défaut : nom du site.',
    },
  },
  {
    name: 'legalDirector',
    type: 'text',
    admin: {
      description: 'Directeur de la publication (mentions légales).',
    },
  },
  {
    name: 'legalHostingProvider',
    type: 'textarea',
    admin: {
      description:
        'Bloc hébergeur (une ligne par prestataire). Ex. « Vercel Inc. — vercel.com ».',
    },
  },
  {
    name: 'footerExtraLine',
    type: 'text',
    admin: {
      description: 'Ligne optionnelle sous le copyright du footer.',
    },
  },
  {
    name: 'footerLinks',
    type: 'array',
    labels: { singular: 'Lien footer', plural: 'Liens footer' },
    admin: {
      description:
        'Liens affichés dans le footer (ex. mentions légales, confidentialité, GitHub). Si vide, les liens légaux par défaut sont utilisés.',
    },
    fields: [
      { name: 'label', type: 'text', required: true, label: 'Libellé' },
      { name: 'href', type: 'text', required: true, label: 'URL' },
      {
        name: 'openInNewTab',
        type: 'checkbox',
        label: 'Ouvrir dans un nouvel onglet',
      },
    ],
  },
]

const journalFields: Field[] = [
  {
    name: 'journalNavLabel',
    type: 'text',
    defaultValue: 'Le Lablog',
    admin: { description: 'Libellé navigation (sidebar / mobile).' },
  },
  {
    name: 'journalTitle',
    type: 'text',
    defaultValue: 'Le Lablog',
    admin: { description: 'Titre H1 page listing.' },
  },
  {
    name: 'journalEyebrow',
    type: 'text',
    defaultValue: 'La blague du labo',
  },
  {
    name: 'journalSubtitle',
    type: 'textarea',
    defaultValue:
      'Entre le labo, le blog et la blague — créations IA, galeries visuelles et articles du moment. Skyblog 2026, version sérieuse (enfin, on essaie).',
  },
  {
    name: 'featuredJournalPosts',
    type: 'relationship',
    relationTo: 'journal-posts',
    hasMany: true,
    maxRows: 3,
    admin: { description: 'Articles Lablog mis en avant sur l’accueil (max 3).' },
  },
]

const advancedFields: Field[] = [
  {
    name: 'maintenanceMode',
    type: 'checkbox',
    defaultValue: false,
    label: 'Mode maintenance (bandeau visible sur le site public)',
  },
  {
    name: 'maintenanceMessage',
    type: 'textarea',
    admin: {
      description: 'Message affiché dans le bandeau maintenance.',
      condition: (_, siblingData) => Boolean(siblingData?.maintenanceMode),
    },
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  admin: {
    group: 'Configuration',
    description:
      'Identité, contact, contenu éditorial, CV, mentions légales et options avancées — organisés par onglets.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    { type: 'collapsible', label: 'Identité', admin: { initCollapsed: false }, fields: identityFields },
    { type: 'collapsible', label: 'Contact', admin: { initCollapsed: true }, fields: contactFields },
    { type: 'collapsible', label: 'Contenu', admin: { initCollapsed: true }, fields: contentFields },
    { type: 'collapsible', label: 'CV', admin: { initCollapsed: true }, fields: cvFields },
    { type: 'collapsible', label: 'Légal', admin: { initCollapsed: true }, fields: legalFields },
    { type: 'collapsible', label: 'Le Lablog', admin: { initCollapsed: true }, fields: journalFields },
    { type: 'collapsible', label: 'Avancé', admin: { initCollapsed: true }, fields: advancedFields },
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}
