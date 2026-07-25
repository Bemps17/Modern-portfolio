import type { LucideIcon } from 'lucide-react'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type IconLabelProps = {
  icon: LucideIcon
  children: ReactNode
  className?: string
  iconClassName?: string
  as?: 'span' | 'p' | 'div'
}

/** Ligne label + icône Lucide — repères visuels dans les sections. */
export function IconLabel({
  icon: Icon,
  children,
  className,
  iconClassName,
  as: Tag = 'span',
}: IconLabelProps) {
  return (
    <Tag className={cn('icon-label', className)}>
      <span aria-hidden className={cn('icon-label__icon', iconClassName)}>
        <Icon className="icon-label__glyph" strokeWidth={2} />
      </span>
      <span className="icon-label__text">{children}</span>
    </Tag>
  )
}
