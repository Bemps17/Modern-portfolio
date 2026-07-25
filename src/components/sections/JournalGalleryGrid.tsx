import Image from 'next/image'

import type { JournalGalleryItem } from '@/lib/journal-gallery'

type JournalGalleryGridProps = {
  items: JournalGalleryItem[]
}

export function JournalGalleryGrid({ items }: JournalGalleryGridProps) {
  if (!items.length) return null

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map((item) => (
        <figure
          className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
          key={item.id}
        >
          <Image
            alt={item.alt}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            src={item.url}
          />
          {item.caption ? (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-xs text-[var(--foreground-secondary)]">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  )
}
