import type { CollectionConfig } from 'payload'

import { getSiteUrl } from '@/lib/site-url'

/** Live preview URL pour collections éditoriales (sans tables versions — migration Neon séparée). */
export function editorialLivePreviewConfig(collection: 'projects' | 'journal-posts'): Pick<
  CollectionConfig,
  'admin'
> {
  const pathPrefix = collection === 'projects' ? '/projets' : '/carnet'

  return {
    admin: {
      livePreview: {
        url: ({ data }) => {
          if (!data?.slug || typeof data.slug !== 'string') return null
          const path = `${pathPrefix}/${data.slug}`
          const secret = process.env.PREVIEW_SECRET?.trim() || process.env.PAYLOAD_SECRET?.trim()
          if (!secret) return `${getSiteUrl()}${path}`
          return `${getSiteUrl()}/api/draft?path=${encodeURIComponent(path)}&secret=${encodeURIComponent(secret)}`
        },
      },
    },
  }
}
