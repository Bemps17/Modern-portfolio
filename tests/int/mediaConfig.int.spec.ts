import { describe, expect, it } from 'vitest'

import { Media } from '../../src/collections/Media'

describe('Media collection config', () => {
  it('requires alt text', () => {
    const alt = Media.fields.find((field) => 'name' in field && field.name === 'alt')
    expect(alt).toBeTruthy()
    expect(alt && 'required' in alt && alt.required).toBe(true)
  })

  it('defines thumbnail, card and hero image sizes', () => {
    expect(Media.upload && typeof Media.upload === 'object').toBe(true)
    if (!Media.upload || typeof Media.upload !== 'object') return
    const sizes = Media.upload.imageSizes?.map((size) => size.name) ?? []
    expect(sizes).toEqual(expect.arrayContaining(['thumbnail', 'card', 'hero']))
  })
})
