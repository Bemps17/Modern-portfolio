'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { cn } from '@/lib/utils'
import type { Experience } from '@/payload-types'

type EarlyCareerAccordionProps = {
  experiences: Experience[]
}

/** Accordéon pour les premières expériences (parcours ancien). */
export function EarlyCareerAccordion({ experiences }: EarlyCareerAccordionProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  if (!experiences.length) return null

  return (
    <FadeInWhenVisible>
      <ReadableSurface as="div" className="relative overflow-hidden">
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="relative flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <div className="max-w-2xl space-y-2">
            <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.18em] text-[var(--accent-soft)] uppercase">
              2001 — 2013
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold sm:text-3xl">
              Premières expériences
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {open
                ? 'Commercial B2B, VRP et missions terrain — le détail.'
                : 'Parcours commercial et missions terrain (déplier pour voir).'}
            </p>
          </div>
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--glass)] transition',
              open && 'border-[color:var(--accent)]/40 bg-[var(--accent-glow)]',
            )}
          >
            <ChevronDown
              className={cn('h-5 w-5 text-[var(--accent-soft)] transition-transform', open && 'rotate-180')}
            />
          </span>
        </button>

        <div
          className={cn(
            'relative grid transition-[grid-template-rows,opacity] duration-300 ease-out',
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          id={panelId}
        >
          <div className="overflow-hidden">
            <div className="mt-8 border-t border-[color:var(--border-subtle)] pt-8">
              <ExperienceTimeline experiences={experiences} />
            </div>
          </div>
        </div>
      </ReadableSurface>
    </FadeInWhenVisible>
  )
}
