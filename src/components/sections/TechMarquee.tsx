'use client'

import { Badge } from '@/components/ui/Badge'

type TechMarqueeProps = {
  items: string[]
  /** Recruteurs : 6–8 skills max sur l’accueil. */
  maxItems?: number
}

export function TechMarquee({ items, maxItems = 8 }: TechMarqueeProps) {
  const limited = items.slice(0, maxItems)
  if (!limited.length) return null

  const loop = [...limited, ...limited]

  return (
    <div className="relative overflow-hidden py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--background)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--background)] to-transparent"
      />
      <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-3 motion-reduce:animate-none hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <Badge
            className="shrink-0 transition hover:scale-105 hover:border-white/20 hover:text-[var(--foreground)]"
            key={`${item}-${index}`}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}
