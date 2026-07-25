'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { RichTextRenderer } from '@/components/sections/RichTextRenderer'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import {
  formatJournalPublishedDate,
  JOURNAL_CATEGORY_LABELS,
} from '@/lib/journal-category'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import type { JournalPost } from '@/payload-types'

type JournalPostDetailViewProps = {
  post: JournalPost
}

export function JournalPostDetailView({ post }: JournalPostDetailViewProps) {
  const coverUrl = resolveMediaUrl(post.cover)
  const coverAlt = (isMedia(post.cover) ? post.cover.alt : null) || post.title
  const excerpt = post.excerpt?.trim() || ''

  return (
    <>
      <ScrollProgress />
      <Container className="py-10 sm:py-12">
        <ReadableSurface bleed={false} strong>
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <Link className="text-link" data-cursor="link" href="/carnet">
              <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
              Carnet
            </Link>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatJournalPublishedDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <Badge className="bg-[var(--accent)]/10 text-[var(--accent-soft)]">
              {JOURNAL_CATEGORY_LABELS[post.category]}
            </Badge>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
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

            <div className="mt-10 lg:mt-0">
              <EditorialTitle as="h1" bleed className="mb-4" text={post.title} />
              {excerpt ? (
                <p className="text-lg text-[var(--foreground-secondary)]">{excerpt}</p>
              ) : null}

              {post.content ? (
                <div className="prose prose-invert mt-10 max-w-none">
                  <RichTextRenderer data={post.content} />
                </div>
              ) : null}

              {post.gallery?.length ? (
                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {post.gallery.map((item, index) => {
                    const image = isMedia(item.image) ? item.image : null
                    const imageUrl = resolveMediaUrl(item.image)
                    if (!imageUrl) return null
                    return (
                      <div
                        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                        key={item.id ?? index}
                      >
                        <Image
                          alt={image?.alt || `${post.title} ${index + 1}`}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={imageUrl}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </ReadableSurface>
      </Container>
    </>
  )
}
