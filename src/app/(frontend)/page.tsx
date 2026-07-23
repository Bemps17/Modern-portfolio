import type { Metadata } from 'next'

import { BootSequence } from '@/components/motion/BootSequence'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { Hero } from '@/components/sections/Hero'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { StarshipCutaway } from '@/components/sections/StarshipCutaway'
import { TechMarquee } from '@/components/sections/TechMarquee'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import type { AvailabilityStatus } from '@/components/ui/AvailabilityBadge'
import {
  getFeaturedProjects,
  getSeoDefaultsContent,
  getSiteSettingsContent,
  getSkills,
} from '@/lib/content'
import { JsonLd, personJsonLd, websiteJsonLd } from '@/lib/json-ld'
import { resolveMediaUrl, isMedia } from '@/lib/media'
import { SITE_IMAGES } from '@/lib/site-images'
import { getSiteUrl } from '@/lib/site-url'
import { getTechnicalSkills } from '@/lib/skills'

export const revalidate = 3600

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
      url: getSiteUrl(),
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
  const [settings, seo, featured, skills] = await Promise.all([
    getSiteSettingsContent(),
    getSeoDefaultsContent(),
    getFeaturedProjects(),
    getSkills(),
  ])

  const siteName = settings?.siteName || 'Portfolio'
  const tagline = settings?.tagline || 'Créateur digital'
  const aboutIntro = settings?.aboutIntro
  const avatarUrl = resolveMediaUrl(settings?.avatar) || SITE_IMAGES.profile
  const avatarAlt = isMedia(settings?.avatar) ? settings.avatar.alt : null
  const techItems = getTechnicalSkills(skills).map((skill) => skill.name)
  const siteUrl = getSiteUrl()
  const sameAs = (settings?.socialLinks || [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url))

  const availability = (settings?.availability ?? 'available') as AvailabilityStatus

  const spotlight = featured.slice(0, 5)

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
          image: avatarUrl.startsWith('http') ? avatarUrl : `${siteUrl}${avatarUrl}`,
        })}
      />
      <Hero
        aboutIntro={aboutIntro}
        availability={availability}
        availabilityLabel={settings?.availabilityLabel}
        avatarAlt={avatarAlt}
        avatarUrl={avatarUrl}
        location={settings?.location}
        siteName={siteName}
        tagline={tagline}
      />
      <TechMarquee items={techItems} maxItems={8} />
      <StarshipCutaway subtitle={tagline} />
      <Container className="py-10 sm:py-12" id="projets-une">
        <ReadableSurface strong>
          <SectionTitle
            editorial
            eyebrow="Portfolio"
            subtitle="3 à 5 réalisations choisies — problème, stack, résultat."
            title="Projets à la une"
          />
          <ProjectGrid
            breatheFeatured
            layoutMode="masonry"
            limit={5}
            projects={spotlight}
            showIndex
          />
          <div className="mt-10">
            <Button href="/projets" variant="glass">
              Tous les projets
            </Button>
          </div>
        </ReadableSurface>
      </Container>
      <ContactCTA email={settings?.email} location={settings?.location} />
    </BootSequence>
  )
}
