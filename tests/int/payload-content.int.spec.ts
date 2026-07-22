// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import {
  getPublishedProjects,
  getSeoDefaultsContent,
  getSiteSettingsContent,
  getSkills,
  isDemoContentMode,
} from '@/lib/content'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { isPayloadConfigured } from '@/lib/payload-env'

import {
  acquireSiteSettingsLock,
  createTestMedia,
  getTestPayload,
  releaseSiteSettingsLock,
  restoreGlobalUpload,
} from './helpers/payload'

/**
 * Contrat front : la couche `content.ts` doit peupler les uploads
 * (depth ≥ 1) pour que le Hero / cards affichent l’image dashboard.
 */
describe('content.ts — peuplement CMS pour le front', () => {
  let payload: Payload
  let mediaId: number
  let previousAvatar: number | null = null

  beforeAll(async () => {
    expect(isPayloadConfigured()).toBe(true)
    expect(isDemoContentMode()).toBe(false)

    await acquireSiteSettingsLock()
    payload = await getTestPayload()
    const media = await createTestMedia(payload, 'Content layer avatar')
    mediaId = media.id

    const current = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    previousAvatar =
      typeof current.avatar === 'number'
        ? current.avatar
        : current.avatar && typeof current.avatar === 'object'
          ? current.avatar.id
          : null

    await payload.updateGlobal({
      slug: 'site-settings',
      data: { avatar: mediaId },
    })
  }, 90_000)

  afterAll(async () => {
    try {
      if (!payload) return
      await restoreGlobalUpload(payload, 'site-settings', 'avatar', previousAvatar, mediaId)
      await payload.delete({ collection: 'media', id: mediaId }).catch(() => undefined)
    } finally {
      releaseSiteSettingsLock()
    }
  })

  it('getSiteSettingsContent peuple avatar (pas un simple id)', async () => {
    const settings = await getSiteSettingsContent()
    expect(settings).toBeTruthy()
    // Union fallback | SiteSetting — avatar doit être peuplé côté CMS
    const avatar = 'avatar' in settings ? settings.avatar : undefined
    expect(isMedia(avatar)).toBe(true)
    expect(resolveMediaUrl(avatar)).toMatch(/\/api\/media\/file\//)
  })

  it('getSeoDefaultsContent accepte un ogImage peuplé ou null', async () => {
    const seo = await getSeoDefaultsContent()
    expect(seo).toBeTruthy()
    expect(seo.defaultTitle).toBeTruthy()
    if ('ogImage' in seo && seo.ogImage != null) {
      // Si renseigné, doit être peuplé (depth 1) — jamais un number nu
      expect(typeof seo.ogImage).not.toBe('number')
      expect(isMedia(seo.ogImage)).toBe(true)
    }
  })

  it('getPublishedProjects peuple cover quand présent', async () => {
    const projects = await getPublishedProjects()
    expect(projects.length).toBeGreaterThan(0)
    const withCover = projects.filter((project) => project.cover != null)
    expect(withCover.length).toBeGreaterThan(0)
    for (const project of withCover.slice(0, 5)) {
      expect(typeof project.cover).not.toBe('number')
      expect(isMedia(project.cover)).toBe(true)
      expect(resolveMediaUrl(project.cover)).toBeTruthy()
    }
  })

  it('getSkills retourne une liste utilisable', async () => {
    const skills = await getSkills()
    expect(Array.isArray(skills)).toBe(true)
    for (const skill of skills) {
      if (skill.icon != null) {
        expect(typeof skill.icon).not.toBe('number')
        expect(isMedia(skill.icon)).toBe(true)
      }
    }
  })
})
