'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { FloatingOrb } from '@/components/motion/FloatingOrb'
import { Magnetic } from '@/components/motion/Magnetic'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'

type ContactCTAProps = {
  location?: string | null
  email?: string | null
}

export function ContactCTA({ location, email }: ContactCTAProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="px-6 pb-20 xl:px-16">
      <FadeInWhenVisible>
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-8 sm:p-10"
          whileHover={reduceMotion ? undefined : { borderColor: 'rgba(255,107,26,0.35)' }}
        >
          <FloatingOrb className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--accent)]/25 blur-3xl" />
          <FloatingOrb
            className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-[var(--accent-secondary)]/20 blur-3xl"
            delay={2.2}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <SectionTitle
                subtitle={
                  location?.trim() ||
                  'Un projet, une collab, une opportunité — parlons-en clairement.'
                }
                title="Travaillons ensemble"
              />
              {email ? (
                <a
                  className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm tracking-wide text-[var(--muted)] underline-offset-4 transition hover:text-white hover:underline"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              ) : null}
            </div>
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
        </motion.div>
      </FadeInWhenVisible>
    </section>
  )
}
