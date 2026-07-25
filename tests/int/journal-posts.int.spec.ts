// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import { LABLOG_ARTICLE_JSON_TEMPLATE } from '@/lib/lablog-article-blueprint'
import { createTestMedia, getTestPayload, lexicalParagraph } from './helpers/payload'

describe('journal-posts collection', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getTestPayload()
  }, 60_000)

  it('crée, lit et supprime un post publié', async () => {
    const media = await createTestMedia(payload, 'Journal cover')
    const slug = `journal-crud-${Date.now()}`
    try {
      const post = await payload.create({
        collection: 'journal-posts',
        data: {
          title: 'Test Carnet',
          slug,
          excerpt: 'Excerpt test carnet.',
          content: lexicalParagraph('Contenu carnet CRUD.'),
          cover: media.id,
          status: 'published',
          publishedAt: new Date().toISOString(),
          postType: 'article',
          category: 'ia',
        },
      })
      expect(post.slug).toBe(slug)
      const found = await payload.findByID({ collection: 'journal-posts', id: post.id, depth: 1 })
      expect(found.title).toBe('Test Carnet')
      expect(typeof found.cover).toBe('object')
    } finally {
      const existing = await payload.find({
        collection: 'journal-posts',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.delete({ collection: 'journal-posts', id: existing.docs[0].id })
      }
      await payload.delete({ collection: 'media', id: media.id }).catch(() => undefined)
    }
  })

  it('crée une galerie avec layout diaporama', async () => {
    const cover = await createTestMedia(payload, 'Gallery cover')
    const shot = await createTestMedia(payload, 'Gallery shot')
    const slug = `journal-gallery-${Date.now()}`
    try {
      const post = await payload.create({
        collection: 'journal-posts',
        data: {
          title: 'Galerie test',
          slug,
          postType: 'gallery',
          galleryLayout: 'slideshow',
          excerpt: 'Galerie diaporama test.',
          cover: cover.id,
          gallery: [{ image: shot.id, caption: 'Légende test' }],
          status: 'published',
          publishedAt: new Date().toISOString(),
          category: 'ia',
        },
      })
      expect(post.postType).toBe('gallery')
      expect(post.galleryLayout).toBe('slideshow')
    } finally {
      const existing = await payload.find({
        collection: 'journal-posts',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.delete({ collection: 'journal-posts', id: existing.docs[0].id })
      }
      await payload.delete({ collection: 'media', id: cover.id }).catch(() => undefined)
      await payload.delete({ collection: 'media', id: shot.id }).catch(() => undefined)
    }
  })

  it('applique contentBlueprint à la création', async () => {
    const media = await createTestMedia(payload, 'Blueprint cover')
    const slug = `journal-blueprint-${Date.now()}`
    try {
      const post = await payload.create({
        collection: 'journal-posts',
        data: {
          title: 'Placeholder',
          slug,
          excerpt: 'Placeholder excerpt.',
          contentBlueprint: LABLOG_ARTICLE_JSON_TEMPLATE,
          cover: media.id,
          status: 'published',
          publishedAt: new Date().toISOString(),
          postType: 'article',
          category: 'ia',
        },
      })
      expect(post.title).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.title)
      expect(post.excerpt).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.excerpt)
      expect(post.content?.root?.children?.length).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.blocks.length)
    } finally {
      const existing = await payload.find({
        collection: 'journal-posts',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.delete({ collection: 'journal-posts', id: existing.docs[0].id })
      }
      await payload.delete({ collection: 'media', id: media.id }).catch(() => undefined)
    }
  })
})
