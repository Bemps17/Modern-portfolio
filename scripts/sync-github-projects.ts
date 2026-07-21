/**
 * Synchronise les dépôts GitHub (Bemps17) vers la collection Payload `projects`.
 *
 * Prérequis :
 *   - DATABASE_URI + PAYLOAD_SECRET dans .env.local
 *   - `gh auth login` ou GITHUB_TOKEN avec scope `repo` (pour les dépôts privés)
 *
 * Usage : pnpm sync:github
 */
import 'dotenv/config'

import { execSync } from 'node:child_process'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { slugify } from '../src/lib/utils'

const GITHUB_USER = 'Bemps17'

/** Dépôt GitHub → slug projet existant (mise à jour repoUrl / liveUrl). */
const REPO_TO_EXISTING_SLUG: Record<string, string> = {
  'Modern-portfolio': 'modern-portfolio',
  BsclProject: 'bscl',
  'SnippetBank-': 'snippetbank',
  workflow: 'workfloow',
  PoolTimer: 'pooltimer',
  'la-rochelle-pwa': 'vacanceslr',
  'Guide-streaming-': 'guidestream',
  H8testv1: 'lehangar8',
  Pomodotaskv1: 'pomodotask',
  PoolStory: 'pool-story',
  ProjetPlato: 'projet-plato',
  Reactacademy: 'react-academy',
  scoreur: 'scoreur',
  Calculmutuelle: 'calcul-mutuelle',
  'ManusMalakoff-': 'manus-malakoff',
  StreamConfigv1: 'stream-config',
  'Porfolio-final-v1': 'portfolio-v1',
  'site-perso-v2': 'site-perso-v2',
  'VavancesLR-v0.1': 'vavances-lr',
}

/** Variantes / brouillons à ne pas créer comme nouveaux projets. */
const SKIP_REPO_NAMES = new Set([
  '0-PoolTimer-main',
  'PoolTimer-main',
  'timerpoolV3.1',
  'Skin',
  'SkinCare',
  'Dermite',
  'SitePersoV2',
  'IDW202209_B2_FOUQUET_BERTRAND',
])

type GhRepo = {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  private: boolean
  pushed_at: string
}

const STACK_MAP: Record<string, string> = {
  JavaScript: 'typescript',
  TypeScript: 'typescript',
  React: 'react',
  'Next.js': 'nextjs',
  PostgreSQL: 'postgres',
  Tailwind: 'tailwind',
  Vercel: 'vercel',
  Node: 'nodejs',
  Payload: 'payload',
  Neon: 'neon',
}

function mapStack(language: string | null, tags: string[]): string[] {
  const values = new Set<string>()
  if (language) {
    const mapped = STACK_MAP[language]
    if (mapped) values.add(mapped)
  }
  for (const tag of tags) {
    for (const [key, value] of Object.entries(STACK_MAP)) {
      if (tag.toLowerCase().includes(key.toLowerCase())) values.add(value)
    }
  }
  if (language === 'JavaScript' && !values.has('typescript')) values.add('typescript')
  return [...values]
}

function textToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr' as const,
    },
  }
}

function humanizeRepoName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/v\d+(\.\d+)*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function defaultDescription(repo: GhRepo): string {
  if (repo.description?.trim()) return repo.description.trim()
  const label = humanizeRepoName(repo.name)
  const lang = repo.language ? ` — stack ${repo.language}` : ''
  return `Projet ${label}${lang}. Code source sur GitHub (${GITHUB_USER}/${repo.name}).`
}

