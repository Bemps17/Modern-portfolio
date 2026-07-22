// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  getExperiences,
  getFeaturedProjects,
  getProjectBySlug,
  getPublishedProjects,
  getSeoDefaultsContent,
  getSiteSettingsContent,
  getSkills,
  isDemoContentMode,
} from '@/lib/content'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { isPayloadConfigured } from '@/lib/payload-env'

/**
 * Contrat données par page / section : peuplement CMS requis pour le rendu front.
 * Couvre Accueil, Projets, détail, À propos, Contact (via site-settings).
 */
describe('Pages & sections — contrats contenu CMS', () => {
  it('Payload est configuré (pas de mode démo pour cet audit)', () => {
    expect(isPayloadConfigured()).toBe(true)
    expect(isDemoContentMode()).toBe(false)
  })

  it('Accueil / Hero — site-settings peuplé (avatar, copy, socials)', async () => {
    const settings = await getSiteSettingsContent()
    expect(settings.siteName).toBeTruthy()
    expect(settings.tagline).toBeTruthy()
    expect(settings.email).toBeTruthy()

    const avatar = 'avatar' in settings ? settings.avatar : null
    expect(avatar == null || isMedia(avatar)).toBe(true)
    if (isMedia(avatar)) {
      expect(resolveMediaUrl(avatar)).toMatch(/\/api\/media\/file\//)
    }
  })

  it('Accueil — projets featured + covers peuplés (ProjectGrid / ProjectCard)', async () => {
    const featured = await getFeaturedProjects()
    expect(featured.length).toBeGreaterThan(0)
    for (const project of featured) {
      expect(project.slug).toBeTruthy()
      expect(project.title).toBeTruthy()
      expect(typeof project.cover).not.toBe('number')
      expect(isMedia(project.cover)).toBe(true)
      expect(resolveMediaUrl(project.cover)).toBeTruthy()
    }
  })

  it('Accueil — skills pour TechMarquee / StatsStrip', async () => {
    const [skills, experiences, projects] = await Promise.all([
      getSkills(),
      getExperiences(),
      getPublishedProjects(),
    ])
    expect(skills.length).toBeGreaterThan(0)
    expect(experiences.length).toBeGreaterThan(0)
    expect(projects.length).toBeGreaterThan(0)
    for (const skill of skills) {
      if (skill.icon != null) {
        expect(typeof skill.icon).not.toBe('number')
        expect(isMedia(skill.icon)).toBe(true)
      }
    }
  })

  it('SEO defaults — ogImage peuplé ou absent (jamais un id nu)', async () => {
    const seo = await getSeoDefaultsContent()
    expect(seo.defaultTitle).toBeTruthy()
    expect(seo.defaultDescription).toBeTruthy()
    if ('ogImage' in seo && seo.ogImage != null) {
      expect(typeof seo.ogImage).not.toBe('number')
      expect(isMedia(seo.ogImage)).toBe(true)
    }
  })

  it('/projets — tous les covers publiés sont peuplés', async () => {
    const projects = await getPublishedProjects()
    expect(projects.length).toBeGreaterThan(0)
    for (const project of projects) {
      expect(typeof project.cover).not.toBe('number')
      expect(isMedia(project.cover)).toBe(true)
      expect(resolveMediaUrl(project.cover)).toMatch(/\/api\/media\/file\//)
    }
  })

  it('/projets/[slug] — cover + gallery peuplés (depth 2)', async () => {
    const projects = await getPublishedProjects()
    const sample = projects[0]
    expect(sample).toBeTruthy()
    const detail = await getProjectBySlug(sample.slug)
    expect(detail).toBeTruthy()
    expect(isMedia(detail!.cover)).toBe(true)
    expect(resolveMediaUrl(detail!.cover)).toBeTruthy()

    for (const item of detail!.gallery || []) {
      if (item?.image == null) continue
      expect(typeof item.image).not.toBe('number')
      expect(isMedia(item.image)).toBe(true)
      expect(resolveMediaUrl(item.image)).toBeTruthy()
    }
  })

  it('/a-propos — expériences + skills + avatar', async () => {
    const [settings, experiences, skills] = await Promise.all([
      getSiteSettingsContent(),
      getExperiences(),
      getSkills(),
    ])
    expect(settings.aboutIntro || settings.tagline).toBeTruthy()
    expect(experiences.every((experience) => experience.title && experience.company)).toBe(true)
    expect(skills.every((skill) => skill.name && skill.category)).toBe(true)
    const avatar = 'avatar' in settings ? settings.avatar : null
    if (avatar != null) {
      expect(isMedia(avatar)).toBe(true)
    }
  })

  it('/contact — email + réseaux depuis site-settings', async () => {
    const settings = await getSiteSettingsContent()
    expect(settings.email).toMatch(/@/)
    expect(Array.isArray(settings.socialLinks)).toBe(true)
  })
})
