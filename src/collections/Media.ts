import type { CollectionConfig } from 'payload'

import { revalidateMediaChange, revalidateMediaDelete } from '../lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Texte alternatif obligatoire (accessibilité + SEO).',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  hooks: {
    afterChange: [revalidateMediaChange],
    afterDelete: [revalidateMediaDelete],
  },
}
