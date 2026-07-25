'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { JournalArticleBody } from '@/components/sections/JournalArticleBody'
import { JournalGalleryGrid } from '@/components/sections/JournalGalleryGrid'
import { JournalGallerySlideshow } from '@/components/sections/JournalGallerySlideshow'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import {
  formatJournalPublishedDate,
  JOURNAL_CATEGORY_LABELS,
  JOURNAL_GALLERY_LAYOUT_LABELS,
  JOURNAL_POST_TYPE_LABELS,
} from '@/lib/journal-category'
import { resolveJournalGalleryItems } from '@/lib/journal-gallery'
import { resolveJournalCoverUrl } from '@/lib/journal-cover'
import { isMedia } from '@/lib/media'
import type { JournalPost } from '@/payload-types'

type JournalPostDetailViewProps = {
  post: JournalPost
  backLabel?: string
}

export function JournalPostDetailView({ post, backLabel = 'Le Lablog' }: JournalPostDetailViewProps) {
  const isGallery = post.postType === 'gallery'
  const galleryItems = resolveJournalGalleryItems(post)
  const coverUrl = resolveJournalCoverUrl(post.cover, post.slug)
  const coverAlt = (isMedia(post.cover) ? post.cover.alt : null) || post.title
  const excerpt = post.excerpt?.trim() || ''
  const layout = post.galleryLayout ?? 'grid'

  return (
    <>
      <ScrollProgress />
      <Container className="py-10 sm:py-12">
        <ReadableSurface bleed={false} strong>
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <Link className="text-link" data-cursor="link" href="/carnet">
              <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
              {backLabel}
            </Link>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatJournalPublishedDate(post.publishedAt)}</time>
            {post.readingTimeMinutes ? (
              <>
                <span aria-hidden>·</span>
                <span>{post.readingTimeMinutes} min de lecture</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <Badge className="bg-[var(--accent)]/10 text-[var(--accent-soft)]">
              {JOURNAL_CATEGORY_LABELS[post.category]}
            </Badge>
            <span aria-hidden>·</span>
            <Badge className="bg-white/5 text-[var(--foreground-secondary)]">
              {isGallery
                ? `${JOURNAL_POST_TYPE_LABELS.gallery} · ${JOURNAL_GALLERY_LAYOUT_LABELS[layout]}`
                : JOURNAL_POST_TYPE_LABELS.article}
            </Badge>
          </div>

          {isGallery ? (
            <div className="min-w-0 max-w-4xl">
              <EditorialTitle as="h1" contained className="mb-4" text={post.title} />
              {excerpt ? (
                <p className="text-lg leading-relaxed text-[var(--foreground-secondary)]">{excerpt}</p>
              ) : null}

              {layout === 'slideshow' ? (
                <JournalGallerySlideshow items={galleryItems} title={post.title} />
              ) : (
                <JournalGalleryGrid items={galleryItems} />
              )}

              {post.content ? <JournalArticleBody content={post.content} /> : null}
            </div>
          ) : (
            <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
              <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
                {coverUrl ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:aspect-[3/4]">
                    <Image
                      alt={coverAlt}
                      className="object-cover"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      src={coverUrl}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mt-10 min-w-0 lg:mt-0">
                <EditorialTitle as="h1" contained className="mb-4" text={post.title} />
                {excerpt ? (
                  <p className="text-lg leading-relaxed text-[var(--foreground-secondary)]">{excerpt}</p>
                ) : null}

                {post.content ? <JournalArticleBody content={post.content} /> : null}
              </div>
            </div>
          )}
        </ReadableSurface>
      </Container>
    </>
  )
}
