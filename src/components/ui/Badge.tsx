import { cn } from '@/lib/utils'

type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-[color:var(--border)] bg-[var(--surface-glass)] px-2.5 py-1 font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--foreground-secondary)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}
