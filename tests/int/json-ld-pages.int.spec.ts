// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { buildArticleJsonLdFromDoc, buildProjectJsonLdFromDoc } from '@/lib/json-ld-document'

describe('buildProjectJsonLdFromDoc', () => {
  it('priorise meta SEO title sur title document', () => {
    const data = buildProjectJsonLdFromDoc({
      project: {
        title: 'Titre CMS',
        slug: 'foo',
        excerpt: 'Excerpt',
        createdAt: '2026-01-01',
        stack: ['nextjs'],
        meta: { title: 'Titre SEO' },
      },
      siteUrl: 'https://example.com',
      authorName: 'Dev',
      coverUrl: null,
      tagNames: ['Next.js'],
    })
    expect(data.name).toBe('Titre SEO')
  })

  it('fusionne tagNames et stack en keywords', () => {
    const data = buildProjectJsonLdFromDoc({
      project: {
        title: 'Projet',
        slug: 'foo',
        excerpt: 'Excerpt',
        createdAt: '2026-01-01',
        stack: ['nextjs', 'payload'],
      },
      siteUrl: 'https://example.com',
      tagNames: ['Design'],
    })
    expect(data.keywords).toBe('Design, Next.js, Payload CMS')
  })
})

describe('buildArticleJsonLdFromDoc', () => {
  it('priorise meta SEO title sur title document', () => {
    const data = buildArticleJsonLdFromDoc({
      post: {
        title: 'Titre CMS',
        slug: 'mon-article',
        excerpt: 'Excerpt',
        publishedAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-16T12:00:00.000Z',
        meta: { title: 'Titre SEO article' },
      },
      siteUrl: 'https://example.com',
      authorName: 'Dev',
      coverUrl: 'https://example.com/cover.jpg',
    })
    expect(data.headline).toBe('Titre SEO article')
    expect(data['@type']).toBe('Article')
    expect(data.url).toBe('https://example.com/carnet/mon-article')
  })
})
