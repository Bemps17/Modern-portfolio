import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

// Priorité : .env.local (dev) puis .env — requis pour les specs Payload (DB).
loadEnv({ path: resolve(process.cwd(), '.env.local') })
loadEnv({ path: resolve(process.cwd(), '.env') })

/** Évite les prompts interactifs drizzle push pendant vitest (schéma géré via pnpm db:push). */
process.env.PAYLOAD_DB_PUSH = 'false'
