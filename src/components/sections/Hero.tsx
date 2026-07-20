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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.16),transparent_35%)]"
      />
      <Container className="relative flex min-h-[78vh] flex-col justify-center py-20">
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
      </Container>
    </section>
  )
}
