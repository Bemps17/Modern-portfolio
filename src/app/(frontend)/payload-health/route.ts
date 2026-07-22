import { NextResponse } from 'next/server'

import { isPayloadConfigured } from '@/lib/payload-env'
import { SITE_VERSION } from '@/lib/site-version'

export const dynamic = 'force-dynamic'

/** Diagnostic public (sans secrets) — vérifier la config Payload sur Vercel. */
export async function GET() {
  const hasSecret = Boolean(process.env.PAYLOAD_SECRET?.trim())
  const hasDatabase = Boolean(process.env.DATABASE_URI?.trim())
  const configured = isPayloadConfigured()

  return NextResponse.json({
    ok: configured,
    version: SITE_VERSION,
    payload: {
      configured,
      hasSecret,
      hasDatabase,
    },
    hint: configured
      ? 'Payload configuré — /admin et /api/users/login devraient fonctionner.'
      : 'Ajouter PAYLOAD_SECRET et DATABASE_URI sur Vercel (Production + Preview), puis redeploy.',
  })
}
