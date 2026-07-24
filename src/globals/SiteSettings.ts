import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '../lib/revalidate'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  admin: {
    group: 'Configuration',
    description: 'Identité (logo, favicon, avatar), réseaux sociaux et coordonnées.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
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
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Portrait affiché dans le Hero et la page À propos.',
      },
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
      name: 'email',
      type: 'email',
      required: true,
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
      name: 'cv',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Override optionnel : PDF statique. Si vide, /api/cv génère le PDF dynamiquement.',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Téléphone affiché sur le CV PDF.',
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
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}
