import config from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

import { isPayloadConfigured } from './payload-env'

let cached: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (!isPayloadConfigured()) {
    throw new Error('Payload is not configured: set PAYLOAD_SECRET and DATABASE_URI')
  }

  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}

export async function getPayloadClientSafe(): Promise<Payload | null> {
  if (!isPayloadConfigured()) return null

  try {
    return await getPayloadClient()
  } catch {
    return null
  }
}
