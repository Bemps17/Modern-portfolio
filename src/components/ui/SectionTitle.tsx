'use client'

import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Layers,
  Mail,
  MessageCircle,
  NotebookPen,
  Rocket,
  Scale,
  Shield,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { RevealText } from '@/components/motion/RevealText'
import { cn } from '@/lib/utils'

const SECTION_ICONS = {
  portfolio: FolderKanban,
  profile: UserRound,
  stats: Sparkles,
  journey: Briefcase,
  education: GraduationCap,
  skills: Layers,
  contact: MessageCircle,
  mail: Mail,
  method: Rocket,
  legal: Scale,
  privacy: Shield,
  journal: NotebookPen,
} as const satisfies Record<string, LucideIcon>

export type SectionIconName = keyof typeof SECTION_ICONS

type SectionTitleProps = {
  title: string
  subtitle?: string
  className?: string
  eyebrow?: string
  editorial?: boolean
  icon?: SectionIconName
}

export function SectionTitle({
  title,
  subtitle,
  className,
  eyebrow,
  editorial = false,
  icon: iconName,
}: SectionTitleProps) {
  const Icon = iconName ? SECTION_ICONS[iconName] : null

  return (
    <div className={cn('mb-10 max-w-2xl', editorial && 'max-w-none', className)}>
      {(eyebrow || Icon) ? (
        <div className="mb-3 flex items-center gap-2.5">
          {Icon ? (
            <span aria-hidden className="section-title-icon inline-flex shrink-0">
              <Icon className="h-4 w-4 text-[var(--accent-soft)]" strokeWidth={2} />
            </span>
          ) : null}
          {eyebrow ? (
            <RevealText
              as="p"
              className="section-eyebrow font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--muted)] uppercase"
              text={eyebrow}
            />
          ) : null}
        </div>
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
          className="mt-3 max-w-2xl text-base text-[var(--foreground-secondary)] sm:text-lg"
          delay={0.2}
          text={subtitle}
        />
      ) : null}
    </div>
  )
}
