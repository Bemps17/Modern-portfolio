// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import { isMedia, resolveMediaUrl } from '@/lib/media'

import {
  acquireSiteSettingsLock,
  createTestMedia,
  getTestPayload,
  lexicalParagraph,
  releaseSiteSettingsLock,
  restoreGlobalUpload,
} from './helpers/payload'

/**
 * Vérifie le peuplement des relations upload depuis le dashboard Payload
 * (équivalent Local API de ce que le front lit après enregistrement admin).
 */
describe('Payload populate (depth) — dashboard → Local API', () => {
  let payload: Payload
  let mediaId: number
  let previousAvatar: number | null = null
  let createdProjectId: number | null = null
  let createdSkillId: number | null = null

  beforeAll(async () => {
    await acquireSiteSettingsLock()
    payload = await getTestPayload()
    const media = await createTestMedia(payload, 'Avatar test populate')
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

      if (createdProjectId) {
        await payload.delete({ collection: 'projects', id: createdProjectId }).catch(() => undefined)
      }
      if (createdSkillId) {
        await payload.delete({ collection: 'skills', id: createdSkillId }).catch(() => undefined)
      }

      await restoreGlobalUpload(payload, 'site-settings', 'avatar', previousAvatar, mediaId)

      await payload.delete({ collection: 'media', id: mediaId }).catch(() => undefined)
    } finally {
      releaseSiteSettingsLock()
    }
  })

  it('depth 0 renvoie un id pour site-settings.avatar', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    expect(settings.avatar).toBe(mediaId)
  })

  it('depth 1 peuple site-settings.avatar avec url + alt', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    expect(isMedia(settings.avatar)).toBe(true)
    expect(resolveMediaUrl(settings.avatar)).toMatch(/\/api\/media\/file\//)
    if (isMedia(settings.avatar)) {
      expect(settings.avatar.alt).toBe('Avatar test populate')
      expect(settings.avatar.id).toBe(mediaId)
    }
  })

  it('depth 1 peuple project.cover après création dashboard-like', async () => {
    const slug = `populate-test-${Date.now()}`
    const project = await payload.create({
      collection: 'projects',
      data: {
        title: 'Populate Test Project',
        slug,
        excerpt: 'Projet créé pour valider le peuplement cover.',
        content: lexicalParagraph('Contenu de test populate.'),
        cover: mediaId,
        status: 'published',
        featured: false,
        order: 9999,
      },
    })
    createdProjectId = project.id

    const found = await payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    const doc = found.docs[0]
    expect(doc).toBeTruthy()
    expect(isMedia(doc?.cover)).toBe(true)
    expect(resolveMediaUrl(doc?.cover)).toMatch(/\/api\/media\/file\//)
  })

  it('depth 1 peuple skill.icon', async () => {
    const skill = await payload.create({
      collection: 'skills',
      data: {
        name: `Populate Skill ${Date.now()}`,
        category: 'frontend',
        icon: mediaId,
      },
    })
    createdSkillId = skill.id

    const found = await payload.findByID({
      collection: 'skills',
      id: skill.id,
      depth: 1,
    })
    expect(isMedia(found.icon)).toBe(true)
    expect(resolveMediaUrl(found.icon)).toMatch(/\/api\/media\/file\//)
  })

  it('depth 1 peuple seo-defaults.ogImage', async () => {
    const previous = await payload.findGlobal({ slug: 'seo-defaults', depth: 0 })
    const previousOg =
      typeof previous.ogImage === 'number'
        ? previous.ogImage
        : previous.ogImage && typeof previous.ogImage === 'object'
          ? previous.ogImage.id
          : null

    await payload.updateGlobal({
      slug: 'seo-defaults',
      data: { ogImage: mediaId },
    })

    try {
      const seo = await payload.findGlobal({ slug: 'seo-defaults', depth: 1 })
      expect(isMedia(seo.ogImage)).toBe(true)
      expect(resolveMediaUrl(seo.ogImage)).toMatch(/\/api\/media\/file\//)
    } finally {
      await restoreGlobalUpload(payload, 'seo-defaults', 'ogImage', previousOg, mediaId)
    }
  })
})
