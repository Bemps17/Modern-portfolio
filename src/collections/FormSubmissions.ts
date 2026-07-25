import type { CollectionConfig } from 'payload'

import {
  sendContactAutoReply,
  sendFormSubmissionNotification,
  shouldNotifyFormSubmission,
} from '@/lib/form-submission-notify'

const isAuthenticated = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

const INBOX_STATUS_OPTIONS = [
  { label: 'Nouveau', value: 'new' },
  { label: 'Lu', value: 'read' },
  { label: 'Répondu', value: 'replied' },
] as const

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'inboxStatus', 'createdAt'],
    group: 'Inbox',
    description: 'Messages reçus via le formulaire de contact.',
  },
  access: {
    read: isAuthenticated,
    create: () => true,
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
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'inboxStatus',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [...INBOX_STATUS_OPTIONS],
      admin: {
        position: 'sidebar',
        description: 'Suivi CRM minimal dans l’inbox.',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (!shouldNotifyFormSubmission({ operation })) return doc
        if (!doc?.name || !doc?.email || !doc?.message) return doc

        await sendFormSubmissionNotification({
          name: String(doc.name),
          email: String(doc.email),
          message: String(doc.message),
          resendApiKey: process.env.RESEND_API_KEY,
          toEmail: process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL,
          fromEmail: process.env.CONTACT_FROM_EMAIL,
        })

        const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0 })
        if (settings?.contactAutoReplyEnabled) {
          await sendContactAutoReply({
            name: String(doc.name),
            email: String(doc.email),
            subject: String(settings.contactAutoReplySubject ?? ''),
            body: String(settings.contactAutoReplyBody ?? ''),
            enabled: true,
            resendApiKey: process.env.RESEND_API_KEY,
            fromEmail: process.env.CONTACT_FROM_EMAIL,
          })
        }

        return doc
      },
    ],
  },
}
