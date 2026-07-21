import { cn } from '@/lib/utils'

type GlassCardProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}

export function GlassCard({ children, className, as: Tag = 'div' }: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 hover:border-[color:var(--accent)]/30',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl bg-gradient-to-b from-white/[0.05] via-transparent to-transparent"
      />
      {children}
    </Tag>
  )
}
