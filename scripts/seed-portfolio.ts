import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import { portfolioFallback } from '../src/data/portfolio-fallback'
import { mimeFromExt, projectCoverPublicPath, resolveLocalCoverFile } from '../src/lib/project-cover-path'
import config from '../src/payload.config'

const REMOVED_PROJECT_SLUGS = ['portfolio-bemps-cms']

const LEGACY_SITE = 'https://projet-refonte-portfolio-persov1-0.vercel.app'

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

const STACK_MAP: Record<string, string> = {
  JavaScript: 'typescript',
  React: 'react',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  PostgreSQL: 'postgres',
  Postgres: 'postgres',
  Tailwind: 'tailwind',
  'Framer Motion': 'framer-motion',
  Vercel: 'vercel',
  Node: 'nodejs',
  Payload: 'payload',
  Neon: 'neon',
}

function mapStack(tags: string[]): string[] {
  const values = new Set<string>()
  for (const tag of tags) {
    for (const [key, value] of Object.entries(STACK_MAP)) {
      if (tag.toLowerCase().includes(key.toLowerCase())) values.add(value)
    }
  }
  return [...values]
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

async function uploadCoverRemote(
  payload: Awaited<ReturnType<typeof getPayload>>,
  imagePath: string,
  alt: string,
) {
  const url = imagePath.startsWith('http')
    ? imagePath
    : imagePath.startsWith('/projects/') || imagePath.startsWith('/images/')
      ? `http://127.0.0.1:3000${imagePath}`
      : `${LEGACY_SITE}${imagePath}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = new URL(url).pathname.split('/').pop()?.split('?')[0] || 'cover.jpg'

  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: response.headers.get('content-type') || mimeFromExt(filename),
      name: filename,
      size: buffer.length,
    },
  })
}

async function resolveCoverMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  title: string,
  remotePath: string,
) {
  const local = resolveLocalCoverFile(slug)
  if (local) return uploadCoverFile(payload, local.abs, title)
  return uploadCoverRemote(payload, remotePath, title)
}

async function upsertProject(
  payload: Awaited<ReturnType<typeof getPayload>>,
  project: (typeof portfolioFallback.projects)[number],
  index: number,
) {
  const coverUrl =
    typeof project.cover === 'object' && project.cover?.url ? project.cover.url : null
  const imagePath =
    coverUrl && !coverUrl.includes('profil-picNb')
      ? coverUrl.startsWith('http')
        ? coverUrl
        : new URL(coverUrl, 'http://local').pathname
      : project.slug === 'world-cup-scores-2026'
        ? 'https://world-cup2026-olive.vercel.app/icon.svg'
        : project.slug === 'bscl'
          ? 'https://bscl-project.vercel.app/favicon.ico'
          : projectCoverPublicPath(project.slug)

  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: project.slug } },
    limit: 1,
  })

  const coverMedia = await resolveCoverMedia(payload, project.slug, project.title, imagePath)
  const cover = coverMedia.id

  const excerpt = project.excerpt || project.title
  const existingDoc = existing.docs[0]
  const data = {
    title: project.title,
    slug: project.slug,
    excerpt,
    // Ne pas écraser un contenu CMS déjà distinct ; sinon body = excerpt (doublon UI)
    ...(existingDoc?.content
      ? {}
      : {
          content: textToLexical(
            `${excerpt}\n\nStack : ${mapStack((project.stack as string[] | null | undefined) || []).join(', ') || 'web'}.`,
          ),
        }),
    cover,
    stack: mapStack((project.stack as string[] | null | undefined) || []),
    liveUrl: project.liveUrl || undefined,
    repoUrl: project.repoUrl || undefined,
    featured: Boolean(project.featured),
    order: project.order ?? index,
    status: 'published' as const,
  }

  if (existingDoc) {
    await payload.update({
      collection: 'projects',
      id: existingDoc.id,
      data,
    })
    return
  }

  await payload.create({
    collection: 'projects',
    data: {
      ...data,
      content: textToLexical(
        `${excerpt}\n\nStack : ${mapStack((project.stack as string[] | null | undefined) || []).join(', ') || 'web'}.`,
      ),
    },
  })
}

async function upsertSkill(
  payload: Awaited<ReturnType<typeof getPayload>>,
  skill: (typeof portfolioFallback.skills)[number],
) {
  const existing = await payload.find({
    collection: 'skills',
    where: { name: { equals: skill.name } },
    limit: 1,
  })

  const data = {
    name: skill.name,
    category: skill.category,
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'skills',
      id: existing.docs[0].id,
      data,
    })
    return
  }

  await payload.create({
    collection: 'skills',
    data,
  })
}

async function upsertExperience(
  payload: Awaited<ReturnType<typeof getPayload>>,
  experience: (typeof portfolioFallback.experiences)[number],
) {
  // Match by title so company renames (ex. PAPREC → Sonotra/PAPREC) update in place.
  const existing = await payload.find({
    collection: 'experiences',
    where: { title: { equals: experience.title } },
    limit: 1,
  })

  const data = {
    title: experience.title,
    company: experience.company,
    dateStart: experience.dateStart,
    dateEnd: experience.dateEnd,
    current: experience.current,
    earlyCareer: Boolean(experience.earlyCareer),
    description: experience.description,
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'experiences',
      id: existing.docs[0].id,
      data,
    })
    return
  }

  await payload.create({
    collection: 'experiences',
    data,
  })
}

async function upsertQualification(
  payload: Awaited<ReturnType<typeof getPayload>>,
  qualification: (typeof portfolioFallback.qualifications)[number],
) {
  const existing = await payload.find({
    collection: 'qualifications',
    where: {
      and: [
        { title: { equals: qualification.title } },
        { year: { equals: qualification.year } },
      ],
    },
    limit: 1,
  })

  const data = {
    title: qualification.title,
    institution: qualification.institution,
    year: qualification.year,
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'qualifications',
      id: existing.docs[0].id,
      data,
    })
    return
  }

  await payload.create({
    collection: 'qualifications',
    data,
  })
}

async function seed() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    throw new Error('DATABASE_URI and PAYLOAD_SECRET are required')
  }

  const payload = await getPayload({ config })
  const { siteSettings, seoDefaults, projects, experiences, qualifications, skills } = portfolioFallback

  console.log('Seeding site settings…')
  const existingSettings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: siteSettings.siteName,
      tagline: siteSettings.tagline,
      aboutIntro: siteSettings.aboutIntro,
      aboutHeadline: siteSettings.aboutHeadline,
      aboutBody: siteSettings.aboutBody,
      skillsTitle: siteSettings.skillsTitle,
      skillsSubtitle: siteSettings.skillsSubtitle,
      location: siteSettings.location,
      availability: siteSettings.availability,
      availabilityLabel: siteSettings.availabilityLabel,
      approachSteps: siteSettings.approachSteps,
      whyMePoints: siteSettings.whyMePoints,
      skillGroups: siteSettings.skillGroups,
      personalProjects: siteSettings.personalProjects,
      email: siteSettings.email,
      phone: siteSettings.phone,
      cvJobTitle: siteSettings.cvJobTitle,
      cvPitch: siteSettings.cvPitch,
      mobility: siteSettings.mobility,
      interests: siteSettings.interests,
      rqthNote: siteSettings.rqthNote,
      showRqthOnCv: siteSettings.showRqthOnCv,
      languages: siteSettings.languages,
      cvCompetencies: siteSettings.cvCompetencies,
      socialLinks: siteSettings.socialLinks,
      // Ne jamais écraser l’avatar CMS (PictureProfile1, etc.)
      ...(existingSettings.avatar != null ? { avatar: existingSettings.avatar } : {}),
    },
  })

  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      defaultTitle: seoDefaults.defaultTitle,
      defaultDescription: seoDefaults.defaultDescription,
    },
  })

  console.log('Syncing skills…')
  for (const skill of skills) {
    await upsertSkill(payload, skill)
  }

  console.log('Syncing experiences…')
  for (const experience of experiences) {
    await upsertExperience(payload, experience)
  }

  // Retire les entrées agrégées / legacy remplacées par le fallback curaté
  const obsoleteCompanies = [
    'Telenet, DJM, Paritel, Berner…',
    'Logistique & événementiel',
    'PAPREC — La Rochelle',
    'Transports Hautié',
    'Sonotra / PAPREC La Rochelle — Groupe Hautier',
  ]
  for (const company of obsoleteCompanies) {
    const obsolete = await payload.find({
      collection: 'experiences',
      where: { company: { equals: company } },
      limit: 20,
    })
    for (const doc of obsolete.docs) {
      await payload.delete({ collection: 'experiences', id: doc.id })
      console.log(`Removed obsolete experience: ${doc.title} @ ${company}`)
    }
  }

  // Titres legacy hors canon (ex. « Assistant logistique » seul → fusion Sonotra/PAPREC)
  const obsoleteTitles = ['Assistant logistique']
  for (const title of obsoleteTitles) {
    const obsolete = await payload.find({
      collection: 'experiences',
      where: { title: { equals: title } },
      limit: 10,
    })
    for (const doc of obsolete.docs) {
      await payload.delete({ collection: 'experiences', id: doc.id })
      console.log(`Removed obsolete experience title: ${title}`)
    }
  }

  // Sécurité : toute expérience Sonotra/PAPREC encore taguée « Groupe Hautier »
  const mislabeled = await payload.find({
    collection: 'experiences',
    where: {
      and: [
        { company: { contains: 'Groupe Hautier' } },
        {
          or: [{ company: { contains: 'Sonotra' } }, { company: { contains: 'PAPREC' } }],
        },
      ],
    },
    limit: 20,
  })
  for (const doc of mislabeled.docs) {
    await payload.update({
      collection: 'experiences',
      id: doc.id,
      data: {
        company: 'Sonotra / PAPREC La Rochelle',
        description:
          typeof doc.description === 'string'
            ? doc.description.replace(/\s*\(?Groupe Hautier\)?/g, '').replace(/\s{2,}/g, ' ').trim()
            : doc.description,
      },
    })
    console.log(`Stripped Groupe Hautier from: ${doc.title}`)
  }

  console.log('Syncing qualifications…')
  for (const qualification of qualifications) {
    await upsertQualification(payload, qualification)
  }

  console.log('Syncing projects…')
  for (const slug of REMOVED_PROJECT_SLUGS) {
    const removed = await payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (removed.docs[0]) {
      await payload.delete({ collection: 'projects', id: removed.docs[0].id })
      console.log(`Removed project: ${slug}`)
    }
  }

  for (let index = 0; index < projects.length; index++) {
    await upsertProject(payload, projects[index], index)
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'bertrandwebdesigner@proton.me'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ModernPortfolio2026!'

  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (!existingAdmin.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    })
    console.log(`Admin created: ${adminEmail}`)
    console.log(`Temporary password: ${adminPassword}`)
  }

  console.log('Neon seed complete.')
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
