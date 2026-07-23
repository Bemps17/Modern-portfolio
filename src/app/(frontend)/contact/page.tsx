import type { Metadata } from 'next'

import { ContactForm } from '@/components/sections/ContactForm'
import { Container } from '@/components/ui/Container'
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
    <Container className="py-16">
      <div className="readable-surface-strong max-w-2xl rounded-3xl p-6 sm:p-8">
        <SectionTitle
          eyebrow="Contact"
          subtitle={settings?.email ? `Ou écrivez directement à ${settings.email}` : undefined}
          title="Parlons de votre projet"
        />
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </Container>
  )
}
