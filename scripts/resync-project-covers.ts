/**
 * Ré-uploade les covers `public/projects/{slug}-cover.webp` vers Vercel Blob
 * et met à jour `projects.cover` (corrige les 404 `/api/media/file/*-cover-1.webp`).
 *
 * Usage : pnpm resync:covers
 */
import fs from 'node:fs'
import path from 'node:path'

import { config as loadEnv } from 'dotenv'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { mimeFromExt, resolveLocalCoverFile } from '../src/lib/project-cover-path'

loadEnv({ path: '.env.local' })
loadEnv()

async function uploadCover(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  title: string,
) {
  const local = resolveLocalCoverFile(slug)
  if (!local) {
    throw new Error(`Cover introuvable pour ${slug} dans public/projects/`)
  }
  const buffer = fs.readFileSync(local.abs)
  const filename = path.basename(local.abs)
  return payload.create({
    collection: 'media',
    data: { alt: `Cover — ${title}` },
    file: {
      data: buffer,
      mimetype: mimeFromExt(filename),
      name: filename,
      size: buffer.length,
    },
  })
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    throw new Error('DATABASE_URI et PAYLOAD_SECRET requis')
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn('⚠ BLOB_READ_WRITE_TOKEN absent — upload local uniquement (cassera en prod)')
  }

  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 200,
    depth: 0,
    sort: 'order',
  })

  let ok = 0
  let fail = 0
  for (const project of projects.docs) {
    try {
      const media = await uploadCover(payload, project.slug, project.title)
      await payload.update({
        collection: 'projects',
        id: project.id,
        data: { cover: media.id },
      })
      console.log(`✓ ${project.slug} → media #${media.id} (${media.url})`)
      ok++
    } catch (error) {
      fail++
      console.error(`✗ ${project.slug}`, error instanceof Error ? error.message : error)
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} fail / ${projects.docs.length}`)
  process.exit(fail ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
