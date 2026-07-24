import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    description: 'Comptes administrateurs uniquement — pas d’inscription publique.',
  },
  auth: {
    /** Session courte : mot de passe demandé souvent sauf appareil de confiance. */
    tokenExpiration: 60 * 60 * 4,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    useSessions: true,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'trustedDevices',
      type: 'array',
      labels: { singular: 'Appareil de confiance', plural: 'Appareils de confiance' },
      admin: {
        description:
          'Appareils autorisés à ouvrir /admin sans resaisir le mot de passe (gérés via le bandeau dashboard).',
        readOnly: true,
      },
      fields: [
        { name: 'deviceId', type: 'text', required: true, admin: { readOnly: true } },
        { name: 'label', type: 'text', required: true, admin: { readOnly: true } },
        {
          name: 'secretHash',
          type: 'text',
          required: true,
          admin: { hidden: true, readOnly: true },
        },
        { name: 'createdAt', type: 'date', required: true, admin: { readOnly: true } },
        { name: 'lastUsedAt', type: 'date', admin: { readOnly: true } },
      ],
    },
  ],
  timestamps: true,
}
