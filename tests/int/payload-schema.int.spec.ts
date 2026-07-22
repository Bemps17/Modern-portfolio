// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { Experiences } from '@/collections/Experiences'
import { FormSubmissions } from '@/collections/FormSubmissions'
import { Media } from '@/collections/Media'
import { Projects } from '@/collections/Projects'
import { Skills } from '@/collections/Skills'
import { Users } from '@/collections/Users'
import { SEODefaults } from '@/globals/SEODefaults'
import { SiteSettings } from '@/globals/SiteSettings'

function fieldNames(fields: { name?: string }[]): string[] {
  return fields.map((field) => ('name' in field ? field.name : undefined)).filter(Boolean) as string[]
}

describe('Payload schema — collections & globals', () => {
  it('enregistre toutes les collections métier', () => {
    expect(Users.slug).toBe('users')
    expect(Media.slug).toBe('media')
    expect(Projects.slug).toBe('projects')
    expect(Skills.slug).toBe('skills')
    expect(Experiences.slug).toBe('experiences')
    expect(FormSubmissions.slug).toBe('form-submissions')
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
      ]),
    )
    const avatar = SiteSettings.fields.find((field) => 'name' in field && field.name === 'avatar')
    expect(avatar).toMatchObject({ type: 'upload', relationTo: 'media' })
    const logo = SiteSettings.fields.find((field) => 'name' in field && field.name === 'logo')
    expect(logo).toMatchObject({ type: 'upload', relationTo: 'media' })
    const favicon = SiteSettings.fields.find((field) => 'name' in field && field.name === 'favicon')
    expect(favicon).toMatchObject({ type: 'upload', relationTo: 'media' })
  })

  it('SEO defaults expose ogImage (upload → media)', () => {
    const og = SEODefaults.fields.find((field) => 'name' in field && field.name === 'ogImage')
    expect(og).toMatchObject({ type: 'upload', relationTo: 'media' })
  })

  it('Projects exige cover + status published/draft', () => {
    const names = fieldNames(Projects.fields as { name?: string }[])
    expect(names).toEqual(expect.arrayContaining(['title', 'slug', 'excerpt', 'content', 'cover', 'status']))
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
})
