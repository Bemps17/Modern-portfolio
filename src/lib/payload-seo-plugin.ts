import { seoPlugin } from '@payloadcms/plugin-seo'

import { getSiteUrl } from '@/lib/site-url'

const siteUrl = getSiteUrl()

export const portfolioSeoPlugin = seoPlugin({
  collections: ['projects', 'journal-posts'],
  uploadsCollection: 'media',
  tabbedUI: true,
  generateTitle: ({ doc }) => {
    const title = typeof doc?.title === 'string' ? doc.title : 'Sans titre'
    return title
  },
  generateDescription: ({ doc }) => {
    const excerpt = typeof doc?.excerpt === 'string' ? doc.excerpt : ''
    return excerpt.slice(0, 160)
  },
  generateURL: ({ doc, collectionSlug }) => {
    const slug = typeof doc?.slug === 'string' ? doc.slug : ''
    if (!slug) return siteUrl
    if (collectionSlug === 'journal-posts') return `${siteUrl}/carnet/${slug}`
    return `${siteUrl}/projets/${slug}`
  },
  fields: ({ defaultFields }) => [
    ...defaultFields,
    {
      name: 'canonicalURL',
      type: 'text',
      admin: {
        description: 'URL canonique override (laisser vide = URL auto).',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Exclure cette page des moteurs de recherche.',
      },
    },
  ],
})
