import type { Metadata } from 'next'

import { Hero } from '@/components/sections/Hero'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { Button } from '@/components/ui/Button'
import { getFeaturedProjects, getSeoDefaultsContent, getSiteSettingsContent } from '@/lib/content'
import type { Media } from '@/payload-types'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])

  const og =
    seo?.ogImage && typeof seo.ogImage === 'object' ? (seo.ogImage as Media).url || undefined : undefined

  return {
    title: seo?.defaultTitle || settings?.siteName || 'Portfolio',
    description: seo?.defaultDescription || settings?.tagline || undefined,
    openGraph: {
      title: seo?.defaultTitle || settings?.siteName || 'Portfolio',
      description: seo?.defaultDescription || settings?.tagline || undefined,
      images: og ? [{ url: og }] : undefined,
    },
  }
}

export default async function HomePage() {
  const [settings, featured] = await Promise.all([getSiteSettingsContent(), getFeaturedProjects()])

  const siteName = settings?.siteName || 'Portfolio'
  const tagline = settings?.tagline || 'Créateur digital'
  const aboutIntro = settings?.aboutIntro

  return (
    <>
      <Hero aboutIntro={aboutIntro} siteName={siteName} tagline={tagline} />
      <Container className="py-20">
        <FadeInWhenVisible>
          <SectionTitle
            eyebrow="Portfolio"
            subtitle="Une sélection de réalisations récentes."
            title="Projets à la une"
          />
          <ProjectGrid projects={featured} />
          <div className="mt-10">
            <Button href="/projets" variant="glass">
              Tous les projets
            </Button>
          </div>
        </FadeInWhenVisible>
      </Container>
      <Container className="pb-20">
        <FadeInWhenVisible>
          <SectionTitle title="Travaillons ensemble" subtitle="Un projet en tête ? Écrivons-nous." />
          <Button href="/contact">Me contacter</Button>
        </FadeInWhenVisible>
      </Container>
    </>
  )
}
