'use server'

import { headers } from 'next/headers'

import { contactSchema } from '@/lib/contactSchema'
import { checkContactRateLimit } from '@/lib/contact-rate-limit'
import { getPayloadClient } from '@/lib/payload'

export type ContactActionState = {
  ok: boolean
  message: string
}

function resolveClientKey(headerStore: Awaited<ReturnType<typeof headers>>): string {
  const forwarded = headerStore.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return headerStore.get('x-real-ip') || 'unknown'
}

export async function submitContact(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const headerStore = await headers()
  const rateLimit = checkContactRateLimit(resolveClientKey(headerStore))
  if (!rateLimit.allowed) {
    return {
      ok: false,
      message: `Trop de tentatives. Réessayez dans ${rateLimit.retryAfterSeconds} secondes.`,
    }
  }

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

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'form-submissions',
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        inboxStatus: 'new',
      },
    })
  } catch (error) {
    console.error('[contact] Échec de l’enregistrement du message', error)
    return {
      ok: false,
      message: 'Une erreur est survenue lors de l’envoi. Réessayez plus tard.',
    }
  }

  return { ok: true, message: 'Message envoyé. Merci !' }
}
