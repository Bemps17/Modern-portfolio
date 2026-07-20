'use client'

import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { RevealText } from '@/components/motion/RevealText'
import { cn } from '@/lib/utils'

type SectionTitleProps = {
  title: string
  subtitle?: string
  className?: string
  eyebrow?: string
  editorial?: boolean
}

export function SectionTitle({ title, subtitle, className, eyebrow, editorial = false }: SectionTitleProps) {
  return (
    <div className={cn('mb-10 max-w-2xl', editorial && 'max-w-none', className)}>
      {eyebrow ? (
        <RevealText
          as="p"
          className="mb-3 font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--muted)] uppercase"
          text={eyebrow}
        />
      ) : null}
      {editorial ? (
        <EditorialTitle as="h2" bleed className="mb-3" text={title} />
      ) : (
        <RevealText
          as="h2"
          className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          delay={eyebrow ? 0.08 : 0}
          text={title}
        />
      )}
      {subtitle ? (
        <RevealText
          as="p"
          className="mt-3 max-w-2xl text-base text-[var(--muted)] sm:text-lg"
          delay={0.2}
          text={subtitle}
        />
      ) : null}
    </div>
  )
}
