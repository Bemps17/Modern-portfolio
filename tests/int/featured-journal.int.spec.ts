// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { resolveFeaturedJournalPosts } from '@/lib/featured-journal'

describe('featured-journal', () => {
  it('filtre brouillons et limite à 3', () => {
    const posts = [
      { id: 1, slug: 'a', status: 'published' as const },
      { id: 2, slug: 'b', status: 'draft' as const },
      { id: 3, slug: 'c', status: 'published' as const },
      { id: 4, slug: 'd', status: 'published' as const },
      { id: 5, slug: 'e', status: 'published' as const },
      { id: 6, slug: 'f', status: 'published' as const },
    ]
    const picked = resolveFeaturedJournalPosts([1, 2, 3, 4, 5, 6], posts)
    expect(picked.map((p) => p.slug)).toEqual(['a', 'c', 'd'])
  })

  it('conserve l ordre défini en CMS', () => {
    const posts = [
      { id: 1, slug: 'a', status: 'published' as const },
      { id: 2, slug: 'b', status: 'published' as const },
      { id: 3, slug: 'c', status: 'published' as const },
    ]
    const picked = resolveFeaturedJournalPosts([3, 1], posts)
    expect(picked.map((p) => p.slug)).toEqual(['c', 'a'])
  })

  it('ignore les IDs absents ou non publiés', () => {
    const posts = [{ id: 1, slug: 'a', status: 'published' as const }]
    const picked = resolveFeaturedJournalPosts([99, 1, 2], posts)
    expect(picked.map((p) => p.slug)).toEqual(['a'])
  })
})
