import type { CollectionConfig } from 'payload'

import { revalidateContentPages, revalidateContentPagesDelete } from '../lib/revalidate'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'dateStart', 'current'],
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
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'dateStart',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MM/yyyy',
        },
      },
    },
    {
      name: 'dateEnd',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MM/yyyy',
        },
        condition: (_, siblingData) => !siblingData?.current,
      },
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateContentPages],
    afterDelete: [revalidateContentPagesDelete],
  },
}
