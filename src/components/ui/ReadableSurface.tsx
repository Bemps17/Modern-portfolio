import { cn } from '@/lib/utils'

type ReadableSurfaceProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'footer'
  /** Surface plus opaque — texte long, hero, footer */
  strong?: boolean
  /** Compense le padding Container sur mobile → panneau plus large */
  bleed?: boolean
}

export function ReadableSurface({
  children,
  className,
  as: Tag = 'div',
  strong = false,
  bleed = true,
}: ReadableSurfaceProps) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden',
        strong ? 'readable-surface-strong' : 'readable-surface',
        'glass-panel glass-shine',
        bleed && 'glass-bleed-mobile',
        className,
      )}
    >
      <div className="relative z-[2]">{children}</div>
    </Tag>
  )
}
