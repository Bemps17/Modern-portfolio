import { cn } from '@/lib/utils'

type ReadableSurfaceProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'footer'
  /** Surface plus opaque — texte long, hero, footer */
  strong?: boolean
}

export function ReadableSurface({
  children,
  className,
  as: Tag = 'div',
  strong = false,
}: ReadableSurfaceProps) {
  return (
    <Tag className={cn(strong ? 'readable-surface-strong' : 'readable-surface', className)}>
      {children}
    </Tag>
  )
}
