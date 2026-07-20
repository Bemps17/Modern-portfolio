'use client'

import Image from 'next/image'
import Link from 'next/link'

import { RichTextRenderer } from '@/components/sections/RichTextRenderer'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { estimateReadingTime } from '@/lib/reading-time'
import type { Media, Project } from '@/payload-types'

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

type AdjacentProject = {
  slug: string
  title: string
  coverUrl: string | null
}

type ProjectDetailViewProps = {
  project: Project
  prevProject: AdjacentProject | null
  nextProject: AdjacentProject | null
}

function coverUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export function ProjectDetailView({ project, prevProject, nextProject }: ProjectDetailViewProps) {
  const cover = typeof project.cover === 'object' ? (project.cover as Media) : null
  const stackItems = (project.stack || []) as NonNullable<Project['stack']>
  const readingMinutes = estimateReadingTime(project)

  return (
    <>
      <ScrollProgress />
      <div className="px-6 py-12 lg:px-10 xl:px-16">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <Link className="transition hover:text-[var(--accent-soft)]" data-cursor="link" href="/projets">
            ← Projets
          </Link>
          <span aria-hidden>·</span>
          <span>{readingMinutes} min de lecture</span>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            {cover?.url ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:aspect-[3/4]">
                <Image
                  alt={cover.alt || project.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  src={cover.url}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-10 lg:mt-0">
            <EditorialTitle as="h1" bleed className="mb-4" text={project.title} />
            <p className="text-lg text-[var(--muted)]">{project.excerpt}</p>

            {stackItems.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {stackItems.map((item) => (
                  <Badge key={item}>{STACK_LABELS[item] ?? item}</Badge>
                ))}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveUrl ? <Button href={project.liveUrl}>Voir le site</Button> : null}
              {project.repoUrl ? (
                <Button href={project.repoUrl} variant="glass">
                  Code source
                </Button>
              ) : null}
            </div>

            {project.content ? (
              <div className="prose prose-invert mt-10 max-w-none">
                <RichTextRenderer data={project.content} />
              </div>
            ) : null}

            {project.gallery?.length ? (
              <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
                {project.gallery.map((item, index) => {
                  const image = typeof item.image === 'object' ? (item.image as Media) : null
                  if (!image?.url) return null
                  return (
                    <div
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                      key={index}
                    >
                      <Image
                        alt={image.alt || `${project.title} ${index + 1}`}
                        className="object-cover"
                        fill
                        src={image.url}
                      />
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        <nav
          aria-label="Navigation entre projets"
          className="mt-20 grid gap-4 border-t border-white/10 pt-10 md:grid-cols-2"
        >
          {prevProject ? (
            <Link
              className="group rounded-2xl border border-white/10 p-4 transition hover:border-[color:var(--accent)]/35"
              data-cursor="view"
              href={`/projets/${prevProject.slug}`}
            >
              <p className="text-xs tracking-[0.18em] text-[var(--muted)] uppercase">Projet précédent</p>
              <p className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold group-hover:text-[var(--accent-soft)]">
                {prevProject.title}
              </p>
              {prevProject.coverUrl ? (
                <div className="relative mt-4 aspect-[16/7] overflow-hidden rounded-xl">
                  <Image alt="" className="object-cover" fill src={prevProject.coverUrl} />
                </div>
              ) : null}
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              className="group rounded-2xl border border-white/10 p-4 text-right transition hover:border-[color:var(--accent)]/35 md:col-start-2"
              data-cursor="view"
              href={`/projets/${nextProject.slug}`}
            >
              <p className="text-xs tracking-[0.18em] text-[var(--muted)] uppercase">Projet suivant</p>
              <p className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold group-hover:text-[var(--accent-soft)]">
                {nextProject.title}
              </p>
              {nextProject.coverUrl ? (
                <div className="relative mt-4 aspect-[16/7] overflow-hidden rounded-xl">
                  <Image alt="" className="object-cover" fill src={nextProject.coverUrl} />
                </div>
              ) : null}
            </Link>
          ) : null}
        </nav>
      </div>
    </>
  )
}
