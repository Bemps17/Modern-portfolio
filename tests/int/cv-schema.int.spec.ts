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
        'cvJobTitle',
        'cvPitch',
        'mobility',
        'interests',
        'rqthNote',
        'showRqthOnCv',
        'languages',
        'cvCompetencies',
      ]),
    )
    expect(names).not.toContain('recommendationQuote')
    expect(names).not.toContain('recommendationAuthor')
  })

  it('defines textual competency categories without percentage level', () => {
    const competencies = SiteSettings.fields.find(
      (field) => 'name' in field && field.name === 'cvCompetencies',
    )
    expect(competencies && 'fields' in competencies).toBe(true)
    if (!competencies || !('fields' in competencies) || !competencies.fields) {
      throw new Error('cvCompetencies fields missing')
    }
    const fieldNames = competencies.fields
      .map((field) => ('name' in field ? field.name : null))
      .filter(Boolean)
    expect(fieldNames).toEqual(expect.arrayContaining(['name', 'description']))
    expect(fieldNames).not.toContain('level')
    expect(fieldNames).not.toContain('items')
  })
})
