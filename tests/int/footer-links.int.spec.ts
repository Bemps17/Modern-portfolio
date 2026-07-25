// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { DEFAULT_FOOTER_LINKS, resolveFooterLinks } from '@/lib/footer-links'

describe('footer-links', () => {
  it('retourne les liens CMS ou fallback légal par défaut', () => {
    expect(resolveFooterLinks([])).toHaveLength(2)
    expect(resolveFooterLinks([])).toEqual(DEFAULT_FOOTER_LINKS)
    expect(resolveFooterLinks([{ label: 'GitHub', href: 'https://github.com/x' }])).toHaveLength(1)
    expect(resolveFooterLinks([{ label: 'GitHub', href: 'https://github.com/x' }])).toEqual([
      { label: 'GitHub', href: 'https://github.com/x' },
    ])
  })

  it('retourne le fallback si cmsLinks est absent ou null', () => {
    expect(resolveFooterLinks(undefined)).toEqual(DEFAULT_FOOTER_LINKS)
    expect(resolveFooterLinks(null)).toEqual(DEFAULT_FOOTER_LINKS)
  })
})
