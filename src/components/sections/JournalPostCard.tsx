import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  formatJournalPublishedDate,
  JOURNAL_CATEGORY_LABELS,
} from '@/lib/journal-category'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import type { JournalPost } from '@/payload-types'

type JournalPostCardProps = {
  post: JournalPost
}

export function JournalPostCard({ post }: JournalPostCardProps) {
  const coverUrl = resolveMediaUrl(post.cover)
  const coverAlt = (isMedia(post.cover) ? post.cover.alt : null) || post.title
  const excerpt = post.excerpt?.trim() || ''

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
      </Link>
    </GlassCard>
  )
}
