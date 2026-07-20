import type { Metadata } from 'next'

import { ContactForm } from '@/components/sections/ContactForm'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getSiteSettingsContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Envoyez un message.',
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
