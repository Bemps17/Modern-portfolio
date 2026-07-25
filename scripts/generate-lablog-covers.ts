/**
 * Génère les covers Lablog dans public/carnet/{slug}-cover.webp
 * Usage : pnpm generate:lablog-covers
 */
import fs from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

import { LABLOG_ARTICLES } from '../src/data/lablog-articles'
import { buildLablogCoverSvg } from '../src/lib/lablog-cover-art'

const OUT_DIR = path.join(process.cwd(), 'public/carnet')

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const article of LABLOG_ARTICLES) {
    const svg = buildLablogCoverSvg(article.coverTheme)
    const outPath = path.join(OUT_DIR, `${article.slug}-cover.webp`)
    await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(outPath)
    console.log(`✓ ${article.slug}`)
  }

  console.log(`\n${LABLOG_ARTICLES.length} covers → ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
