import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'

type HeroProps = {
  siteName: string
  tagline: string
  aboutIntro?: string | null
}

export function Hero({ siteName, tagline, aboutIntro }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(153,27,27,0.2),transparent_40%),radial-gradient(circle_at_20%_25%,rgba(249,115,22,0.2),transparent_42%)]"
      />
      <Container className="relative grid min-h-[78vh] items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <FadeInWhenVisible>
          <p className="mb-4 font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {siteName}
          </p>
          <h1 className="max-w-3xl text-2xl text-balance text-white/90 sm:text-3xl">{tagline}</h1>
          {aboutIntro ? <p className="mt-5 max-w-2xl text-base text-[var(--muted)] sm:text-lg">{aboutIntro}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projets">Voir mes projets</Button>
            <Button href="/contact" variant="glass">
              Me contacter
            </Button>
          </div>
        </FadeInWhenVisible>
        <FadeInWhenVisible className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-[color:var(--accent)]/20">
            <Image
              alt={`Portrait de ${siteName}`}
              className="object-cover object-top"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              src="/images/bertrand-portrait.jpg"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"
            />
          </div>
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
