import type { GlobalConfig } from 'payload'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  admin: {
    group: 'Configuration',
    description: 'Identité, réseaux sociaux et coordonnées.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Portfolio',
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X / Twitter', value: 'x' },
            { label: 'Dribbble', value: 'dribbble' },
            { label: 'Autre', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'cv',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'CV PDF téléchargeable.',
      },
    },
    {
      name: 'aboutIntro',
      type: 'textarea',
      admin: {
        description: 'Résumé affiché sur la page d’accueil et À propos.',
      },
    },
  ],
}
