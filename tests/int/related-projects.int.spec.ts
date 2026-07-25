// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { resolveRelatedProjects } from '@/lib/related-projects'

describe('related-projects', () => {
  it('retourne les projets liés publiés dans l ordre CMS', () => {
    const all = [
      { id: 1, slug: 'a', title: 'A', status: 'published' as const },
      { id: 2, slug: 'b', title: 'B', status: 'published' as const },
      { id: 3, slug: 'c', title: 'C', status: 'draft' as const },
    ]
    const current = { id: 1, slug: 'a', relatedProjects: [3, 2] }
    const related = resolveRelatedProjects(current, all)
    expect(related.map((p) => p.slug)).toEqual(['b'])
  })
})
