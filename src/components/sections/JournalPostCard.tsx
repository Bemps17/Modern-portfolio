import Image from 'next/image'
import Link from 'next/link'
import { Images, Newspaper } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  formatJournalPublishedDate,
  JOURNAL_CATEGORY_LABELS,
  JOURNAL_GALLERY_LAYOUT_LABELS,
  JOURNAL_POST_TYPE_LABELS,
} from '@/lib/journal-category'
import {
  journalGalleryPhotoCount,
  resolveJournalGalleryItems,
  resolveJournalPreviewImages,
} from '@/lib/journal-gallery'
import { resolveJournalCoverUrl } from '@/lib/journal-cover'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import type { JournalPost } from '@/payload-types'
import { cn } from '@/lib/utils'

type JournalPostCardProps = {
  post: JournalPost
}

function ArticleCardPreview({ post }: JournalPostCardProps) {
  const coverUrl = resolveJournalCoverUrl(post.cover, post.slug)
  const coverAlt = (isMedia(post.cover) ? post.cover.alt : null) || post.title
  const excerpt = post.excerpt?.trim() || ''

  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
        {coverUrl ? (
          <Image
            alt={coverAlt}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={coverUrl}
          />
        ) : null}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
          <Newspaper aria-hidden className="size-3.5" />
          {JOURNAL_POST_TYPE_LABELS.article}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-[var(--accent)]/10 text-[var(--accent-soft)]">
            {JOURNAL_CATEGORY_LABELS[post.category]}
          </Badge>
          <time
            className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--muted)]"
            dateTime={post.publishedAt}
          >
            {formatJournalPublishedDate(post.publishedAt)}
          </time>
        </div>
        <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">{post.title}</h3>
        {excerpt ? (
          <p className="line-clamp-2 text-sm text-[var(--foreground-secondary)]">{excerpt}</p>
        ) : null}
      </div>
    </>
  )
}

function GalleryCardPreview({ post }: JournalPostCardProps) {
  const previews = resolveJournalPreviewImages(post, 4)
  const galleryItems = resolveJournalGalleryItems(post)
  const photoCount = journalGalleryPhotoCount(post)
  const layout = post.galleryLayout ?? 'grid'
  const excerpt = post.excerpt?.trim() || ''

  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
        {previews.length === 1 ? (
          <Image
            alt={previews[0].alt}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={previews[0].url}
          />
        ) : (
          <div className={cn('grid h-full w-full gap-0.5', previews.length >= 3 ? 'grid-cols-2' : 'grid-cols-2')}>
            {previews.map((item, index) => (
              <div
                className={cn(
                  'relative min-h-0 bg-black/20',
                  previews.length === 3 && index === 0 && 'row-span-2',
                )}
                key={item.id}
              >
                <Image
                  alt={item.alt}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  src={item.url}
                />
              </div>
            ))}
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
          <Images aria-hidden className="size-3.5" />
          {JOURNAL_GALLERY_LAYOUT_LABELS[layout]}
        </span>
        {photoCount > 1 ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 font-[family-name:var(--font-space-grotesk)] text-[10px] text-white backdrop-blur-sm">
            {photoCount} photos
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-[var(--accent)]/10 text-[var(--accent-soft)]">
            {JOURNAL_CATEGORY_LABELS[post.category]}
          </Badge>
          <time
            className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--muted)]"
            dateTime={post.publishedAt}
          >
            {formatJournalPublishedDate(post.publishedAt)}
          </time>
        </div>
        <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">{post.title}</h3>
        {excerpt ? (
          <p className="line-clamp-2 text-sm text-[var(--foreground-secondary)]">{excerpt}</p>
        ) : galleryItems.length ? (
          <p className="text-sm text-[var(--muted)]">
            {JOURNAL_POST_TYPE_LABELS.gallery} · {photoCount} image{photoCount > 1 ? 's' : ''}
          </p>
        ) : null}
      </div>
    </>
  )
}

export function JournalPostCard({ post }: JournalPostCardProps) {
  const isGallery = post.postType === 'gallery'

  return (
    <GlassCard
      as="article"
      className="group relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <Link
        className="relative flex h-full flex-col"
        data-cursor="view"
        href={`/carnet/${post.slug}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {isGallery ? <GalleryCardPreview post={post} /> : <ArticleCardPreview post={post} />}
      </Link>
    </GlassCard>
  )
}
