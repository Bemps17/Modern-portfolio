import Image from 'next/image'

import { Breathing } from '@/components/motion/Breathing'
import { RevealText } from '@/components/motion/RevealText'
import { EditorialTitle } from '@/components/ui/EditorialTitle'
import { Button } from '@/components/ui/Button'
import { SITE_IMAGES } from '@/lib/site-images'

type HeroProps = {
  siteName: string
  tagline: string
  aboutIntro?: string | null
  /** URL portrait CMS (Site Settings → avatar), sinon fallback brand. */
  avatarUrl?: string | null
  avatarAlt?: string | null
}

export function Hero({ siteName, tagline, aboutIntro, avatarUrl, avatarAlt }: HeroProps) {
  const portraitSrc = avatarUrl?.trim() || SITE_IMAGES.profile
  const portraitAlt = avatarAlt?.trim() || `Portrait de ${siteName}`

  return (
    <section className="relative min-h-[100dvh] overflow-hidden border-b border-white/10">
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

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col justify-center px-6 py-24 lg:w-[42%] lg:px-10 xl:px-16">
        <EditorialTitle as="h1" bleed className="mb-5" text={siteName} />
        <RevealText
          as="p"
          className="max-w-xl text-xl text-balance text-white/90 sm:text-2xl"
          delay={0.15}
          text={tagline}
        />
        {aboutIntro ? (
          <RevealText
            as="p"
            className="mt-5 max-w-lg text-base text-[var(--muted)] sm:text-lg"
            delay={0.28}
            text={aboutIntro}
          />
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/projets">Voir mes projets</Button>
          <Button href="/contact" variant="glass">
            Me contacter
          </Button>
        </div>
      </div>

      <div className="relative mx-6 mb-10 aspect-[3/4] overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] backdrop-blur-xl lg:hidden">
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
    </section>
  )
}
