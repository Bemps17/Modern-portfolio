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
  const reverse = [...limited].reverse()
  const loopReverse = [...reverse, ...reverse]

  return (
    <div className="relative space-y-3 overflow-hidden border-y border-white/5 py-5">
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
            className="shrink-0 bg-[var(--accent)]/10 text-[var(--accent-soft)] transition hover:scale-105 hover:bg-[var(--accent)]/20"
            key={`a-${item}-${index}`}
          >
            {item}
          </Badge>
        ))}
      </div>
      <div className="flex w-max animate-[marquee-reverse_38s_linear_infinite] gap-3 motion-reduce:animate-none hover:[animation-play-state:paused]">
        {loopReverse.map((item, index) => (
          <Badge
            className="shrink-0 border border-white/10 bg-white/5 text-[var(--muted)] transition hover:scale-105 hover:text-white"
            key={`b-${item}-${index}`}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}
