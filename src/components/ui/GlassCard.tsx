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
        'readable-surface glass-shine relative overflow-hidden rounded-2xl transition-colors duration-300 hover:border-[color:var(--accent)]/30',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
