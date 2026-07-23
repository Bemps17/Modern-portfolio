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
import { SITE_IMAGES } from '@/lib/site-images'

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
  const portraitSrc = avatarUrl?.trim() || SITE_IMAGES.profile
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

      <div
        className="absolute inset-y-0 right-0 hidden w-[58%] lg:block"
        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <Breathing className="relative h-full w-full">
          <Image
            alt={portraitAlt}
            className="object-cover object-top"
            data-cursor="view"
            fill
            priority
            sizes="58vw"
            src={portraitSrc}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--background)]/80"
          />
        </Breathing>
      </div>

      <div className="relative z-10 flex w-full flex-col justify-center py-20 lg:min-h-[100dvh] lg:w-[42%]">
        <Container>
          <ReadableSurface strong>
            <motion.div
              className="mb-6 flex flex-wrap items-center gap-3"
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

            <EditorialTitle as="h1" bleed className="mb-5" text={siteName} when="mount" />
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
        </Container>

        <Container className="mt-8 lg:hidden">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReadableSurface className="overflow-hidden p-0">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  alt={portraitAlt}
                  className="object-cover object-top"
                  fill
                  sizes="90vw"
                  src={portraitSrc}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                />
              </div>
            </ReadableSurface>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}
