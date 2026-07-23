import type { Metadata } from 'next'

import { ContactForm } from '@/components/sections/ContactForm'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getSiteSettingsContent } from '@/lib/content'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent()

  return {
    title: 'Contact',
    description: settings?.tagline
      ? `Contactez ${settings.siteName} — ${settings.tagline}`
      : `Contactez ${settings?.siteName || 'moi'}.`,
    alternates: { canonical: `${getSiteUrl()}/contact` },
    openGraph: {
      title: `Contact — ${settings?.siteName || 'Portfolio'}`,
      description: settings?.tagline || undefined,
      url: `${getSiteUrl()}/contact`,
      type: 'website',
    },
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettingsContent()

  return (
    <Container className="py-12 sm:py-16">
      <ReadableSurface bleed={false} className="mx-auto max-w-2xl" strong>
        <SectionTitle
          eyebrow="Contact"
          subtitle={settings?.email ? `Ou écrivez directement à ${settings.email}` : undefined}
          title="Parlons de votre projet"
        />
        <ContactForm />
      </ReadableSurface>
    </Container>
  )
}
