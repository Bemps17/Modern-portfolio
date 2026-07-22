import { describe, expect, it } from 'vitest'

import { isMedia, resolveMediaUrl } from '@/lib/media'

describe('resolveMediaUrl / isMedia', () => {
  it('rejects non-populated relation ids', () => {
    expect(isMedia(56)).toBe(false)
    expect(resolveMediaUrl(56)).toBeNull()
    expect(resolveMediaUrl(null)).toBeNull()
    expect(resolveMediaUrl(undefined)).toBeNull()
  })

  it('accepts a populated Media-like object with url', () => {
    const media = {
      id: 1,
      url: '/api/media/file/avatar.png',
      alt: 'Portrait',
      updatedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
    }
    expect(isMedia(media)).toBe(true)
    expect(resolveMediaUrl(media)).toBe('/api/media/file/avatar.png')
  })

  it('returns null when populated object has empty url', () => {
    expect(resolveMediaUrl({ id: 1, url: null })).toBeNull()
    expect(resolveMediaUrl({ id: 1, url: undefined })).toBeNull()
  })
})
