import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Experiences } from './collections/Experiences'
import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Skills } from './collections/Skills'
import { Users } from './collections/Users'
import { SEODefaults } from './globals/SEODefaults'
import { SiteSettings } from './globals/SiteSettings'
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
    meta: {
      titleSuffix: ' — Portfolio',
      description: 'Administration du portfolio — CMS Payload',
      icons: {
        icon: '/brand/favicon.png',
        apple: '/brand/favicon.png',
      },
      openGraph: {
        images: [{ url: '/brand/favicon.png' }],
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  /** Interface admin en français par défaut. */
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr, en },
  },
  collections: [Users, Media, Projects, Skills, Experiences, FormSubmissions],
  globals: [SiteSettings, SEODefaults],
  editor: lexicalEditor(),
  secret: getPayloadSecret(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getDatabaseUri(),
    },
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [
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
