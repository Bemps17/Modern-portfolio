// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { buildDraftFindOptions, resolvePreviewFetchMode } from '@/lib/draft-preview'

describe('draft-preview', () => {
  it('resolvePreviewFetchMode retourne draft quand preview actif', () => {
    expect(resolvePreviewFetchMode(true)).toEqual({ draft: true, overrideAccess: true })
  })

  it('resolvePreviewFetchMode retourne vide en mode public', () => {
    expect(resolvePreviewFetchMode(false)).toEqual({})
  })

  it('buildDraftFindOptions fusionne where avec mode preview', () => {
    const opts = buildDraftFindOptions(
      { slug: { equals: 'test' } },
      true,
    )
    expect(opts.draft).toBe(true)
    expect(opts.overrideAccess).toBe(true)
    expect(opts.where).toEqual({ slug: { equals: 'test' } })
  })
})
