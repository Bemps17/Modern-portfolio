import type { CollectionConfig } from 'payload'

import { revalidateContentPages, revalidateContentPagesDelete } from '../lib/revalidate'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'updatedAt'],
    group: 'Contenu',
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
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Outils', value: 'outils' },
        { label: 'Design', value: 'design' },
        { label: 'Soft skills', value: 'soft' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateContentPages],
    afterDelete: [revalidateContentPagesDelete],
  },
}
