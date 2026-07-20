'use server'

import { Resend } from 'resend'

import { contactSchema } from '@/lib/contactSchema'
import { getPayloadClient } from '@/lib/payload'

export type ContactActionState = {
  ok: boolean
  message: string
}

export async function submitContact(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    website: formData.get('website') || undefined,
  })

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  if (parsed.data.website) {
    return { ok: true, message: 'Message envoyé.' }
  }

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'form-submissions',
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    },
  })

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL
  if (apiKey && to) {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      subject: `Nouveau message de ${parsed.data.name}`,
      replyTo: parsed.data.email,
      text: parsed.data.message,
    })
  }

  return { ok: true, message: 'Message envoyé. Merci !' }
}
