import type { Metadata } from 'next'

import { ContactForm } from '@/components/sections/ContactForm'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Envoyez un message.',
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)

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
