'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import type { JournalGalleryItem } from '@/lib/journal-gallery'
import { cn } from '@/lib/utils'

type JournalGallerySlideshowProps = {
  items: JournalGalleryItem[]
  title: string
}

export function JournalGallerySlideshow({ items, title }: JournalGallerySlideshowProps) {
  const [index, setIndex] = useState(0)
  const total = items.length
  const current = items[index]

  const goPrev = useCallback(() => {
    setIndex((value) => (value === 0 ? total - 1 : value - 1))
  }, [total])

  const goNext = useCallback(() => {
    setIndex((value) => (value === total - 1 ? 0 : value + 1))
  }, [total])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  if (!current || total === 0) return null

  return (
    <div aria-label={`Diaporama — ${title}`} className="mt-10 space-y-4" role="region">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black/30 sm:aspect-[16/9]">
        <Image
          alt={current.alt}
          className="object-contain"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 80vw"
          src={current.url}
        />

        {total > 1 ? (
          <>
            <button
              aria-label="Image précédente"
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
              onClick={goPrev}
              type="button"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              aria-label="Image suivante"
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
              onClick={goNext}
              type="button"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </>
        ) : null}

        <p className="absolute top-3 right-3 rounded-full bg-black/55 px-3 py-1 font-[family-name:var(--font-space-grotesk)] text-xs tabular-nums text-white backdrop-blur-sm">
          {index + 1} / {total}
        </p>
      </div>

      {current.caption ? (
        <p className="text-center text-sm text-[var(--foreground-secondary)]">{current.caption}</p>
      ) : null}

      {total > 1 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item, itemIndex) => (
            <button
              aria-current={itemIndex === index ? 'true' : undefined}
              aria-label={`Afficher l’image ${itemIndex + 1}`}
              className={cn(
                'relative size-14 overflow-hidden rounded-lg border transition sm:size-16',
                itemIndex === index
                  ? 'border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/40'
                  : 'border-white/10 opacity-70 hover:opacity-100',
              )}
              key={item.id}
              onClick={() => setIndex(itemIndex)}
              type="button"
            >
              <Image alt="" className="object-cover" fill sizes="64px" src={item.url} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
