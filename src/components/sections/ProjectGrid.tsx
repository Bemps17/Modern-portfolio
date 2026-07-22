'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Breathing } from '@/components/motion/Breathing'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Project } from '@/payload-types'
import { cn } from '@/lib/utils'

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

type ProjectGridProps = {
  projects: Project[]
  enableFilters?: boolean
  breatheFeatured?: boolean
  layoutMode?: 'grid' | 'masonry'
  enablePreview?: boolean
  showStackChips?: boolean
  /** Affiche « 01 — » sur les cartes. */
  showIndex?: boolean
  /** Limite le nombre de projets affichés (accueil). */
  limit?: number
}

function masonryClass(project: Project, index: number): string {
  if (project.featured && index === 0) return 'md:col-span-2 xl:col-span-8 xl:row-span-2'
  if (project.featured && index === 1) return 'xl:col-span-4 xl:row-span-2'
  return 'md:col-span-1 xl:col-span-4'
}

export function ProjectGrid({
  projects,
  enableFilters = false,
  breatheFeatured = false,
  layoutMode = 'grid',
  enablePreview = false,
  showStackChips = true,
  showIndex = false,
  limit,
}: ProjectGridProps) {
  const [active, setActive] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const source = typeof limit === 'number' ? projects.slice(0, limit) : projects

  const tags = useMemo(() => {
    const set = new Set<string>()
    for (const project of source) {
      for (const item of project.stack ?? []) set.add(item)
    }
    return [...set].sort()
  }, [source])

  const filtered = active
    ? source.filter((project) => project.stack?.includes(active as NonNullable<Project['stack']>[number]))
    : source

  if (!source.length) {
    return <p className="text-[var(--muted)]">Aucun projet publié pour le moment.</p>
  }

  const activeLabel = active ? (STACK_LABELS[active] ?? active) : null

  return (
    <div className="space-y-8">
      {enableFilters && tags.length ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {!filtersOpen ? (
              <Button
                className="gap-2"
                onClick={() => setFiltersOpen(true)}
                type="button"
                variant="glass"
              >
                <SlidersHorizontal aria-hidden className="size-4" />
                Filtrer par stack
                {activeLabel ? (
                  <Badge className="bg-[var(--accent)]/15 text-[var(--accent-soft)]">{activeLabel}</Badge>
                ) : null}
              </Button>
            ) : (
              <Button
                className="gap-2"
                onClick={() => setFiltersOpen(false)}
                type="button"
                variant="ghost"
              >
                <X aria-hidden className="size-4" />
                Masquer les filtres
              </Button>
            )}
            {active && !filtersOpen ? (
              <button
                className="text-sm text-[var(--muted)] underline-offset-4 hover:text-white hover:underline"
                data-cursor="link"
                onClick={() => setActive(null)}
                type="button"
              >
                Réinitialiser
              </button>
            ) : null}
          </div>
          <AnimatePresence initial={false}>
            {filtersOpen ? (
              <motion.div
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 overflow-hidden"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    className={cn(
                      !active && 'ring-1 ring-[color:var(--accent)]/60 shadow-[0_0_20px_var(--accent-glow)]',
                    )}
                    data-cursor="link"
                    onClick={() => setActive(null)}
                    type="button"
                  >
                    <Badge className={!active ? 'bg-[var(--accent)]/15 text-[var(--accent-soft)]' : undefined}>
                      Tous
                    </Badge>
                  </button>
                  {tags.map((tag) => (
                    <button
                      className={cn(
                        active === tag &&
                          'ring-1 ring-[color:var(--accent)]/60 shadow-[0_0_20px_var(--accent-glow)]',
                      )}
                      data-cursor="link"
                      key={tag}
                      onClick={() => setActive(tag)}
                      type="button"
                    >
                      <Badge
                        className={
                          active === tag ? 'bg-[var(--accent)]/15 text-[var(--accent-soft)]' : undefined
                        }
                      >
                        {STACK_LABELS[tag] ?? tag}
                      </Badge>
                    </button>
                  ))}
                </div>
                <p className="font-[family-name:var(--font-space-grotesk)] text-sm text-[var(--muted)]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      animate={{ opacity: 1, y: 0 }}
                      className="mr-2 inline-block font-bold text-[var(--accent-soft)]"
                      exit={{ opacity: 0, y: -6 }}
                      initial={{ opacity: 0, y: 6 }}
                      key={filtered.length}
                      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                    >
                      {filtered.length}
                    </motion.span>
                  </AnimatePresence>
                  projet{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
      <StaggerChildren
        className={cn(
          layoutMode === 'masonry'
            ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12 xl:auto-rows-[minmax(220px,auto)]'
            : 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
        )}
        stagger={0.1}
      >
        {filtered.map((project, index) => {
          const large = layoutMode === 'masonry' && !!project.featured && index < 2
          const card = (
            <ProjectCard
              enablePreview={enablePreview}
              index={showIndex ? index + 1 : undefined}
              large={large}
              project={project}
              showStack={showStackChips}
            />
          )
          const content =
            breatheFeatured && index === 0 ? <Breathing>{card}</Breathing> : card

          return (
            <StaggerItem
              className={layoutMode === 'masonry' ? masonryClass(project, index) : undefined}
              key={project.id}
            >
              {content}
            </StaggerItem>
          )
        })}
      </StaggerChildren>
    </div>
  )
}
