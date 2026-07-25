import type { Access, CollectionConfig } from 'payload'

import { applyLablogBlueprint } from '../lib/lablog-article-blueprint'
import { slugify } from '../lib/utils'
import { editorialLivePreviewConfig } from '../lib/payload-editorial-drafts'
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

const POST_TYPE_OPTIONS = [
  { label: 'Article', value: 'article' },
  { label: 'Galerie photos', value: 'gallery' },
] as const

const GALLERY_LAYOUT_OPTIONS = [
  { label: 'Grille de vignettes', value: 'grid' },
  { label: 'Diaporama', value: 'slideshow' },
] as const

const JSON_TEXTAREA_FIELD = '/components/admin/JsonTextareaField#default'

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  labels: {
    singular: 'Le Lablog',
    plural: 'Le Lablog',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'postType', 'category', 'status', 'publishedAt', 'updatedAt'],
    group: 'Contenu',
    description: 'Articles et galeries du Lablog (publics uniquement si published).',
    preview: (doc) => {
      if (!doc?.slug) return null
      return `${siteUrl}/carnet/${doc.slug}`
    },
    ...editorialLivePreviewConfig('journal-posts').admin,
  },
  access: {
    read: isPublishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'postType',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [...POST_TYPE_OPTIONS],
      admin: {
        position: 'sidebar',
        description: 'Article classique ou galerie d’images (grille ou diaporama).',
      },
    },
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
      name: 'contentBlueprint',
      type: 'json',
      admin: {
        condition: (_, siblingData) => siblingData?.postType === 'article',
        description:
          'Blueprint JSON (title, excerpt, category, blocks). À la sauvegarde, régénère le corps si le JSON a changé. Modèle de référence : Global « Modèle article Lablog ».',
        components: {
          Field: JSON_TEXTAREA_FIELD,
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData?.postType === 'article',
        description: 'Corps de l’article (non requis pour une galerie pure).',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { postType?: string } }) => {
        if (siblingData?.postType === 'article' && !value) {
          return 'Le contenu est requis pour un article.'
        }
        return true
      },
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
      admin: {
        condition: (_, siblingData) => siblingData?.postType === 'gallery',
        description: 'Images de la galerie — affichées en grille ou diaporama.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: { description: 'Légende optionnelle (diaporama).' },
        },
      ],
      validate: (value: unknown[] | null | undefined, { siblingData }: { siblingData?: { postType?: string } }) => {
        if (siblingData?.postType === 'gallery' && (!value || value.length === 0)) {
          return 'Ajoutez au moins une image pour une galerie.'
        }
        return true
      },
    },
    {
      name: 'galleryLayout',
      type: 'select',
      defaultValue: 'grid',
      options: [...GALLERY_LAYOUT_OPTIONS],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.postType === 'gallery',
        description: 'Grille de vignettes ou diaporama plein écran.',
      },
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
      ({ data, operation, originalDoc }) => {
        if (!data) return data
        if (!data.slug && data.title) {
          data.slug = slugify(data.title)
        } else if (data.slug) {
          data.slug = slugify(data.slug)
        }

        const blueprint = data.contentBlueprint
        const blueprintChanged =
          blueprint != null &&
          JSON.stringify(blueprint) !== JSON.stringify(originalDoc?.contentBlueprint ?? null)

        if (data.postType === 'article' && blueprint && (operation === 'create' || blueprintChanged)) {
          const applied = applyLablogBlueprint(blueprint, {
            title: data.title,
            excerpt: data.excerpt,
            category: data.category,
          })
          data.content = applied.content
          if (applied.title) data.title = applied.title
          if (applied.excerpt) data.excerpt = applied.excerpt
          if (applied.category) data.category = applied.category
        }

        return data
      },
    ],
    afterChange: [revalidateJournalPosts],
    afterDelete: [revalidateJournalPostsDelete],
  },
}
