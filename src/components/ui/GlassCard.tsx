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
        'rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
