'use client'

import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Project } from '@/payload-types'
import { resolveProjectCoverUrl } from '@/lib/project-cover'
import { isDuplicateCopy } from '@/lib/text-dedupe'
import { cn } from '@/lib/utils'

type ProjectCardProps = {
  project: Project
  large?: boolean
  showStack?: boolean
  /** Index 1-based pour le style « 01 — Titre ». */
  index?: number
  maxStack?: number
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

export function ProjectCard({
  project,
  large = false,
  showStack = true,
  index,
  maxStack = 4,
}: ProjectCardProps) {
  const coverUrl = resolveProjectCoverUrl(project)
  const coverAlt =
    typeof project.cover === 'object' && project.cover?.alt ? project.cover.alt : project.title
  const stack = (project.stack ?? []).slice(0, maxStack)
  const excerpt = typeof project.excerpt === 'string' ? project.excerpt.trim() : ''
  const impactRaw = typeof project.impact === 'string' ? project.impact.trim() : ''
  const impact = impactRaw && !isDuplicateCopy(impactRaw, excerpt) ? impactRaw : null

  return (
    <GlassCard
      as="article"
      className="group relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <Link className="relative block" href={`/projets/${project.slug}`}>
        <div
          className={cn(
            'relative overflow-hidden bg-white/5',
            large ? 'aspect-[16/11] min-h-[280px]' : 'aspect-[16/10]',
          )}
        >
          {coverUrl ? (
            <Image
              alt={coverAlt}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={coverUrl}
            />
          ) : null}
        </div>
        <div className="space-y-2 p-5 pb-2">
          <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
            {typeof index === 'number' ? (
              <span className="mr-2 font-[family-name:var(--font-space-grotesk)] text-sm text-[var(--accent-soft)]">
                {String(index).padStart(2, '0')} —
              </span>
            ) : null}
            {project.title}
          </h3>
          {excerpt ? (
            <p className="line-clamp-2 text-sm text-[var(--foreground-secondary)]">{excerpt}</p>
          ) : null}
          {impact ? (
            <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--accent-soft)]">
              {impact}
            </p>
          ) : null}
        </div>
      </Link>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 px-5 pb-5">
        {showStack && stack.length ? (
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <Badge key={item}>{STACK_LABELS[item] ?? item}</Badge>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex gap-1.5">
          {project.liveUrl ? (
            <a
              aria-label={`Demo live — ${project.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[var(--muted)] transition hover:border-[color:var(--accent)]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              href={project.liveUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              aria-label={`Code source — ${project.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[var(--muted)] transition hover:border-[color:var(--accent)]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              href={project.repoUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github aria-hidden className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </GlassCard>
  )
}
