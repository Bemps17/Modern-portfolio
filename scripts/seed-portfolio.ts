import 'dotenv/config'

import { getPayload } from 'payload'

import { portfolioFallback } from '../src/data/portfolio-fallback'
import config from '../src/payload.config'

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
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
    },
  }
}

const STACK_MAP: Record<string, string> = {
  JavaScript: 'typescript',
  React: 'react',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  PostgreSQL: 'postgres',
  Tailwind: 'tailwind',
  Vercel: 'vercel',
  Node: 'nodejs',
  Payload: 'payload',
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

async function uploadCover(payload: Awaited<ReturnType<typeof getPayload>>, path: string | null, alt: string) {
  const imagePath = path || '/images/profil-picNb.png'
  const url = `${LEGACY_SITE}${imagePath}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = imagePath.split('/').pop() || 'cover.jpg'

  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: response.headers.get('content-type') || 'image/jpeg',
      name: filename,
      size: buffer.length,
    },
  })
}

async function seed() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    throw new Error('DATABASE_URI and PAYLOAD_SECRET are required')
  }

  const payload = await getPayload({ config })
  const { siteSettings, seoDefaults, projects, experiences, skills } = portfolioFallback

  const existingProjects = await payload.find({ collection: 'projects', limit: 1 })
  if (existingProjects.totalDocs > 0) {
    console.log('Portfolio already seeded — skipping.')
    return
  }

  console.log('Seeding site settings…')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: siteSettings.siteName,
      tagline: siteSettings.tagline,
      aboutIntro: siteSettings.aboutIntro,
      email: siteSettings.email,
      socialLinks: siteSettings.socialLinks,
    },
  })

  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      defaultTitle: seoDefaults.defaultTitle,
      defaultDescription: seoDefaults.defaultDescription,
    },
  })

  console.log('Seeding skills…')
  for (const skill of skills) {
    await payload.create({
      collection: 'skills',
      data: {
        name: skill.name,
        category: skill.category,
      },
    })
  }

  console.log('Seeding experiences…')
  for (const experience of experiences) {
    await payload.create({
      collection: 'experiences',
      data: {
        title: experience.title,
        company: experience.company,
        dateStart: experience.dateStart,
        dateEnd: experience.dateEnd,
        current: experience.current,
        description: experience.description,
      },
    })
  }

  console.log('Seeding projects…')
  for (let index = 0; index < projects.length; index++) {
    const project = projects[index]
    const coverUrl =
      typeof project.cover === 'object' && project.cover?.url ? project.cover.url : null
    const imagePath = coverUrl ? new URL(coverUrl).pathname : `/projects/${project.slug}-cover.jpg`

    const cover = await uploadCover(payload, imagePath, project.title)
    const excerpt = project.excerpt || project.title

    await payload.create({
      collection: 'projects',
      data: {
        title: project.title,
        slug: project.slug,
        excerpt,
        content: textToLexical(excerpt),
        cover: cover.id,
        stack: mapStack((project.stack as string[] | null | undefined) || []),
        liveUrl: project.liveUrl || undefined,
        repoUrl: project.repoUrl || undefined,
        featured: Boolean(project.featured),
        order: project.order ?? index,
        status: 'published',
      },
    })
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
