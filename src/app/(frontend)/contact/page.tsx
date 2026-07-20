import type { Metadata } from 'next'

import { ContactForm } from '@/components/sections/ContactForm'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getSiteSettingsContent } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent()

  return {
    title: 'Contact',
    description: settings?.tagline
      ? `Contactez ${settings.siteName} — ${settings.tagline}`
      : `Contactez ${settings?.siteName || 'moi'}.`,
    openGraph: {
      title: `Contact — ${settings?.siteName || 'Portfolio'}`,
      description: settings?.tagline || undefined,
      type: 'website',
    },
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettingsContent()

  return (
    <Container className="py-16">
      <SectionTitle
        eyebrow="Contact"
        subtitle={settings?.email ? `Ou écrivez directement à ${settings.email}` : undefined}
        title="Parlons de votre projet"
      />
      <div className="max-w-xl">
        <ContactForm />
      </div>
    </Container>
  )
}
