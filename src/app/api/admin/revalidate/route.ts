import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { isPayloadConfigured } from '@/lib/payload-env'
import { revalidatePublicSite } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

/**
 * Actualise le cache Next des pages publiques.
 * Réservé aux utilisateurs authentifiés Payload (cookie admin).
 */
export async function POST() {
  if (!isPayloadConfigured()) {
    return NextResponse.json(
      { ok: false, message: 'CMS non configuré (mode démo).' },
      { status: 503 },
    )
  }

  try {
    const headers = await getHeaders()
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ ok: false, message: 'Non autorisé.' }, { status: 401 })
    }

    revalidatePublicSite()

    return NextResponse.json({
      ok: true,
      message: 'Site actualisé — le front public reflète maintenant le contenu CMS.',
      at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[admin/revalidate]', error)
    return NextResponse.json(
      { ok: false, message: 'Échec de l’actualisation du cache.' },
      { status: 500 },
    )
  }
}
