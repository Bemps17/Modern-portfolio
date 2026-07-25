// @vitest-environment node
import { describe, expect, it } from 'vitest'

import type { Media } from '@/payload-types'
import { resolveJournalCoverUrl } from '@/lib/journal-cover'

describe('resolveJournalCoverUrl', () => {
  it('utilise la cover statique commitée pour un slug Lablog', () => {
    expect(resolveJournalCoverUrl(null, 'agents-ia-autonomes-2026')).toBe(
      '/carnet/agents-ia-autonomes-2026-cover.webp',
    )
  })

  it('ignore l’URL CMS pour un slug Lablog (fichiers absents sur Vercel)', () => {
    const cmsCover = {
      id: 1,
      url: '/api/media/file/agents-ia-autonomes-2026-cover-1.webp',
      alt: 'CMS',
      updatedAt: '',
      createdAt: '',
    } satisfies Media

    expect(resolveJournalCoverUrl(cmsCover, 'agents-ia-autonomes-2026')).toBe(
      '/carnet/agents-ia-autonomes-2026-cover.webp',
    )
  })

  it('retourne l’URL CMS pour un slug hors catalogue Lablog', () => {
    const cmsCover = {
      id: 2,
      url: '/api/media/file/custom-cover.webp',
      alt: 'Custom',
      updatedAt: '',
      createdAt: '',
    } satisfies Media

    expect(resolveJournalCoverUrl(cmsCover, 'autre-slug')).toBe('/api/media/file/custom-cover.webp')
  })
})
