import { describe, expect, it } from 'vitest'

import { resolveProjectCoverUrl } from '@/lib/project-cover'
import type { Project } from '@/payload-types'

describe('resolveProjectCoverUrl', () => {
  it('préfère une URL CMS absolue (CDN / Blob)', () => {
    const project = {
      slug: 'demo',
      cover: {
        id: 1,
        url: 'https://xyz.public.blob.vercel-storage.com/demo.webp',
        alt: 'Demo',
        updatedAt: '2026-01-01',
        createdAt: '2026-01-01',
      },
    } as unknown as Pick<Project, 'slug' | 'cover'>

    expect(resolveProjectCoverUrl(project)).toBe(
      'https://xyz.public.blob.vercel-storage.com/demo.webp',
    )
  })

  it('retombe sur /projects/{slug}-cover.webp si CMS relatif /api/media (souvent 404)', () => {
    const project = {
      slug: 'ahistory',
      cover: {
        id: 26,
        url: '/api/media/file/ahistory-cover-1.webp',
        alt: 'Ahistory',
        updatedAt: '2026-01-01',
        createdAt: '2026-01-01',
      },
    } as unknown as Pick<Project, 'slug' | 'cover'>

    expect(resolveProjectCoverUrl(project)).toBe('/projects/ahistory-cover.webp')
  })

  it('retombe sur la cover statique si cover absent', () => {
    const project = { slug: 'bscl', cover: null } as unknown as Pick<Project, 'slug' | 'cover'>
    expect(resolveProjectCoverUrl(project)).toBe('/projects/bscl-cover.webp')
  })
})
