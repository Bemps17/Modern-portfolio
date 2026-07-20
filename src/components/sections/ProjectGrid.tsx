'use client'

import { useMemo, useState } from 'react'

import { ProjectCard } from '@/components/sections/ProjectCard'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/payload-types'
import { cn } from '@/lib/utils'

type ProjectGridProps = {
  projects: Project[]
  enableFilters?: boolean
}

export function ProjectGrid({ projects, enableFilters = false }: ProjectGridProps) {
  const [active, setActive] = useState<string | null>(null)

  const tags = useMemo(() => {
    const set = new Set<string>()
    for (const project of projects) {
      for (const item of project.stack ?? []) set.add(item)
    }
    return [...set].sort()
  }, [projects])

  const filtered = active
    ? projects.filter((project) => project.stack?.includes(active as NonNullable<Project['stack']>[number]))
    : projects

  if (!projects.length) {
    return <p className="text-[var(--muted)]">Aucun projet publié pour le moment.</p>
  }

  return (
    <div className="space-y-8">
      {enableFilters && tags.length ? (
        <div className="flex flex-wrap gap-2">
          <button
            className={cn(!active && 'ring-1 ring-cyan-300/50')}
            onClick={() => setActive(null)}
            type="button"
          >
            <Badge className={!active ? 'text-cyan-200' : undefined}>Tous</Badge>
          </button>
          {tags.map((tag) => (
            <button
              className={cn(active === tag && 'ring-1 ring-cyan-300/50')}
              key={tag}
              onClick={() => setActive(tag)}
              type="button"
            >
              <Badge className={active === tag ? 'text-cyan-200' : undefined}>{tag}</Badge>
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
