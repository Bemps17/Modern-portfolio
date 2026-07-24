import { describe, expect, it } from 'vitest'

import {
  buildCvShareUrl,
  buildLinkedInShareUrl,
  buildMailtoShareUrl,
  buildWhatsAppShareUrl,
} from '../../src/lib/cv/share-links'

describe('cv share links', () => {
  it('builds an absolute HTML CV url without double slashes', () => {
    expect(buildCvShareUrl('https://example.com/')).toBe('https://example.com/cv')
    expect(buildCvShareUrl('https://example.com')).toBe('https://example.com/cv')
  })

  it('builds mailto with subject and body containing the cv url', () => {
    const url = buildMailtoShareUrl('https://example.com/cv', 'Bertrand Fouquet')
    expect(url.startsWith('mailto:?')).toBe(true)
    expect(url).toContain(encodeURIComponent('CV — Bertrand Fouquet'))
    expect(url).toContain(encodeURIComponent('https://example.com/cv'))
  })

  it('builds WhatsApp share url', () => {
    const url = buildWhatsAppShareUrl('https://example.com/cv', 'Bertrand Fouquet')
    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    expect(decodeURIComponent(url)).toContain('https://example.com/cv')
    expect(decodeURIComponent(url)).toContain('Bertrand Fouquet')
  })

  it('builds LinkedIn share url', () => {
    expect(buildLinkedInShareUrl('https://example.com/cv')).toBe(
      'https://www.linkedin.com/sharing/share-offsite/?url=' +
        encodeURIComponent('https://example.com/cv'),
    )
  })
})
