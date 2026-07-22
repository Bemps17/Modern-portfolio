import { NextResponse } from 'next/server'

import {
  getDatabaseUri,
  getPayloadSecret,
  isPayloadConfigured,
} from '@/lib/payload-env'
import { SITE_VERSION } from '@/lib/site-version'

export const dynamic = 'force-dynamic'

/** Diagnostic public (sans secrets) — vérifier la config Payload sur Vercel. */
export async function GET() {
  const secret = getPayloadSecret()
  const databaseUri = getDatabaseUri()
  const configured = isPayloadConfigured()

  return NextResponse.json({
    ok: configured,
    version: SITE_VERSION,
    payload: {
      configured,
      hasSecret: Boolean(secret),
      hasDatabase: Boolean(databaseUri),
      databaseSource: process.env.DATABASE_URI?.trim()
        ? 'DATABASE_URI'
        : process.env.DATABASE_URL?.trim()
          ? 'DATABASE_URL'
          : process.env.POSTGRES_URL?.trim()
            ? 'POSTGRES_URL'
            : process.env.POSTGRES_PRISMA_URL?.trim()
              ? 'POSTGRES_PRISMA_URL'
              : null,
    },
    setupUrl: configured ? null : '/setup-admin',
    hint: configured
      ? 'Payload configuré — /admin et /api/users/login devraient fonctionner.'
      : 'Ouvrir /setup-admin pour configurer PAYLOAD_SECRET + DATABASE_URI sur Vercel, ou les ajouter manuellement (Production + Preview) puis redeploy.',
  })
}
