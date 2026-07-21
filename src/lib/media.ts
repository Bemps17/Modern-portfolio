import type { Media } from '@/payload-types'

/**
 * Type guard pour une relation média Payload peuplée (depth ≥ 1).
 * Une relation non peuplée est un `number` (id) ou `null`.
 */
export function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

/** Retourne l'URL d'une relation média peuplée, sinon `null`. */
export function resolveMediaUrl(value: unknown): string | null {
  return isMedia(value) ? (value.url ?? null) : null
}
