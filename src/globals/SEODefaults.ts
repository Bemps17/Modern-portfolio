import type { Field, GlobalConfig } from 'payload'

import { revalidateGlobals } from '../lib/revalidate'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

const generalFields: Field[] = [
  {
    name: 'defaultTitle',
    type: 'text',
    required: true,
    admin: {
      description: 'Titre par défaut (accueil et fallback des pages).',
    },
  },
  {
    name: 'defaultDescription',
    type: 'textarea',
    required: true,
    maxLength: 160,
    admin: {
      description: 'Meta description par défaut (160 caractères max).',
    },
  },
  {
    name: 'titleTemplate',
    type: 'text',
    defaultValue: '%s | Portfolio',
    admin: {
      description: 'Modèle pour les pages internes. Utilisez %s pour le titre de page.',
    },
  },
  {
    name: 'keywords',
    type: 'textarea',
    admin: {
      description: 'Mots-clés séparés par des virgules (meta keywords).',
    },
  },
]

const openGraphFields: Field[] = [
  {
    name: 'ogImage',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Image Open Graph par défaut (1200×630 recommandé).',
    },
  },
  {
    name: 'ogLocale',
    type: 'text',
    defaultValue: 'fr_FR',
    admin: {
      description: 'Locale Open Graph (ex. fr_FR).',
    },
  },
  {
    name: 'ogSiteName',
    type: 'text',
    admin: {
      description: 'Nom du site pour Open Graph (sinon nom du site).',
    },
  },
]

const twitterFields: Field[] = [
  {
    name: 'twitterCard',
    type: 'select',
    defaultValue: 'summary_large_image',
    options: [
      { label: 'Grande image (summary_large_image)', value: 'summary_large_image' },
      { label: 'Résumé (summary)', value: 'summary' },
    ],
  },
  {
    name: 'twitterSite',
    type: 'text',
    admin: {
      description: 'Compte du site (@handle).',
    },
  },
  {
    name: 'twitterCreator',
    type: 'text',
    admin: {
      description: 'Créateur / auteur (@handle).',
    },
  },
]

const indexingFields: Field[] = [
  {
    name: 'noindexSite',
    type: 'checkbox',
    defaultValue: false,
    label: 'Désindexer tout le site (noindex global)',
    admin: {
      description: 'Utile pour les previews ou environnements de staging.',
    },
  },
  {
    name: 'robotsIndex',
    type: 'checkbox',
    defaultValue: true,
    label: 'Autoriser l’indexation (index)',
  },
  {
    name: 'robotsFollow',
    type: 'checkbox',
    defaultValue: true,
    label: 'Autoriser le suivi des liens (follow)',
  },
  {
    name: 'googleSiteVerification',
    type: 'text',
    admin: {
      description: 'Code de vérification Google Search Console (meta tag).',
    },
  },
  {
    name: 'canonicalBaseUrl',
    type: 'text',
    admin: {
      description:
        'URL canonique de base (override). Laissez vide pour NEXT_PUBLIC_SITE_URL / domaine courant.',
    },
  },
]

const structuredDataFields: Field[] = [
  {
    name: 'enablePersonJsonLd',
    type: 'checkbox',
    defaultValue: true,
    label: 'Activer le schéma Person (JSON-LD)',
  },
  {
    name: 'enableWebsiteJsonLd',
    type: 'checkbox',
    defaultValue: true,
    label: 'Activer le schéma WebSite (JSON-LD)',
  },
  {
    name: 'schemaAuthorName',
    type: 'text',
    admin: {
      description: 'Nom de l’auteur pour les données structurées (sinon nom du site).',
    },
  },
]

export const SEODefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO par défaut',
  admin: {
    group: 'Configuration',
    description:
      'Balises meta, Open Graph, Twitter, indexation et JSON-LD — organisés par onglets.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Général', fields: generalFields },
        { label: 'Open Graph', fields: openGraphFields },
        { label: 'Twitter', fields: twitterFields },
        { label: 'Indexation', fields: indexingFields },
        { label: 'JSON-LD', fields: structuredDataFields },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}
