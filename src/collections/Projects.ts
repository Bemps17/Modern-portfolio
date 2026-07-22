import type { Access, CollectionConfig } from 'payload'

import { slugify } from '../lib/utils'
import { revalidateProjects, revalidateProjectsDelete } from '../lib/revalidate'
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

const STACK_OPTIONS = [
  { label: 'Next.js', value: 'nextjs' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Payload CMS', value: 'payload' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'PostgreSQL', value: 'postgres' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'Framer Motion', value: 'framer-motion' },
  { label: 'Vercel', value: 'vercel' },
  { label: 'Neon', value: 'neon' },
] as const

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'order', 'updatedAt'],
    group: 'Contenu',
    description: 'Projets du portfolio (publics uniquement si published).',
    preview: (doc) => {
      if (!doc?.slug) return null
      return `${siteUrl}/projets/${doc.slug}`
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
      maxLength: 200,
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
      name: 'stack',
      type: 'select',
      hasMany: true,
      options: [...STACK_OPTIONS],
    },
    {
      name: 'liveUrl',
      type: 'text',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'URL invalide'
        }
      },
    },
    {
      name: 'repoUrl',
      type: 'text',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'URL invalide'
        }
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
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
    afterChange: [revalidateProjects],
    afterDelete: [revalidateProjectsDelete],
  },
}
