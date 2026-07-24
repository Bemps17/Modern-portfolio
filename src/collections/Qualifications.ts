import type { CollectionConfig } from 'payload'

import { revalidateContentPages, revalidateContentPagesDelete } from '../lib/revalidate'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const Qualifications: CollectionConfig = {
  slug: 'qualifications',
  labels: {
    singular: 'Formation / certification',
    plural: 'Formations & certifications',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'institution', 'year'],
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Intitulé',
    },
    {
      name: 'institution',
      type: 'text',
      label: 'Établissement',
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      label: 'Année',
      min: 1950,
      max: 2100,
    },
  ],
  hooks: {
    afterChange: [revalidateContentPages],
    afterDelete: [revalidateContentPagesDelete],
  },
}
