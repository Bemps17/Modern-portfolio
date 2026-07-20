import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Media, Project } from '@/payload-types'

type ProjectCardProps = {
  project: Project
}

function mediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
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

export function ProjectCard({ project }: ProjectCardProps) {
  const coverUrl = mediaUrl(project.cover)
  const coverAlt =
    typeof project.cover === 'object' && project.cover?.alt ? project.cover.alt : project.title

  return (
    <GlassCard as="article" className="group overflow-hidden transition duration-300 hover:scale-[1.01] hover:border-cyan-300/30">
      <Link className="block" href={`/projets/${project.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
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
        <div className="space-y-3 p-5">
          <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">{project.title}</h3>
          <p className="line-clamp-2 text-sm text-[var(--muted)]">{project.excerpt}</p>
          {project.stack?.length ? (
            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <Badge key={item}>{STACK_LABELS[item] ?? item}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </GlassCard>
  )
}
