// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import { getPublishedJournalPosts } from '@/lib/content'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { isPayloadConfigured } from '@/lib/payload-env'

import { createTestMedia, getTestPayload, lexicalParagraph } from './helpers/payload'

/**
 * Contrat front : la couche `content.ts` doit peupler les uploads
 * (depth ≥ 1) pour que les cartes carnet affichent la cover.
 */
describe('content.ts — carnet CMS pour le front', () => {
  let payload: Payload
  let mediaId: number
  let postId: number | null = null
  const slug = `journal-content-${Date.now()}`

  beforeAll(async () => {
    expect(isPayloadConfigured()).toBe(true)

    payload = await getTestPayload()
    const media = await createTestMedia(payload, 'Journal content cover')
    mediaId = media.id

    const post = await payload.create({
      collection: 'journal-posts',
      data: {
        title: 'Test content layer carnet',
        slug,
        excerpt: 'Excerpt pour le test content layer carnet.',
        content: lexicalParagraph('Contenu carnet content layer.'),
        cover: mediaId,
        status: 'published',
        publishedAt: new Date().toISOString(),
        category: 'ia',
      },
    })
    postId = post.id
  }, 90_000)

  afterAll(async () => {
    if (!payload) return
    if (postId != null) {
      await payload.delete({ collection: 'journal-posts', id: postId }).catch(() => undefined)
    }
    await payload.delete({ collection: 'media', id: mediaId }).catch(() => undefined)
  })

  it('getPublishedJournalPosts peuple cover', async () => {
    const posts = await getPublishedJournalPosts()
    expect(posts.length).toBeGreaterThan(0)

    const testPost = posts.find((post) => post.slug === slug)
    expect(testPost).toBeTruthy()
    expect(testPost?.cover).toBeTruthy()
    expect(typeof testPost?.cover).not.toBe('number')
    expect(isMedia(testPost?.cover)).toBe(true)
    expect(resolveMediaUrl(testPost?.cover)).toMatch(/\/api\/media\/file\//)

    const withCover = posts.filter((post) => post.cover != null)
    expect(withCover.length).toBeGreaterThan(0)
    for (const post of withCover.slice(0, 5)) {
      expect(typeof post.cover).not.toBe('number')
      expect(isMedia(post.cover)).toBe(true)
      expect(resolveMediaUrl(post.cover)).toBeTruthy()
    }
  })
})
