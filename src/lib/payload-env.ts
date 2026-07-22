/** Resolve la connection string Postgres (aliases Marketplace Neon / Vercel). */
export function getDatabaseUri(): string {
  return (
    process.env.DATABASE_URI?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    ''
  )
}

export function getPayloadSecret(): string {
  return process.env.PAYLOAD_SECRET?.trim() || ''
}

export function isPayloadConfigured(): boolean {
  return Boolean(getPayloadSecret() && getDatabaseUri())
}

/** Expose DATABASE_URI pour Payload même si seul DATABASE_URL est défini. */
export function syncDatabaseUriEnv(): void {
  const uri = getDatabaseUri()
  if (uri && !process.env.DATABASE_URI?.trim()) {
    process.env.DATABASE_URI = uri
  }
}