function fetchGitHubRepos(): GhRepo[] {
  const token = process.env.GITHUB_TOKEN
  const cmd = token
    ? `curl -s -H "Authorization: Bearer ${token}" "https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&visibility=all"`
    : `gh api "users/${GITHUB_USER}/repos?per_page=100&sort=pushed" --paginate`

  try {
    const raw = token ? execSync(cmd, { encoding: 'utf8' }) : execSync(cmd, { encoding: 'utf8' })
    const parsed = JSON.parse(raw) as GhRepo[] | GhRepo[][]
    return Array.isArray(parsed[0]) ? (parsed as GhRepo[][]).flat() : (parsed as GhRepo[])
  } catch (error) {
    console.warn('Fallback: listing public repos via gh repo list')
    const out = execSync(
      `gh repo list ${GITHUB_USER} --limit 100 --json name,description,url,homepageUrl,primaryLanguage,isPrivate,pushedAt`,
      { encoding: 'utf8' },
    )
    const list = JSON.parse(out) as Array<{
      name: string
      description: string
      url: string
      homepageUrl: string
      primaryLanguage: { name: string } | null
      isPrivate: boolean
      pushedAt: string
    }>
    return list.map((r) => ({
      name: r.name,
      description: r.description || null,
      html_url: r.url,
      homepage: r.homepageUrl || null,
      language: r.primaryLanguage?.name ?? null,
      private: r.isPrivate,
      pushed_at: r.pushedAt,
    }))
  }
}

async function uploadDefaultCover(
  payload: Awaited<ReturnType<typeof getPayload>>,
  alt: string,
) {
  const url = 'https://projet-refonte-portfolio-persov1-0.vercel.app/images/profil-picNb.png'
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch default cover: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name: 'profil-picNb.png',
      size: buffer.length,
    },
  })
}

async function upsertFromRepo(
  payload: Awaited<ReturnType<typeof getPayload>>,
  repo: GhRepo,
  order: number,
  defaultCoverId: number | string,
) {
  const existingSlug = REPO_TO_EXISTING_SLUG[repo.name]
  const slug = existingSlug ?? slugify(humanizeRepoName(repo.name))
  const title = humanizeRepoName(repo.name.replace(/-$/, ''))
  const excerpt = defaultDescription(repo).slice(0, 200)

  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = existing.docs[0]
  const cover = doc?.cover ?? defaultCoverId

  const data = {
    slug,
    excerpt: doc?.excerpt ?? excerpt,
    content: doc?.content ?? textToLexical(excerpt),
    cover,
    stack: mapStack(repo.language, []),
    liveUrl: repo.homepage || doc?.liveUrl || undefined,
    repoUrl: repo.html_url,
    featured: doc?.featured ?? false,
    order: doc?.order ?? order,
    status: 'published' as const,
  }

  if (doc) {
    await payload.update({ collection: 'projects', id: doc.id, data })
    console.log(`  ↻ ${slug} ← ${repo.name}${repo.private ? ' (privé)' : ''}`)
    return
  }

  await payload.create({
    collection: 'projects',
    data: { title, ...data },
  })
  console.log(`  + ${slug} ← ${repo.name}${repo.private ? ' (privé)' : ''}`)
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    throw new Error('DATABASE_URI and PAYLOAD_SECRET are required')
  }

  const repos = fetchGitHubRepos().sort(
    (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
  )

  const publicCount = repos.filter((r) => !r.private).length
  const privateCount = repos.filter((r) => r.private).length
  console.log(`GitHub @${GITHUB_USER}: ${repos.length} dépôts (${publicCount} publics, ${privateCount} privés)`)

  if (privateCount === 0 && !process.env.GITHUB_TOKEN) {
    console.warn(
      '⚠ Aucun dépôt privé détecté. Pour les inclure, ajoutez GITHUB_TOKEN (scope repo) dans .env.local.',
    )
  }

  const payload = await getPayload({ config })
  const defaultCover = await uploadDefaultCover(payload, 'Cover projet')

  let order = 100
  for (const repo of repos) {
    if (SKIP_REPO_NAMES.has(repo.name)) {
      console.log(`  ⊘ skip ${repo.name}`)
      continue
    }
    await upsertFromRepo(payload, repo, order++, defaultCover.id)
  }

  console.log('Sync GitHub → Payload terminée.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
