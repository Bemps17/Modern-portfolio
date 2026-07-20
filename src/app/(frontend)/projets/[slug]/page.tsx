import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { RichTextRenderer } from '@/components/sections/RichTextRenderer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { getProjectBySlug, getProjectSlugs } from '@/lib/content'
import type { Media, Project } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

const STACK_LABELS: Record<string, string> = {
  nextjs: 'Next.js',
  react: 'React',
  typescript: 'TypeScript',
  payload: 'Payload CMS',
  nodejs: 'Node.js',
  postgres: 'PostgreSQL',
  tailwind: 'Tailwind CSS',
  'framer-motion': 'Framer Motion',
  vercel: 'Vercel',
  neon: 'Neon',
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Projet' }

  const cover = typeof project.cover === 'object' ? (project.cover as Media) : null

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: cover?.url ? [{ url: cover.url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.excerpt,
      images: cover?.url ? [cover.url] : undefined,
    },
  }
}

export default async function ProjetDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const cover = typeof project.cover === 'object' ? (project.cover as Media) : null
  const stackItems = (project.stack || []) as NonNullable<Project['stack']>
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt,
    url: project.liveUrl || undefined,
  }

  return (
    <Container className="py-16">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <div className="mb-10 max-w-3xl">
        <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{project.excerpt}</p>
        {stackItems.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {stackItems.map((item) => (
              <Badge key={item}>{STACK_LABELS[item] ?? item}</Badge>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <Button href={project.liveUrl} variant="primary">
              Voir le site
            </Button>
          ) : null}
          {project.repoUrl ? (
            <Button href={project.repoUrl} variant="glass">
              Code source
            </Button>
          ) : null}
        </div>
      </div>

      {cover?.url ? (
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
          <Image
            alt={cover.alt || project.title}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={cover.url}
          />
        </div>
      ) : null}

      {project.content ? (
        <div className="prose prose-invert max-w-3xl">
          <RichTextRenderer data={project.content} />
        </div>
      ) : null}

      {project.gallery?.length ? (
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {project.gallery.map((item, index) => {
            const image = typeof item.image === 'object' ? (item.image as Media) : null
            if (!image?.url) return null
            return (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10" key={index}>
                <Image alt={image.alt || `${project.title} ${index + 1}`} className="object-cover" fill src={image.url} />
              </div>
            )
          })}
        </div>
      ) : null}
    </Container>
  )
}
