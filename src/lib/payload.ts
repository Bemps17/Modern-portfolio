import config from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

let cached: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}
