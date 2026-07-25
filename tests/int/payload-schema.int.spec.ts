// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { Experiences } from '@/collections/Experiences'
import { FormSubmissions } from '@/collections/FormSubmissions'
import { JournalPosts } from '@/collections/JournalPosts'
import { Media } from '@/collections/Media'
import { Projects } from '@/collections/Projects'
import { Qualifications } from '@/collections/Qualifications'
import { Skills } from '@/collections/Skills'
import { Tags } from '@/collections/Tags'
import { Users } from '@/collections/Users'
import { SEODefaults } from '@/globals/SEODefaults'
import { SiteSettings } from '@/globals/SiteSettings'

function fieldNames(fields: { name?: string; type?: string; fields?: { name?: string }[]; tabs?: { fields?: { name?: string }[] }[] }[]): string[] {
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

describe('Payload schema — collections & globals', () => {
  it('enregistre toutes les collections métier', () => {
    expect(Users.slug).toBe('users')
    expect(Media.slug).toBe('media')
    expect(Projects.slug).toBe('projects')
    expect(Skills.slug).toBe('skills')
    expect(Experiences.slug).toBe('experiences')
    expect(Qualifications.slug).toBe('qualifications')
    expect(FormSubmissions.slug).toBe('form-submissions')
    expect(Tags.slug).toBe('tags')
  })

  it('enregistre les globals Site Settings et SEO', () => {
    expect(SiteSettings.slug).toBe('site-settings')
    expect(SEODefaults.slug).toBe('seo-defaults')
  })

  it('Site Settings expose avatar (upload → media) pour le dashboard', () => {
    const names = fieldNames(SiteSettings.fields as { name?: string }[])
    expect(names).toEqual(
      expect.arrayContaining([
        'siteName',
        'tagline',
        'avatar',
        'logo',
        'favicon',
        'email',
        'socialLinks',
        'aboutIntro',
        'aboutBody',
        'location',
        'availability',
        'availabilityLabel',
        'approachSteps',
        'whyMePoints',
        'skillGroups',
        'personalProjects',
        'aboutHeadline',
        'skillsTitle',
        'skillsSubtitle',
        'themeColor',
        'legalPublisher',
        'footerLinks',
        'maintenanceMode',
      ]),
    )
    const findField = (fieldName: string) =>
      names.includes(fieldName)
        ? SiteSettings.fields
            .flatMap((field) =>
              field.type === 'collapsible' && 'fields' in field && field.fields
                ? field.fields
                : 'tabs' in field && field.tabs
                  ? field.tabs.flatMap((tab) => tab.fields || [])
                  : [field],
            )
            .find((field) => 'name' in field && field.name === fieldName)
        : undefined
    const avatar = findField('avatar')
    expect(avatar).toMatchObject({ type: 'upload', relationTo: 'media' })
    const logo = findField('logo')
    expect(logo).toMatchObject({ type: 'upload', relationTo: 'media' })
    const favicon = findField('favicon')
    expect(favicon).toMatchObject({ type: 'upload', relationTo: 'media' })
  })

  it('SEO defaults expose ogImage et champs avancés', () => {
    const names = fieldNames(SEODefaults.fields as { name?: string }[])
    expect(names).toEqual(
      expect.arrayContaining([
        'defaultTitle',
        'defaultDescription',
        'ogImage',
        'titleTemplate',
        'twitterCard',
        'noindexSite',
        'enablePersonJsonLd',
      ]),
    )
    const og = SEODefaults.fields
      .flatMap((field) =>
        field.type === 'collapsible' && 'fields' in field && field.fields
          ? field.fields
          : 'tabs' in field && field.tabs
            ? field.tabs.flatMap((tab) => tab.fields || [])
            : [field],
      )
      .find((field) => 'name' in field && field.name === 'ogImage')
    expect(og).toMatchObject({ type: 'upload', relationTo: 'media' })
  })

  it('Projects exige cover + status published/draft', () => {
    const names = fieldNames(Projects.fields as { name?: string }[])
    expect(names).toEqual(
      expect.arrayContaining(['title', 'slug', 'excerpt', 'impact', 'content', 'cover', 'status']),
    )
    const cover = Projects.fields.find((field) => 'name' in field && field.name === 'cover')
    expect(cover).toMatchObject({ type: 'upload', relationTo: 'media', required: true })
  })

  it('Skills expose icon upload optionnel', () => {
    const icon = Skills.fields.find((field) => 'name' in field && field.name === 'icon')
    expect(icon).toMatchObject({ type: 'upload', relationTo: 'media' })
  })

  it('Form submissions sont créables publiquement (contact)', () => {
    expect(FormSubmissions.access?.create?.({} as never)).toBe(true)
  })

  it('Form submissions expose le statut inbox CRM', () => {
    const names = fieldNames(FormSubmissions.fields as { name?: string }[])
    expect(names).toContain('inboxStatus')
  })

  it('Journal posts expose tags et temps de lecture', () => {
    const names = fieldNames(JournalPosts.fields as { name?: string }[])
    expect(names).toEqual(expect.arrayContaining(['tags', 'readingTimeMinutes']))
  })
})
