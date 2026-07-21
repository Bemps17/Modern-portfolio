/**
 * Génère une cover unique par projet dans public/projects/{slug}-cover.webp
 * 1. Tente og:image / favicon depuis liveUrl
 * 2. Tente téléchargement depuis le site legacy
 * 3. Sinon génère une cover SVG→WebP via sharp
 *
 * Usage : pnpm generate:covers
 */
import fs from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

import { legacyProjects } from '../src/data/portfolio-fallback'
import { buildProjectCoverSvg } from '../src/lib/project-cover-art'

const LEGACY_SITE = 'https://projet-refonte-portfolio-persov1-0.vercel.app'
const OUT_DIR = path.join(process.cwd(), 'public/projects')

type CoverSource = {
  slug: string
  title: string
  liveUrl?: string | null
  legacyPath?: string | null
  tags?: string[]
}

async function fetchBuffer(url: string, timeoutMs = 8000): Promise<Buffer | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    if (!response.ok) return null
    const type = response.headers.get('content-type') ?? ''
    if (!type.startsWith('image/') && !type.includes('svg') && type !== 'image/x-icon') return null
    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.length < 200) return null
    return buffer
  } catch {
    return null
  }
}

async function fetchOgImage(siteUrl: string): Promise<Buffer | null> {
  try {
    const response = await fetch(siteUrl, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return null
    const html = await response.text()
    const match =
      html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ??
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i)
    if (!match?.[1]) return null
    const ogUrl = new URL(match[1], siteUrl).href
    return fetchBuffer(ogUrl)
  } catch {
    return null
  }
}

async function fetchSiteIcon(siteUrl: string): Promise<Buffer | null> {
  const paths = ['/apple-touch-icon.png', '/icon.svg', '/favicon.ico', '/favicon.png']
  for (const iconPath of paths) {
    const buffer = await fetchBuffer(new URL(iconPath, siteUrl).href)
    if (buffer) return buffer
  }
  return null
}

async function resolveCoverBuffer(source: CoverSource): Promise<Buffer | null> {
  if (source.liveUrl) {
    const og = await fetchOgImage(source.liveUrl)
    if (og) return og
    const icon = await fetchSiteIcon(source.liveUrl)
    if (icon) return icon
  }

  if (source.legacyPath) {
    const url = source.legacyPath.startsWith('http')
      ? source.legacyPath
      : `${LEGACY_SITE}${source.legacyPath}`
    const legacy = await fetchBuffer(url)
    if (legacy) return legacy
  }

  return null
}

async function saveCoverWebp(source: CoverSource, input: Buffer): Promise<void> {
  const outPath = path.join(OUT_DIR, `${source.slug}-cover.webp`)
  try {
    await sharp(input, { animated: false })
      .resize(1200, 750, { fit: 'cover', position: 'centre' })
      .webp({ quality: 86 })
      .toFile(outPath)
  } catch {
    await saveGeneratedCover(source)
  }
}

async function saveGeneratedCover(source: CoverSource): Promise<void> {
  const subtitle = source.tags?.slice(0, 3).join(' · ')
  const svg = buildProjectCoverSvg(source.title, source.slug, subtitle)
  const outPath = path.join(OUT_DIR, `${source.slug}-cover.webp`)
  await sharp(Buffer.from(svg)).resize(1200, 750).webp({ quality: 86 }).toFile(outPath)
}

function projectSources(): CoverSource[] {
  return legacyProjects.map((project) => ({
    slug: project.id,
    title: project.title,
    liveUrl: project.link,
    legacyPath: project.image,
    tags: project.tags,
  }))
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const sources = projectSources()
  let fetched = 0
  let generated = 0

  for (const source of sources) {
    const outPath = path.join(OUT_DIR, `${source.slug}-cover.webp`)
    process.stdout.write(`${source.slug}… `)

    const remote = await resolveCoverBuffer(source)
    if (remote) {
      await saveCoverWebp(source, remote)
      fetched++
      console.log('✓ site/legacy')
      continue
    }

    await saveGeneratedCover(source)
    generated++
    console.log('✓ generated')
  }

  console.log(`\n${sources.length} covers — ${fetched} depuis sites, ${generated} générées → ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
