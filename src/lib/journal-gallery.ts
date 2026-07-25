import { resolveJournalCoverUrl } from '@/lib/journal-cover'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import type { JournalPost } from '@/payload-types'

export type JournalGalleryItem = {
  id: string
  url: string
  alt: string
  caption?: string | null
}

export function resolveJournalGalleryItems(post: JournalPost): JournalGalleryItem[] {
  return (post.gallery ?? []).flatMap((item, index) => {
    const url = resolveMediaUrl(item.image)
    if (!url) return []
    const media = isMedia(item.image) ? item.image : null
    return [
      {
        id: item.id ?? `gallery-${index}`,
        url,
        alt: media?.alt || `${post.title} — image ${index + 1}`,
        caption: item.caption,
      },
    ]
  })
}

/** Vignettes pour preview card (cover + galerie, max 4). */
export function resolveJournalPreviewImages(post: JournalPost, limit = 4): JournalGalleryItem[] {
  const items: JournalGalleryItem[] = []
  const coverUrl = resolveJournalCoverUrl(post.cover, post.slug)

  if (coverUrl) {
    items.push({
      id: 'cover',
      url: coverUrl,
      alt: (isMedia(post.cover) ? post.cover.alt : null) || post.title,
    })
  }

  for (const item of resolveJournalGalleryItems(post)) {
    if (items.length >= limit) break
    if (items.some((existing) => existing.url === item.url)) continue
    items.push(item)
  }

  return items.slice(0, limit)
}

export function journalGalleryPhotoCount(post: JournalPost): number {
  const galleryCount = post.gallery?.length ?? 0
  return Math.max(galleryCount, post.cover ? 1 : 0)
}
