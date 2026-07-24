'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

import { Breathing } from '@/components/motion/Breathing'
import { Magnetic } from '@/components/motion/Magnetic'
import { RevealText } from '@/components/motion/RevealText'
import { AvailabilityBadge, type AvailabilityStatus } from '@/components/ui/AvailabilityBadge'
import { Container } from '@/components/ui/Container'
import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { Button } from '@/components/ui/Button'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { cn } from '@/lib/utils'

/**
 * Masque progressif du portrait : invisible à gauche, pleinement visible à droite.
 * Crée l’effet "entremêlé" avec le bloc texte plutôt qu’une coupure verticale nette.
 */
const PORTRAIT_MASK = {
  maskImage: 'linear-gradient(to right, transparent 0%, transparent 25%, black 50%, black 100%)',
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, transparent 25%, black 50%, black 100%)',
}

type HeroProps = {
  siteName: string
  tagline: string
  aboutIntro?: string | null
  avatarUrl?: string | null
  avatarAlt?: string | null
  availability?: AvailabilityStatus | null
  availabilityLabel?: string | null
  location?: string | null
}

export function Hero({
  siteName,
  tagline,
  aboutIntro,
  avatarUrl,
  avatarAlt,
  availability,
  availabilityLabel,
  location,
}: HeroProps) {
  const portraitSrc = avatarUrl?.trim() || null
  const portraitAlt = avatarAlt?.trim() || `Portrait de ${siteName}`
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[100dvh] overflow-hidden border-b border-white/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,var(--accent-glow),transparent_45%),radial-gradient(ellipse_at_80%_0%,var(--accent-secondary-glow),transparent_40%)]"
      />
      {!reduceMotion ? (
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[var(--accent)]/20 blur-3xl"
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : null}

      {/* Portrait backdrop — desktop only, masked to blend into the text column */}
      <div
        className={cn(
          'absolute inset-y-0 right-0 hidden lg:block lg:w-[30%] xl:w-[28%]',
          !portraitSrc && 'hidden',
        )}
        style={PORTRAIT_MASK}
      >
        {portraitSrc ? (
          <Breathing className="relative h-full w-full opacity-90">
            <Image
              alt={portraitAlt}
              className="object-cover object-top"
              data-cursor="view"
              fill
              priority
              sizes="(max-width: 1280px) 30vw, 28vw"
              src={portraitSrc}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-[var(--background)]/30 to-[var(--background)]/70"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[var(--accent)]/5 mix-blend-overlay"
            />
          </Breathing>
        ) : null}
      </div>

      <div className="relative z-10 flex w-full flex-col justify-center py-20 lg:min-h-[100dvh]">
        <Container>
          <div className="lg:max-w-[70%] xl:max-w-[72%]">
            <ReadableSurface strong className="hero-readable-surface overflow-hidden p-4 sm:p-6 lg:p-10">
              <motion.div
                className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Unique badge disponibilité du site — uniquement ici. */}
                <AvailabilityBadge label={availabilityLabel} size="sm" status={availability} />
                {location?.trim() ? (
                  <span className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                    {location}
                  </span>
                ) : null}
              </motion.div>

              <EditorialTitle
                as="h1"
                bleed={false}
                className="mb-5 text-[clamp(1.75rem,6vw,2.5rem)] sm:text-[clamp(2.25rem,5.5vw,3.5rem)] lg:text-[clamp(2.25rem,4vw,3.5rem)] xl:text-[clamp(2.5rem,4vw,4rem)]"
                text={siteName}
                when="mount"
              />
              <RevealText
                as="p"
                className="max-w-xl text-xl text-balance text-[var(--foreground)] sm:text-2xl"
                delay={0.15}
                text={tagline}
                when="mount"
              />
              {aboutIntro ? (
                <RevealText
                  as="p"
                  className="mt-5 max-w-lg text-base text-[var(--foreground-secondary)] sm:text-lg"
                  delay={0.28}
                  text={aboutIntro}
                  when="mount"
                />
              ) : null}
              <motion.div
                className="mt-10 flex flex-wrap gap-3"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Magnetic>
                  <Button href="#projets-une">Voir mes projets</Button>
                </Magnetic>
                <Magnetic strength={12}>
                  <Button href="/contact" variant="glass">
                    Me contacter
                  </Button>
                </Magnetic>
              </motion.div>

            </ReadableSurface>
          </div>
        </Container>
      </div>
    </section>
  )
}
