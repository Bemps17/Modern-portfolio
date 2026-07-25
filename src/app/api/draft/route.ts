import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadSecret } from '@/lib/payload-env'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  if (!path || !path.startsWith('/')) {
    return new Response('Paramètre path invalide', { status: 400 })
  }

  const expectedSecret = process.env.PREVIEW_SECRET?.trim() || getPayloadSecret()
  if (!secret || secret !== expectedSecret) {
    return new Response('Non autorisé', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
