import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
    importMap: {
      baseDir: path.resolve(dirname),
    },
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
