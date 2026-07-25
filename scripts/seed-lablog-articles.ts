/**
 * Seed Le Lablog — 12 articles tech avec covers locales.
 * Usage : pnpm seed:lablog
 */
import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { LABLOG_ARTICLES } from '../src/data/lablog-articles'
import { lablogCoverPublicPath } from '../src/data/lablog-article-types'
import { portfolioFallback } from '../src/data/portfolio-fallback'
import { blocksToLexical } from '../src/lib/lexical-content'
import config from '../src/payload.config'

function mimeFromExt(filename: string): string {
  if (filename.endsWith('.webp')) return 'image/webp'
  if (filename.endsWith('.png')) return 'image/png'
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg'
  return 'application/octet-stream'
}

async function uploadCoverFile(
  payload: Awaited<ReturnType<typeof getPayload>>,
  absPath: string,
  alt: string,
) {
  const buffer = fs.readFileSync(absPath)
  const filename = path.basename(absPath)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: mimeFromExt(filename),
      name: filename,
      size: buffer.length,
    },
  })
}

async function findOrUploadCover(
  payload: Awaited<ReturnType<typeof getPayload>>,
  absPath: string,
  alt: string,
) {
  const filename = path.basename(absPath)
  const baseName = filename.replace(/-\d+\.webp$/, '').replace(/\.webp$/, '')

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { contains: baseName } },
    limit: 1,
    sort: '-createdAt',
  })

  if (existing.docs[0]) {
    return existing.docs[0]
  }

  return uploadCoverFile(payload, absPath, alt)
}

async function upsertJournalPost(
  payload: Awaited<ReturnType<typeof getPayload>>,
  article: (typeof LABLOG_ARTICLES)[number],
  coverId: number,
) {
  const existing = await payload.find({
    collection: 'journal-posts',
    where: { slug: { equals: article.slug } },
    limit: 1,
  })

  const data = {
    postType: 'article' as const,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: blocksToLexical([...article.blocks]),
    cover: coverId,
    category: article.category,
    publishedAt: article.publishedAt,
    status: 'published' as const,
    order: article.order,
  }

  if (existing.docs[0]) {
    return payload.update({
      collection: 'journal-posts',
      id: existing.docs[0].id,
      data,
    })
  }

  return payload.create({
    collection: 'journal-posts',
    data,
  })
}

async function syncJournalSiteSettings(payload: Awaited<ReturnType<typeof getPayload>>) {
  const { journalNavLabel, journalTitle, journalEyebrow, journalSubtitle } =
    portfolioFallback.siteSettings

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      journalNavLabel,
      journalTitle,
      journalEyebrow,
      journalSubtitle,
    },
  })
  console.log('✓ site-settings journal (Le Lablog)')
}

async function main() {
  const payload = await getPayload({ config: await config })

  await syncJournalSiteSettings(payload)

  const coversDir = path.join(process.cwd(), 'public/carnet')
  if (!fs.existsSync(coversDir)) {
    console.error('Covers manquantes — exécutez pnpm generate:lablog-covers')
    process.exit(1)
  }

  for (const article of LABLOG_ARTICLES) {
    const coverPath = path.join(process.cwd(), 'public', lablogCoverPublicPath(article.slug).slice(1))
    if (!fs.existsSync(coverPath)) {
      console.error(`Cover absente : ${coverPath}`)
      process.exit(1)
    }

    const media = await findOrUploadCover(payload, coverPath, `Cover — ${article.title}`)
    await upsertJournalPost(payload, article, media.id)
    console.log(`✓ ${article.slug}`)
  }

  console.log(`\n${LABLOG_ARTICLES.length} articles Lablog seedés.`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
