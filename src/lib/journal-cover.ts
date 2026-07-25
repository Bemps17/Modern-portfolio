import { lablogCoverPublicPath } from '@/data/lablog-article-types'
import { LABLOG_ARTICLES } from '@/data/lablog-articles'
import { resolveMediaUrl } from '@/lib/media'

const LABLOG_SLUGS = new Set(LABLOG_ARTICLES.map((article) => article.slug))

/**
 * Cover Lablog : assets statiques versionnés dans public/carnet/.
 * Les uploads Payload seedés hors Vercel Blob renvoient 404 en prod serverless.
 */
export function resolveJournalCoverUrl(cover: unknown, slug: string): string | null {
  if (LABLOG_SLUGS.has(slug)) {
    return lablogCoverPublicPath(slug)
  }
  return resolveMediaUrl(cover)
}
