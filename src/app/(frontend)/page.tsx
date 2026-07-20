import type { Metadata } from 'next'

import { BootSequence } from '@/components/motion/BootSequence'
import { SectionDivider } from '@/components/motion/RevealText'
import { Hero } from '@/components/sections/Hero'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { StatsStrip } from '@/components/sections/StatsStrip'
import { TechMarquee } from '@/components/sections/TechMarquee'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { Button } from '@/components/ui/Button'
import {
  getExperiences,
  getFeaturedProjects,
  getPublishedProjects,
  getSeoDefaultsContent,
  getSiteSettingsContent,
  getSkills,
} from '@/lib/content'
import type { Experience, Media } from '@/payload-types'

export const revalidate = 3600

function yearsFromExperiences(experiences: Experience[]): number {
  const years = experiences
    .map((experience) => experience.dateStart)
    .filter(Boolean)
    .map((date) => new Date(date).getFullYear())

  if (!years.length) return 10
  return new Date().getFullYear() - Math.min(...years)
}

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
  const [settings, featured, allProjects, experiences, skills] = await Promise.all([
    getSiteSettingsContent(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getExperiences(),
    getSkills(),
  ])

  const siteName = settings?.siteName || 'Portfolio'
  const tagline = settings?.tagline || 'Créateur digital'
  const aboutIntro = settings?.aboutIntro
  const techItems = skills.map((skill) => skill.name)

  return (
    <BootSequence>
      <Hero aboutIntro={aboutIntro} siteName={siteName} tagline={tagline} />
      <TechMarquee items={techItems} />
      <div className="px-6 py-16 xl:px-16">
        <FadeInWhenVisible>
          <SectionTitle
            editorial
            eyebrow="En chiffres"
            subtitle="Un aperçu rapide de mon parcours et de ma production."
            title="Ce que je fais"
          />
          <StatsStrip
            projectCount={allProjects.length}
            skillCount={skills.length}
            yearsExperience={yearsFromExperiences(experiences)}
          />
        </FadeInWhenVisible>
      </div>
      <SectionDivider />
      <div className="px-6 py-20 xl:px-16">
        <FadeInWhenVisible>
          <SectionTitle
            editorial
            eyebrow="Portfolio"
            subtitle="Une sélection de réalisations récentes."
            title="Projets à la une"
          />
          <ProjectGrid breatheFeatured enablePreview layoutMode="masonry" projects={featured} />
          <div className="mt-10">
            <Button href="/projets" variant="glass">
              Tous les projets
            </Button>
          </div>
        </FadeInWhenVisible>
      </div>
      <SectionDivider />
      <div className="px-6 pb-20 xl:px-16">
        <FadeInWhenVisible>
          <SectionTitle title="Travaillons ensemble" subtitle="Un projet en tête ? Écrivons-nous." />
          <Button href="/contact">Me contacter</Button>
        </FadeInWhenVisible>
      </div>
    </BootSequence>
  )
}
