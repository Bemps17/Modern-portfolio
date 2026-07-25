/**
 * Synchronise le schéma Payload Postgres (push).
 * - Local / manuel : `pnpm db:push` (PAYLOAD_DB_PUSH=true)
 * - Vercel build : auto si DATABASE_URI + PAYLOAD_SECRET présents (sauf PAYLOAD_DB_PUSH=false)
 */
import { getPayload } from 'payload'

import config from '../src/payload.config.js'
import { getDatabaseUri, getPayloadSecret } from '../src/lib/payload-env.js'

function shouldPushSchema(): boolean {
  if (process.env.PAYLOAD_DB_PUSH === 'false') return false
  if (process.env.PAYLOAD_DB_PUSH === 'true') return true
  if (process.env.VERCEL === '1' && getDatabaseUri() && getPayloadSecret()) return true
  return false
}

async function main() {
  if (!shouldPushSchema()) {
    console.log('[db:push] Ignoré (PAYLOAD_DB_PUSH=false ou env DB absents).')
    return
  }

  if (!getPayloadSecret() || !getDatabaseUri()) {
    console.error('[db:push] DATABASE_URI et PAYLOAD_SECRET requis.')
    process.exit(1)
  }

  // Payload n'exécute pushDevSchema que hors production (connect.ts).
  // Sur Vercel, NODE_ENV=production : forcer development le temps du push.
  const previousNodeEnv = process.env.NODE_ENV
  process.env.PAYLOAD_DB_PUSH = 'true'
  process.env.NODE_ENV = 'development'

  console.log('[db:push] Synchronisation du schéma Payload…')

  try {
    const payload = await getPayload({ config })
    // Sanity check : la table journal_posts doit exister après push.
    await payload.find({ collection: 'journal-posts', limit: 0, overrideAccess: true })
    console.log('[db:push] Schéma synchronisé.')
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = previousNodeEnv
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[db:push] Échec:', error)
    process.exit(1)
  })
