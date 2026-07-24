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

  process.env.PAYLOAD_DB_PUSH = 'true'

  console.log('[db:push] Synchronisation du schéma Payload…')
  await getPayload({ config })
  console.log('[db:push] Schéma synchronisé.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[db:push] Échec:', error)
    process.exit(1)
  })
