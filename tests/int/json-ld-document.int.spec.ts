import { describe, expect, it } from 'vitest'
import { articleJsonLd, projectJsonLd } from '@/lib/json-ld'

describe('articleJsonLd', () => {
  it('émet un schema.org Article avec headline et dates', () => {
    const data = articleJsonLd({
      headline: 'Mon article',
      description: 'Résumé',
      url: 'https://example.com/carnet/mon-article',
      datePublished: '2026-01-15T10:00:00.000Z',
      dateModified: '2026-01-16T12:00:00.000Z',
      authorName: 'Bertrand',
      image: 'https://example.com/cover.jpg',
    })
    expect(data['@type']).toBe('Article')
    expect(data.headline).toBe('Mon article')
    expect(data.datePublished).toBe('2026-01-15T10:00:00.000Z')
    expect(data.author).toEqual({ '@type': 'Person', name: 'Bertrand' })
  })
})

describe('projectJsonLd', () => {
  it('émet CreativeWork avec keywords depuis tags', () => {
    const data = projectJsonLd({
      name: 'Portfolio',
      description: 'CMS portfolio',
      url: 'https://example.com/projets/portfolio',
      keywords: ['Next.js', 'Payload'],
    })
    expect(data['@type']).toBe('CreativeWork')
    expect(data.keywords).toBe('Next.js, Payload')
  })
})
