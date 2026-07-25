import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Experiences } from './collections/Experiences'
import { JournalPosts } from './collections/JournalPosts'
import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Qualifications } from './collections/Qualifications'
import { Skills } from './collections/Skills'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { LablogTemplate } from './globals/LablogTemplate'
import { SEODefaults } from './globals/SEODefaults'
import { SiteSettings } from './globals/SiteSettings'
import { portfolioSeoPlugin } from './lib/payload-seo-plugin'
import { getDatabaseUri, getPayloadSecret, syncDatabaseUriEnv } from './lib/payload-env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

syncDatabaseUriEnv()

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  admin: {
    user: Users.slug,
    /** Dark only — aligné univers marque (pas de toggle light). */
    theme: 'dark',
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 800 },
      ],
    },
    meta: {
      titleSuffix: ' — Portfolio',
      description: 'Administration du portfolio — CMS Payload',
      icons: {
        icon: '/brand/favicon.svg',
        apple: '/apple-icon.png',
      },
      openGraph: {
        images: [{ url: '/brand/favicon.png' }],
      },
    },
    dashboard: {
      widgets: [
        {
          slug: 'portfolio-welcome',
          Component: '/components/admin/AdminWelcomeWidget',
          minWidth: 'full',
          maxWidth: 'full',
        },
        {
          slug: 'portfolio-stats',
          Component: '/components/admin/AdminStatsWidget',
          minWidth: 'full',
          maxWidth: 'full',
        },
        {
          slug: 'portfolio-shortcuts',
          Component: '/components/admin/AdminShortcutsWidget',
          minWidth: 'full',
          maxWidth: 'full',
        },
        {
          slug: 'collections',
          Component: '@payloadcms/next/rsc#CollectionCards',
          minWidth: 'full',
        },
      ],
      defaultLayout: [
        { widgetSlug: 'portfolio-welcome', width: 'full' },
        { widgetSlug: 'portfolio-stats', width: 'full' },
        { widgetSlug: 'portfolio-shortcuts', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
      /** Bouton header : force la revalidation du front + toast. */
      actions: ['/components/admin/RevalidateSiteButton'],
      beforeDashboard: ['/components/admin/TrustedDevicePanel'],
    },
    /** Toasts de confirmation un peu plus visibles. */
    toast: {
      duration: 4500,
      position: 'bottom-right',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  /** Interface admin en français uniquement (pas de bascule navigateur EN). */
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  collections: [Users, Media, Projects, JournalPosts, Skills, Experiences, Qualifications, Tags, FormSubmissions],
  globals: [SiteSettings, SEODefaults, LablogTemplate],
  editor: lexicalEditor(),
  secret: getPayloadSecret(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getDatabaseUri(),
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true' || process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [
    portfolioSeoPlugin,
    ...(blobToken
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: blobToken,
          }),
        ]
      : []),
  ],
})
