// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { filterJournalPostsByTagSlug } from '@/lib/journal-tags'
import type { JournalPost, Tag } from '@/payload-types'

function postWithTags(slug: string, tags: Array<{ slug: string } | number>): JournalPost {
  return {
    id: 1,
    slug,
    title: slug,
    excerpt: 'Excerpt',
    category: 'ia',
    postType: 'article',
    publishedAt: '2026-01-01T00:00:00.000Z',
    status: 'published',
    order: 0,
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    cover: 1,
    tags: tags as JournalPost['tags'],
  }
}

describe('journal-tags', () => {
  it('retourne tous les posts sans filtre tag', () => {
    const posts = [postWithTags('a', []), postWithTags('b', [{ slug: 'ia' } as Tag])]
    expect(filterJournalPostsByTagSlug(posts)).toHaveLength(2)
    expect(filterJournalPostsByTagSlug(posts, undefined)).toHaveLength(2)
  })

  it('filtre par slug de tag', () => {
    const posts = [
      postWithTags('a', [{ slug: 'ia', id: 1, name: 'IA' } as Tag]),
      postWithTags('b', [{ slug: 'design', id: 2, name: 'Design' } as Tag]),
    ]
    expect(filterJournalPostsByTagSlug(posts, 'ia').map((p) => p.slug)).toEqual(['a'])
  })
})
