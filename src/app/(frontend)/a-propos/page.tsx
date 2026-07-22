import type { Metadata } from 'next'
import Image from 'next/image'

import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { SkillBadgeList } from '@/components/sections/SkillBadgeList'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getExperiences, getSiteSettingsContent, getSkills } from '@/lib/content'
import { JsonLd, personJsonLd } from '@/lib/json-ld'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { SITE_IMAGES } from '@/lib/site-images'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent()
  return {
    title: 'À propos',
    description: settings?.aboutIntro || settings?.tagline || 'À propos',
    alternates: { canonical: `${getSiteUrl()}/a-propos` },
  }
}

export default async function AboutPage() {
  const [settings, experiences, skills] = await Promise.all([
    getSiteSettingsContent(),
    getExperiences(),
    getSkills(),
  ])

  const portraitSrc = resolveMediaUrl(settings?.avatar) || SITE_IMAGES.profile
  const portraitAlt =
    (isMedia(settings?.avatar) ? settings.avatar.alt : null) ||
    (settings?.siteName ? `Portrait de ${settings.siteName}` : 'Portrait')

  const jsonLd = personJsonLd({
    name: settings?.siteName,
    email: settings?.email,
    description: settings?.aboutIntro || settings?.tagline,
    url: getSiteUrl(),
    sameAs: (settings?.socialLinks || []).map((link) => link.url).filter(Boolean) as string[],
    image: portraitSrc.startsWith('http') ? portraitSrc : `${getSiteUrl()}${portraitSrc}`,
  })

  return (
    <Container className="space-y-16 py-16">
      <JsonLd data={jsonLd} />
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <SectionTitle
            eyebrow="Profil"
            subtitle={settings?.tagline || undefined}
            title={settings?.siteName || 'À propos'}
          />
          {settings?.aboutIntro ? <p className="max-w-2xl text-lg text-[var(--muted)]">{settings.aboutIntro}</p> : null}
          <p className="max-w-2xl text-base text-[var(--muted)]">
            Mon parcours est atypique, et c&apos;est ma plus grande force. Après plus de 10 ans dans le commerce et la
            logistique, j&apos;ai pivoté vers le numérique. Cette expérience m&apos;a appris la rigueur, la gestion de
            projet et l&apos;importance de la relation client.
          </p>
        </div>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-[color:var(--accent)]/20 lg:mx-0">
          <Image
            alt={portraitAlt}
            className="object-cover object-top"
            fill
            sizes="280px"
            src={portraitSrc}
          />
        </div>
      </section>
      <section>
        <SectionTitle title="Parcours" />
        <ExperienceTimeline experiences={experiences} />
      </section>
      <section>
        <SectionTitle title="Compétences" />
        <SkillBadgeList skills={skills} />
      </section>
    </Container>
  )
}
