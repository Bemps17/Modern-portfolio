// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { resolveDocumentSeo } from '@/lib/seo-document'

describe('seo-document', () => {
  it('priorise meta.title du plugin SEO', () => {
    const result = resolveDocumentSeo({
      docTitle: 'Titre CMS',
      docExcerpt: 'Excerpt CMS',
      meta: { title: 'Titre SEO custom', description: 'Desc SEO' },
      path: '/projets/demo',
    })
    expect(result.title).toBe('Titre SEO custom')
    expect(result.description).toBe('Desc SEO')
  })

  it('fallback sur title/excerpt si meta absent', () => {
    const result = resolveDocumentSeo({
      docTitle: 'Mon projet',
      docExcerpt: 'Résumé court du projet.',
      path: '/projets/mon-projet',
    })
    expect(result.title).toBe('Mon projet')
    expect(result.description).toBe('Résumé court du projet.')
  })

  it('canonical et noIndex depuis meta', () => {
    const result = resolveDocumentSeo({
      docTitle: 'Draft',
      docExcerpt: 'Draft excerpt',
      meta: { noIndex: true, canonicalURL: 'https://example.com/custom' },
      path: '/projets/draft',
    })
    expect(result.noIndex).toBe(true)
    expect(result.canonicalUrl).toBe('https://example.com/custom')
  })
})
