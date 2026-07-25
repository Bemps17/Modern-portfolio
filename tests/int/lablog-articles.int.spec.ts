// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { buildLablogFallbackPosts } from '@/data/lablog-fallback'
import { LABLOG_ARTICLES } from '@/data/lablog-articles'
import { blocksToLexical } from '@/lib/lexical-content'

describe('Lablog — 12 articles tech', () => {
  it('expose exactement 12 articles seed', () => {
    expect(LABLOG_ARTICLES).toHaveLength(12)
  })

  it('a des slugs uniques', () => {
    const slugs = LABLOG_ARTICLES.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('chaque article a intro, sections H2 et contenu Lexical valide', () => {
    for (const article of LABLOG_ARTICLES) {
      expect(article.title.length).toBeGreaterThan(10)
      expect(article.excerpt.length).toBeGreaterThan(20)
      expect(article.blocks.length).toBeGreaterThanOrEqual(8)

      const h2Count = article.blocks.filter((b) => b.type === 'h2').length
      expect(h2Count).toBeGreaterThanOrEqual(2)

      const lexical = blocksToLexical([...article.blocks])
      expect(lexical.root.children.length).toBe(article.blocks.length)
      expect(lexical.root.type).toBe('root')
    }
  })

  it('fallback démo produit 12 posts article publiés', () => {
    const posts = buildLablogFallbackPosts()
    expect(posts).toHaveLength(12)
    expect(posts.every((p) => p.postType === 'article' && p.status === 'published')).toBe(true)
    expect(posts.every((p) => p.cover && typeof p.cover === 'object')).toBe(true)
  })
})
