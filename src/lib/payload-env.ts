export function isPayloadConfigured(): boolean {
  return Boolean(process.env.PAYLOAD_SECRET?.trim() && process.env.DATABASE_URI?.trim())
}
