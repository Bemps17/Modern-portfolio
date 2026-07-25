const WINDOW_MS = 60_000
const MAX_REQUESTS = 3

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

export function checkContactRateLimit(clientKey: string): RateLimitResult {
  const key = clientKey.trim() || 'unknown'
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now })
    return { allowed: true }
  }

  if (existing.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - existing.windowStart)) / 1000)
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfterSeconds) }
  }

  existing.count += 1
  return { allowed: true }
}

/** Réinitialise l’état en mémoire — usage tests uniquement. */
export function resetContactRateLimitForTests(): void {
  buckets.clear()
}
