import { describe, expect, it } from 'vitest'

import { resolveCvOverrideUrl } from '@/lib/cv/resolve-cv-override-url'

describe('resolveCvOverrideUrl', () => {
  const siteUrl = 'http://localhost:3000'

  it('returns null for null input', () => {
    expect(resolveCvOverrideUrl(null, siteUrl)).toBeNull()
  })

  it('passes through https URLs', () => {
    const url = 'https://cdn.example.com/cv.pdf'
    expect(resolveCvOverrideUrl(url, siteUrl)).toBe(url)
  })

  it('passes through http URLs', () => {
    const url = 'http://cdn.example.com/cv.pdf'
    expect(resolveCvOverrideUrl(url, siteUrl)).toBe(url)
  })

  it('prefixes relative Payload media paths with siteUrl', () => {
    expect(resolveCvOverrideUrl('/api/media/file/cv.pdf', siteUrl)).toBe(
      'http://localhost:3000/api/media/file/cv.pdf',
    )
  })

  it('strips trailing slash from siteUrl before joining', () => {
    expect(resolveCvOverrideUrl('/api/media/file/cv.pdf', 'http://localhost:3000/')).toBe(
      'http://localhost:3000/api/media/file/cv.pdf',
    )
  })

  it('returns null for non-http relative paths without a leading slash', () => {
    expect(resolveCvOverrideUrl('api/media/file/cv.pdf', siteUrl)).toBeNull()
  })
})
