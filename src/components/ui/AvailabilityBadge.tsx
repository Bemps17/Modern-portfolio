'use client'

import { cn } from '@/lib/utils'

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable'

const DEFAULT_LABELS: Record<AvailabilityStatus, string> = {
  available: 'Disponible pour opportunités',
  limited: 'Disponibilité limitée',
  unavailable: 'Actuellement indisponible',
}

type AvailabilityBadgeProps = {
  status?: AvailabilityStatus | null
  label?: string | null
  className?: string
  size?: 'sm' | 'md'
}

export function AvailabilityBadge({
  status = 'available',
  label,
  className,
  size = 'md',
}: AvailabilityBadgeProps) {
  const resolved = status ?? 'available'
  const text = label?.trim() || DEFAULT_LABELS[resolved]
  const tone =
    resolved === 'available'
      ? 'text-emerald-300/95 ring-emerald-400/30 bg-emerald-400/10'
      : resolved === 'limited'
        ? 'text-amber-200/95 ring-amber-400/30 bg-amber-400/10'
        : 'text-[var(--muted)] ring-white/15 bg-white/5'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full ring-1 backdrop-blur-md',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        tone,
        className,
      )}
    >
      <span aria-hidden className="relative flex h-2 w-2">
        {resolved === 'available' ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60 motion-reduce:animate-none" />
        ) : null}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            resolved === 'available'
              ? 'bg-emerald-400'
              : resolved === 'limited'
                ? 'bg-amber-400'
                : 'bg-white/40',
          )}
        />
      </span>
      <span className="font-[family-name:var(--font-space-grotesk)] tracking-wide">{text}</span>
    </span>
  )
}
