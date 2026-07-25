import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'
import Image from 'next/image'

import { AboutHighlightsAccordion } from '@/components/sections/AboutHighlightsAccordion'
import { CvActions } from '@/components/sections/CvActions'
import { EarlyCareerAccordion } from '@/components/sections/EarlyCareerAccordion'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { PersonalProjectsList } from '@/components/sections/PersonalProjectsList'
import { QualificationsList } from '@/components/sections/QualificationsList'
import { SkillBadgeList } from '@/components/sections/SkillBadgeList'
import { SkillGroupsList } from '@/components/sections/SkillGroupsList'
import { SoftSkillsStrip } from '@/components/sections/SoftSkillsStrip'
import { StatsStrip } from '@/components/sections/StatsStrip'
import { Container } from '@/components/ui/Container'
import { EmailContactLink, PhoneContactLink } from '@/components/ui/ContactLink'
import { IconLabel } from '@/components/ui/IconLabel'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  getExperiences,
  getPublishedProjects,
  getQualifications,
  getSeoDefaultsContent,
  getSiteSettingsContent,
  getSkills,
} from '@/lib/content'
import { JsonLd, personJsonLd } from '@/lib/json-ld'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo-metadata'
import { buildCvShareUrl } from '@/lib/cv/share-links'
import { getSiteUrl } from '@/lib/site-url'
import { getTechnicalSkills, resolveSoftSkills } from '@/lib/skills'
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

  return buildPageMetadata(seo, settings, {
    title: 'À propos',
    description: settings?.aboutIntro || settings?.tagline || 'À propos',
    path: '/a-propos',
  })
}

export default async function AboutPage() {
  const [settings, experiences, skills, projects, qualifications] = await Promise.all([
    getSiteSettingsContent(),
    getExperiences(),
    getSkills(),
    getPublishedProjects(),
    getQualifications(),
  ])

  const portraitSrc = resolveMediaUrl(settings?.avatar)
  const portraitAlt =
    (isMedia(settings?.avatar) ? settings.avatar.alt : null) ||
    (settings?.siteName ? `Portrait de ${settings.siteName}` : 'Portrait')

  const softSkills = resolveSoftSkills(skills)
  const technicalSkills = getTechnicalSkills(skills)
  const whyMePoints = settings?.whyMePoints ?? []
  const skillGroups = settings?.skillGroups ?? []
  const personalProjects = settings?.personalProjects ?? []
  const recentExperiences = experiences.filter((experience) => !experience.earlyCareer)
  const earlyExperiences = experiences.filter((experience) => experience.earlyCareer)

  const jsonLd = personJsonLd({
    name: settings?.siteName,
    email: settings?.email,
    description: settings?.aboutIntro || settings?.tagline,
    url: getSiteUrl(),
    sameAs: (settings?.socialLinks || []).map((link) => link.url).filter(Boolean) as string[],
    image: portraitSrc
      ? portraitSrc.startsWith('http')
        ? portraitSrc
        : `${getSiteUrl()}${portraitSrc}`
      : undefined,
  })

  return (
    <Container className="space-y-10 py-12 sm:space-y-16 sm:py-16">
      <JsonLd data={jsonLd} />
      <section
        className={
          portraitSrc
            ? 'grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10'
            : 'grid items-start gap-8'
        }
      >
        <ReadableSurface className="space-y-8" strong>
          <SoftSkillsStrip skills={softSkills} />
          <div className="space-y-5 border-t border-[color:var(--border-subtle)] pt-8">
            {settings?.location?.trim() ? (
              <IconLabel
                className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.14em] text-[var(--muted)] uppercase"
                icon={MapPin}
              >
                {settings.location}
              </IconLabel>
            ) : null}
            <SectionTitle
              eyebrow="Profil"
              icon="profile"
              subtitle={settings?.tagline || undefined}
              title={settings?.siteName || 'À propos'}
            />
            {(settings?.email || settings?.phone) && (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {settings?.email ? <EmailContactLink email={settings.email} size="sm" /> : null}
                {settings?.phone ? <PhoneContactLink phone={settings.phone} size="sm" /> : null}
              </div>
            )}
            {settings?.aboutIntro ? (
              <p className="max-w-2xl text-lg text-[var(--foreground-secondary)]">{settings.aboutIntro}</p>
            ) : null}
            {settings?.aboutHeadline?.trim() ? (
              <h3 className="max-w-2xl font-[family-name:var(--font-syne)] text-2xl font-semibold text-balance sm:text-3xl">
                {settings.aboutHeadline}
              </h3>
            ) : null}
            {settings?.aboutBody ? (
              <p className="max-w-2xl whitespace-pre-line text-base text-[var(--foreground-secondary)]">
                {settings.aboutBody}
              </p>
            ) : null}
            <CvActions
              fullName={settings?.siteName || 'Portfolio'}
              shareUrl={buildCvShareUrl(getSiteUrl())}
            />
          </div>
        </ReadableSurface>
        {portraitSrc ? (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-[color:var(--accent)]/20 lg:mx-0">
            <Image
              alt={portraitAlt}
              className="object-cover object-top"
              fill
              sizes="280px"
              src={portraitSrc}
            />
          </div>
        ) : null}
      </section>

      <AboutHighlightsAccordion whyMePoints={whyMePoints} />

      <ReadableSurface as="section">
        <SectionTitle
          eyebrow="En chiffres"
          icon="stats"
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
        <SectionTitle icon="journey" title="Parcours" />
        <ExperienceTimeline experiences={recentExperiences} />
      </ReadableSurface>

      <EarlyCareerAccordion experiences={earlyExperiences} />

      <ReadableSurface as="section">
        <SectionTitle
          icon="education"
          subtitle="Diplômes, certifications et bases académiques."
          title="Formation & certifications"
        />
        <QualificationsList qualifications={qualifications} />
      </ReadableSurface>

      {skillGroups.length ? (
        <ReadableSurface as="section">
          <SectionTitle
            icon="skills"
            subtitle={settings?.skillsSubtitle || 'Design, développement, commercial et relationnel.'}
            title={settings?.skillsTitle || 'Compétences clés'}
          />
          <SkillGroupsList groups={skillGroups} />
        </ReadableSurface>
      ) : null}

      {technicalSkills.length ? (
        <ReadableSurface as="section">
          <SectionTitle
            icon="skills"
            subtitle="Les outils avec lesquels je livre le plus souvent."
            title="Stack technique"
          />
          <SkillBadgeList skills={technicalSkills} />
        </ReadableSurface>
      ) : null}

      {personalProjects.length ? (
        <ReadableSurface as="section">
          <SectionTitle
            icon="portfolio"
            subtitle="Initiatives perso, veille et expérimentation."
            title="Projets personnels"
          />
          <PersonalProjectsList projects={personalProjects} />
        </ReadableSurface>
      ) : null}
    </Container>
  )
}
