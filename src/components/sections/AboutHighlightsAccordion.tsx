'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

import { FloatingOrb } from '@/components/motion/FloatingOrb'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { cn } from '@/lib/utils'

export type WhyMePoint = {
  title: string
  description?: string | null
  id?: string | number | null
}

type WhyMeAccordionProps = {
  whyMePoints: WhyMePoint[]
}

/** CTA accordéon « Pourquoi moi ? » — compétences hors de ce composant. */
export function AboutHighlightsAccordion({ whyMePoints }: WhyMeAccordionProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  if (!whyMePoints.length) return null

  return (
    <FadeInWhenVisible>
      <ReadableSurface as="div" className="relative overflow-hidden" strong>
        <FloatingOrb className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--accent)]/25 blur-3xl" />
        <FloatingOrb
          className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-[var(--accent-secondary)]/20 blur-3xl"
          delay={2.2}
        />

        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="relative flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <div className="max-w-2xl space-y-2">
            <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.18em] text-[var(--accent-soft)] uppercase">
              Différenciation
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold sm:text-3xl">
              Pourquoi moi ?
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {open
                ? 'Polyvalence, vision 360° et disponibilité — le détail.'
                : 'Découvrir ce qui me différencie.'}
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
            <div className="mt-8 space-y-8 border-t border-[color:var(--border-subtle)] pt-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {whyMePoints.map((point, index) => (
                  <li
                    className="rounded-xl border border-[color:var(--border-subtle)] bg-[var(--glass)] p-4"
                    key={point.id ?? `${point.title}-${index}`}
                  >
                    <p className="font-[family-name:var(--font-syne)] text-lg font-semibold">
                      {point.title}
                      {point.description?.trim() ? (
                        <span className="font-normal text-[var(--accent-soft)]"> — {point.description}</span>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <Button href="/contact">Me contacter</Button>
                </Magnetic>
                <Magnetic strength={12}>
                  <Button href="/projets" variant="glass">
                    Voir les projets
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </ReadableSurface>
    </FadeInWhenVisible>
  )
}
