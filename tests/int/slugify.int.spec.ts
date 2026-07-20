import { describe, expect, it } from 'vitest'

import { slugify } from '../../src/lib/utils'

describe('slugify', () => {
  it('converts a title to a URL-safe slug', () => {
    expect(slugify('Mon Super Projet')).toBe('mon-super-projet')
  })

  it('strips accents and collapses punctuation', () => {
    expect(slugify('Café & Créativité — V2!')).toBe('cafe-creativite-v2')
  })

  it('trims leading and trailing separators', () => {
    expect(slugify('  --Hello World--  ')).toBe('hello-world')
  })
})
