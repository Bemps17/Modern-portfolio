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
        description: 'CV PDF téléchargeable.',
      },
    },
    {
      name: 'aboutIntro',
      type: 'textarea',
      admin: {
        description: 'Résumé court (Hero + intro À propos).',
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
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}
