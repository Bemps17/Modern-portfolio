// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import { createTestMedia, getTestPayload, lexicalParagraph } from './helpers/payload'

describe('Payload collections — smoke CRUD', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getTestPayload()
  }, 60_000)

  it('liste users', async () => {
    const users = await payload.find({ collection: 'users', limit: 5 })
    expect(users).toBeDefined()
    expect(Array.isArray(users.docs)).toBe(true)
  })

  it('crée et supprime un média', async () => {
    const media = await createTestMedia(payload, 'CRUD media test')
    expect(media.id).toBeTruthy()
    expect(media.url).toMatch(/\/api\/media\/file\//)
    await payload.delete({ collection: 'media', id: media.id })
  })

  it('crée, lit et supprime une expérience', async () => {
    const created = await payload.create({
      collection: 'experiences',
      data: {
        title: 'Test Experience',
        company: 'Test Co',
        dateStart: '2024-01-01',
        current: true,
        description: 'Expérience créée par la batterie Payload.',
      },
    })
    const found = await payload.findByID({ collection: 'experiences', id: created.id })
    expect(found.title).toBe('Test Experience')
    await payload.delete({ collection: 'experiences', id: created.id })
  })

  it('crée, lit et supprime une skill', async () => {
    const created = await payload.create({
      collection: 'skills',
      data: {
        name: `Skill CRUD ${Date.now()}`,
        category: 'outils',
      },
    })
    const found = await payload.findByID({ collection: 'skills', id: created.id })
    expect(found.category).toBe('outils')
    await payload.delete({ collection: 'skills', id: created.id })
  })

  it('crée un projet draft avec cover, puis le supprime', async () => {
    const media = await createTestMedia(payload, 'Cover CRUD')
    const slug = `crud-project-${Date.now()}`
    try {
      const project = await payload.create({
        collection: 'projects',
        data: {
          title: 'CRUD Project',
          slug,
          excerpt: 'Excerpt CRUD.',
          content: lexicalParagraph('Body CRUD.'),
          cover: media.id,
          status: 'draft',
        },
      })
      const found = await payload.findByID({
        collection: 'projects',
        id: project.id,
        depth: 1,
        overrideAccess: true,
      })
      expect(found.status).toBe('draft')
      expect(found.slug).toBe(slug)
      await payload.delete({ collection: 'projects', id: project.id })
    } finally {
      await payload.delete({ collection: 'media', id: media.id }).catch(() => undefined)
    }
  })

  it('accepte une soumission de formulaire (contact)', async () => {
    const created = await payload.create({
      collection: 'form-submissions',
      data: {
        name: 'Test Contact',
        email: 'test-payload@example.com',
        message: 'Message de la batterie Payload.',
      },
    })
    expect(created.id).toBeTruthy()
    await payload.delete({ collection: 'form-submissions', id: created.id })
  })

  it('lit les globals site-settings et seo-defaults', async () => {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const seo = await payload.findGlobal({ slug: 'seo-defaults' })
    expect(settings.siteName).toBeTruthy()
    expect(settings.email).toBeTruthy()
    expect(seo.defaultTitle).toBeTruthy()
    expect(seo.defaultDescription).toBeTruthy()
  })
})
