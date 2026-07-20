import { cn } from '@/lib/utils'

type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--muted)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
