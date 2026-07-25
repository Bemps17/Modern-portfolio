import type { CollectionConfig } from 'payload'

import { slugify } from '@/lib/utils'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Contenu',
    description: 'Tags transverses pour articles Lablog et projets.',
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'name',
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
        description: 'Généré depuis le nom si laissé vide.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        if (!data.slug && data.name) {
          data.slug = slugify(String(data.name))
        } else if (data.slug) {
          data.slug = slugify(String(data.slug))
        }
        return data
      },
    ],
  },
}
