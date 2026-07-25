import type { JournalPost, Media } from '@/payload-types'

import { LABLOG_ARTICLES } from './lablog-articles'
import { lablogCoverPublicPath } from './lablog-article-types'
import { blocksToLexical } from '@/lib/lexical-content'

function fallbackMedia(path: string, alt: string): Media {
  return {
    id: 0,
    alt,
    url: path,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  } as Media
}

/** Posts Lablog pour le mode démo (sans Payload). */
export function buildLablogFallbackPosts(): JournalPost[] {
  return LABLOG_ARTICLES.map((article, index) => ({
    id: index + 1,
    postType: 'article' as const,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: blocksToLexical([...article.blocks]),
    cover: fallbackMedia(lablogCoverPublicPath(article.slug), `Cover — ${article.title}`),
    gallery: [],
    galleryLayout: 'grid' as const,
    category: article.category,
    publishedAt: article.publishedAt,
    status: 'published' as const,
    order: article.order,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }))
}
