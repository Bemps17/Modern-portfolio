import type { GlobalConfig } from 'payload'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const SEODefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO par défaut',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      name: 'defaultTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      required: true,
      maxLength: 160,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
