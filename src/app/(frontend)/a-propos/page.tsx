import type { Metadata } from 'next'
import Image from 'next/image'

import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { SkillBadgeList } from '@/components/sections/SkillBadgeList'
import { SoftSkillsStrip } from '@/components/sections/SoftSkillsStrip'
import { StatsStrip } from '@/components/sections/StatsStrip'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  getExperiences,
  getPublishedProjects,
  getSiteSettingsContent,
  getSkills,
} from '@/lib/content'
import { JsonLd, personJsonLd } from '@/lib/json-ld'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { SITE_IMAGES } from '@/lib/site-images'
import { getSiteUrl } from '@/lib/site-url'
import { getSoftSkills, getTechnicalSkills } from '@/lib/skills'
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
  const settings = await getSiteSettingsContent()
  return {
    title: 'À propos',
    description: settings?.aboutIntro || settings?.tagline || 'À propos',
    alternates: { canonical: `${getSiteUrl()}/a-propos` },
  }
}

export default async function AboutPage() {
  const [settings, experiences, skills, projects] = await Promise.all([
    getSiteSettingsContent(),
    getExperiences(),
    getSkills(),
    getPublishedProjects(),
  ])

  const portraitSrc = resolveMediaUrl(settings?.avatar) || SITE_IMAGES.profile
  const portraitAlt =
    (isMedia(settings?.avatar) ? settings.avatar.alt : null) ||
    (settings?.siteName ? `Portrait de ${settings.siteName}` : 'Portrait')

  const softSkills = getSoftSkills(skills)
  const technicalSkills = getTechnicalSkills(skills)

  const jsonLd = personJsonLd({
    name: settings?.siteName,
    email: settings?.email,
    description: settings?.aboutIntro || settings?.tagline,
    url: getSiteUrl(),
    sameAs: (settings?.socialLinks || []).map((link) => link.url).filter(Boolean) as string[],
    image: portraitSrc.startsWith('http') ? portraitSrc : `${getSiteUrl()}${portraitSrc}`,
  })

  return (
    <Container className="space-y-10 py-12 sm:space-y-16 sm:py-16">
      <JsonLd data={jsonLd} />
      {softSkills.length ? (
        <SoftSkillsStrip className="pb-2 sm:pb-4" skills={softSkills} />
      ) : null}
      <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
        <ReadableSurface className="space-y-5" strong>
          {settings?.location?.trim() ? (
            <span className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              {settings.location}
            </span>
          ) : null}
          <SectionTitle
            eyebrow="Profil"
            subtitle={settings?.tagline || undefined}
            title={settings?.siteName || 'À propos'}
          />
          {settings?.aboutIntro ? (
            <p className="max-w-2xl text-lg text-[var(--foreground-secondary)]">{settings.aboutIntro}</p>
          ) : null}
          {settings?.aboutBody ? (
            <p className="max-w-2xl whitespace-pre-line text-base text-[var(--foreground-secondary)]">
              {settings.aboutBody}
            </p>
          ) : null}
        </ReadableSurface>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-[color:var(--accent)]/20 lg:mx-0">
          <Image
            alt={portraitAlt}
            className="object-cover object-top"
            fill
            sizes="280px"
            src={portraitSrc}
          />
        </div>
      </section>
      <ReadableSurface as="section">
        <SectionTitle
          eyebrow="En chiffres"
          subtitle="Un aperçu rapide du parcours et de la production."
          title="Preuves concrètes"
        />
        <StatsStrip
          projectCount={projects.length}
          skillCount={skills.length}
          yearsExperience={yearsFromExperiences(experiences)}
        />
      </ReadableSurface>
      <ReadableSurface as="section">
        <SectionTitle title="Parcours" />
        <ExperienceTimeline experiences={experiences} />
      </ReadableSurface>
      <ReadableSurface as="section">
        <SectionTitle
          subtitle="Les outils avec lesquels je livre le plus souvent."
          title="Compétences"
        />
        <SkillBadgeList skills={technicalSkills} />
      </ReadableSurface>
    </Container>
  )
}
