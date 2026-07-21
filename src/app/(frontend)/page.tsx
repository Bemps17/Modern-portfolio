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
import { JsonLd, personJsonLd, websiteJsonLd } from '@/lib/json-ld'
import { resolveMediaUrl } from '@/lib/media'
import { getSiteUrl } from '@/lib/site-url'
import type { Experience } from '@/payload-types'

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

  const og = resolveMediaUrl(seo?.ogImage) || undefined

  return {
    title: seo?.defaultTitle || settings?.siteName || 'Portfolio',
    description: seo?.defaultDescription || settings?.tagline || undefined,
    alternates: { canonical: getSiteUrl() + '/' },
    openGraph: {
      title: seo?.defaultTitle || settings?.siteName || 'Portfolio',
      description: seo?.defaultDescription || settings?.tagline || undefined,
      url: getSiteUrl() + '/',
      images: og ? [{ url: og }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.defaultTitle || settings?.siteName || 'Portfolio',
      description: seo?.defaultDescription || settings?.tagline || undefined,
      images: og ? [og] : undefined,
    },
  }
}

export default async function HomePage() {
  const [settings, seo, featured, allProjects, experiences, skills] = await Promise.all([
    getSiteSettingsContent(),
    getSeoDefaultsContent(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getExperiences(),
    getSkills(),
  ])

  const siteName = settings?.siteName || 'Portfolio'
  const tagline = settings?.tagline || 'Créateur digital'
  const aboutIntro = settings?.aboutIntro
  const techItems = skills.map((skill) => skill.name)
  const siteUrl = getSiteUrl()
  const sameAs = (settings?.socialLinks || [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url))

  return (
    <BootSequence>
      <JsonLd
        data={websiteJsonLd({
          name: siteName,
          url: siteUrl,
          description: seo?.defaultDescription || tagline,
        })}
      />
      <JsonLd
        data={personJsonLd({
          name: siteName,
          email: settings?.email,
          description: aboutIntro || tagline,
          url: siteUrl,
          sameAs,
        })}
      />
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
        <SectionTitle
          editorial
          eyebrow="Portfolio"
          subtitle="Une sélection de réalisations récentes."
          title="Projets à la une"
        />
        <ProjectGrid breatheFeatured layoutMode="masonry" projects={featured} />
        <div className="mt-10">
          <Button href="/projets" variant="glass">
            Tous les projets
          </Button>
        </div>
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
