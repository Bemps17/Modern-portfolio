import { describe, expect, it } from 'vitest'

import { SiteSettings } from '../../src/globals/SiteSettings'

describe('SiteSettings CV profile fields', () => {
  const names = SiteSettings.fields
    .map((field) => ('name' in field ? field.name : null))
    .filter(Boolean)

  it('declares CV profile fields', () => {
    expect(names).toEqual(
      expect.arrayContaining([
        'phone',
        'cvPitch',
        'recommendationQuote',
        'recommendationAuthor',
        'mobility',
        'interests',
        'rqthNote',
        'showRqthOnCv',
        'languages',
        'cvCompetencies',
      ]),
    )
  })
})
