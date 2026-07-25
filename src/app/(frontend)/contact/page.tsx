import type { Metadata } from 'next'

import { ContactForm } from '@/components/sections/ContactForm'
import { ContactLink } from '@/components/ui/ContactLink'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getSeoDefaultsContent, getSiteSettingsContent } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo-metadata'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])

  return buildPageMetadata(seo, settings, {
    title: 'Contact',
    description: settings?.tagline
      ? `Contactez ${settings.siteName} — ${settings.tagline}`
      : `Contactez ${settings?.siteName || 'moi'}.`,
    path: '/contact',
  })
}

export default async function ContactPage() {
  const settings = await getSiteSettingsContent()
  const subtitle =
    settings?.contactPageSubtitle?.trim() ||
    (settings?.email ? `Ou écrivez directement à ${settings.email}` : undefined)
  const showForm = settings?.enableContactForm !== false

  return (
    <Container className="py-12 sm:py-16">
      <ReadableSurface className="max-w-2xl" strong>
        <SectionTitle
          eyebrow="Contact"
          icon="mail"
          subtitle={subtitle}
          title="Parlons de votre projet"
        />
        <div className="mb-8 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
          {settings?.email ? <ContactLink type="email" value={settings.email} /> : null}
          {settings?.phone ? <ContactLink type="phone" value={settings.phone} /> : null}
        </div>
        {showForm ? <ContactForm /> : null}
      </ReadableSurface>
    </Container>
  )
}
