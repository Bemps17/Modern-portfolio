'use client'

import Image from 'next/image'
import Link from 'next/link'

import { SectionTitle } from '@/components/ui/SectionTitle'
import type { AdjacentProject } from '@/lib/related-projects'
import { cn } from '@/lib/utils'

type RelatedProjectsProps = {
  projects: AdjacentProject[]
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (!projects.length) return null

  return (
    <section aria-labelledby="related-projects-heading" className="mt-20 border-t border-white/10 pt-10">
      <div id="related-projects-heading">
        <SectionTitle editorial title="Voir aussi" />
      </div>
      <div
        className={cn(
          'grid gap-4',
          projects.length === 1 && 'grid-cols-1',
          projects.length === 2 && 'grid-cols-1 md:grid-cols-2',
          projects.length >= 3 && 'grid-cols-1 md:grid-cols-3',
        )}
      >
        {projects.map((project) => (
          <Link
            className="group overflow-hidden rounded-2xl border border-white/10 transition hover:border-[color:var(--accent)]/35"
            data-cursor="view"
            href={`/projets/${project.slug}`}
            key={project.slug}
          >
            {project.coverUrl ? (
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  alt=""
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src={project.coverUrl}
                />
              </div>
            ) : null}
            <p className="p-4 font-[family-name:var(--font-syne)] text-lg font-semibold group-hover:text-[var(--accent-soft)]">
              {project.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
