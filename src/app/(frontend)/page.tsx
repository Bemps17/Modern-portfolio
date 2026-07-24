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
import { buildPageMetadata } from '@/lib/seo-metadata'
import { getSiteUrl } from '@/lib/site-url'
import { getTechnicalSkills } from '@/lib/skills'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])

  return buildPageMetadata(seo, settings, { path: '/' })
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
  const avatarUrl = resolveMediaUrl(settings?.avatar) || null
  const avatarAlt = isMedia(settings?.avatar) ? settings.avatar.alt : null
  const techItems = getTechnicalSkills(skills).map((skill) => skill.name)
  const siteUrl = getSiteUrl()
  const sameAs = (settings?.socialLinks || [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url))
  const schemaName = seo?.schemaAuthorName?.trim() || siteName
  const showWebsiteSchema = seo?.enableWebsiteJsonLd !== false
  const showPersonSchema = seo?.enablePersonJsonLd !== false

  const availability = (settings?.availability ?? 'available') as AvailabilityStatus

  const spotlight = featured.slice(0, 5)

  return (
    <BootSequence>
      {showWebsiteSchema ? (
        <JsonLd
          data={websiteJsonLd({
            name: siteName,
            url: siteUrl,
            description: seo?.defaultDescription || tagline,
          })}
        />
      ) : null}
      {showPersonSchema ? (
        <JsonLd
          data={personJsonLd({
            name: schemaName,
            email: settings?.email,
            description: aboutIntro || tagline,
            url: siteUrl,
            sameAs,
            image: avatarUrl
              ? avatarUrl.startsWith('http')
                ? avatarUrl
                : `${siteUrl}${avatarUrl}`
              : undefined,
          })}
        />
      ) : null}
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
