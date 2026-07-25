import type { Project } from '@/payload-types'

import { resolveProjectCoverUrl } from '@/lib/project-cover'

export type AdjacentProject = {
  slug: string
  title: string
  coverUrl: string | null
}

type RelatedRef = number | { id: number }

function relatedId(ref: RelatedRef): number | null {
  if (typeof ref === 'number') return ref
  if (ref && typeof ref === 'object' && typeof ref.id === 'number') return ref.id
  return null
}

type RelatedProjectSource = Pick<Project, 'id' | 'slug'> & {
  relatedProjects?: (RelatedRef | Project)[] | null
}

type PublishedProjectLookup = Pick<Project, 'id' | 'slug' | 'title'> & {
  cover?: Project['cover']
  status?: Project['status'] | null
}

/** Projets liés publiés, dans l’ordre défini en CMS (brouillons exclus). */
export function resolveRelatedProjects(
  current: RelatedProjectSource,
  allPublished: PublishedProjectLookup[],
): AdjacentProject[] {
  const refs = current.relatedProjects
  if (!refs?.length) return []

  const byId = new Map(
    allPublished
      .filter((project) => project.status == null || project.status === 'published')
      .map((project) => [project.id, project]),
  )
  const related: AdjacentProject[] = []

  for (const ref of refs) {
    const id = relatedId(ref as RelatedRef)
    if (id == null || id === current.id) continue

    const project = byId.get(id)
    if (!project) continue

    related.push({
      slug: project.slug,
      title: project.title,
      coverUrl: resolveProjectCoverUrl(project as Pick<Project, 'slug' | 'cover'>),
    })
  }

  return related
}
