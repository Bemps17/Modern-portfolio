import type { Access, CollectionConfig } from 'payload'

import { slugify } from '../lib/utils'
import { revalidateJournalPosts, revalidateJournalPostsDelete } from '../lib/revalidate'
import { getSiteUrl } from '../lib/site-url'

const siteUrl = getSiteUrl()

const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

const isPublishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    status: {
      equals: 'published',
    },
  }
}

const CATEGORY_OPTIONS = [
  { label: 'IA', value: 'ia' },
  { label: 'Design', value: 'design' },
  { label: 'Veille', value: 'veille' },
  { label: 'Perso', value: 'perso' },
  { label: 'Autre', value: 'autre' },
] as const

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  labels: {
    singular: 'Carnet',
    plural: 'Carnet',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'order', 'updatedAt'],
    group: 'Contenu',
    description: 'Articles du carnet créatif (publics uniquement si published).',
    preview: (doc) => {
      if (!doc?.slug) return null
      return `${siteUrl}/carnet/${doc.slug}`
    },
  },
  access: {
    read: isPublishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Généré automatiquement depuis le titre si laissé vide.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 220,
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'ia',
      options: [...CATEGORY_OPTIONS],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        if (!data.slug && data.title) {
          data.slug = slugify(data.title)
        } else if (data.slug) {
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
    afterChange: [revalidateJournalPosts],
    afterDelete: [revalidateJournalPostsDelete],
  },
}
