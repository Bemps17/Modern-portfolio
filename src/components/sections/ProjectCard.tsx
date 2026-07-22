'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Project } from '@/payload-types'
import { resolveProjectCoverUrl } from '@/lib/project-cover'
import { cn } from '@/lib/utils'

type ProjectCardProps = {
  project: Project
  large?: boolean
  enablePreview?: boolean
  showStack?: boolean
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
  enablePreview = false,
  showStack = true,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 260, damping: 22 })
  const springRotateY = useSpring(rotateY, { stiffness: 260, damping: 22 })
  const reduceMotion = useReducedMotion()
  const [glow, setGlow] = useState({ x: 50, y: 50 })
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null)

  const coverUrl = resolveProjectCoverUrl(project)
  const coverAlt =
    typeof project.cover === 'object' && project.cover?.alt ? project.cover.alt : project.title

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    rotateX.set((y - centerY) / 18)
    rotateY.set((centerX - x) / 18)
    setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
    if (enablePreview) setPreview({ x: event.clientX, y: event.clientY })
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setGlow({ x: 50, y: 50 })
    setPreview(null)
  }

  return (
    <motion.div
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      ref={ref}
      style={
        reduceMotion
          ? undefined
          : {
              perspective: 1000,
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformStyle: 'preserve-3d',
            }
      }
    >
      <GlassCard
        as="article"
        className="group relative overflow-hidden transition duration-300 hover:border-[color:var(--accent)]/40"
      >
        {!reduceMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(280px circle at ${glow.x}% ${glow.y}%, var(--accent-glow), transparent 70%)`,
            }}
          />
        ) : null}
        <Link className="relative block" data-cursor="view" href={`/projets/${project.slug}`}>
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
          <div className="space-y-3 p-5">
            <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">{project.title}</h3>
            <p className="line-clamp-2 text-sm text-[var(--muted)]">{project.excerpt}</p>
            {showStack && project.stack?.length ? (
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Badge key={item}>{STACK_LABELS[item] ?? item}</Badge>
                ))}
              </div>
            ) : null}
          </div>
        </Link>
      </GlassCard>
      {enablePreview && preview && coverUrl ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[60] hidden h-36 w-52 overflow-hidden rounded-xl border border-white/15 shadow-2xl lg:block"
          style={{ left: preview.x + 18, top: preview.y - 40 }}
        >
          <div className="relative h-full w-full">
            <Image alt="" className="object-cover" fill src={coverUrl} />
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
