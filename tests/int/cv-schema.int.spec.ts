import { describe, expect, it } from 'vitest'

import { SiteSettings } from '../../src/globals/SiteSettings'

function fieldNames(
  fields: {
    name?: string
    type?: string
    fields?: { name?: string }[]
    tabs?: { fields?: { name?: string }[] }[]
  }[],
): string[] {
  const names: string[] = []
  for (const field of fields) {
    if ('name' in field && field.name) names.push(field.name)
    if (field.type === 'tabs' && field.tabs) {
      for (const tab of field.tabs) {
        if (tab.fields) names.push(...fieldNames(tab.fields as typeof fields))
      }
    } else if (field.type === 'collapsible' && field.fields) {
      names.push(...fieldNames(field.fields as typeof fields))
    } else if (field.fields) {
      names.push(...fieldNames(field.fields as typeof fields))
    }
  }
  return names
}

function findField(fieldName: string) {
  return SiteSettings.fields
    .flatMap((field) =>
      field.type === 'collapsible' && 'fields' in field && field.fields
        ? field.fields
        : 'tabs' in field && field.tabs
          ? field.tabs.flatMap((tab) => tab.fields || [])
          : [field],
    )
    .find((field) => 'name' in field && field.name === fieldName)
}

describe('SiteSettings CV profile fields', () => {
  const names = fieldNames(SiteSettings.fields as Parameters<typeof fieldNames>[0])

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
    const competencies = findField('cvCompetencies')
    expect(competencies && 'fields' in competencies).toBe(true)
    if (!competencies || !('fields' in competencies) || !competencies.fields) {
      throw new Error('cvCompetencies fields missing')
    }
    const competencyFieldNames = competencies.fields
      .map((field) => ('name' in field ? field.name : null))
      .filter(Boolean)
    expect(competencyFieldNames).toEqual(expect.arrayContaining(['name', 'description']))
    expect(competencyFieldNames).not.toContain('level')
    expect(competencyFieldNames).not.toContain('items')
  })
})
