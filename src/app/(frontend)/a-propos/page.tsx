import type { Metadata } from 'next'

import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { SkillBadgeList } from '@/components/sections/SkillBadgeList'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  return {
    title: 'À propos',
    description: settings?.aboutIntro || settings?.tagline || 'À propos',
  }
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const [settings, experiences, skills] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
    payload.find({ collection: 'experiences', sort: '-dateStart', limit: 50 }),
    payload.find({ collection: 'skills', sort: 'name', limit: 100, depth: 1 }),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings?.siteName,
    email: settings?.email,
    description: settings?.aboutIntro || settings?.tagline,
  }

  return (
    <Container className="space-y-16 py-16">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <section>
        <SectionTitle
          eyebrow="Profil"
          subtitle={settings?.tagline || undefined}
          title={settings?.siteName || 'À propos'}
        />
        {settings?.aboutIntro ? <p className="max-w-2xl text-lg text-[var(--muted)]">{settings.aboutIntro}</p> : null}
      </section>
      <section>
        <SectionTitle title="Parcours" />
        <ExperienceTimeline experiences={experiences.docs} />
      </section>
      <section>
        <SectionTitle title="Compétences" />
        <SkillBadgeList skills={skills.docs} />
      </section>
    </Container>
  )
}
