import { closeSync, existsSync, mkdirSync, openSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import config from '@/payload.config'

let cached: Payload | null = null

/** Client Payload partagé pour les specs d’intégration (DB locale requise). */
export async function getTestPayload(): Promise<Payload> {
  if (cached) return cached
  const payloadConfig = await config
  cached = await getPayload({ config: payloadConfig })
  return cached
}

export function lexicalParagraph(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
      direction: 'ltr' as const,
    },
  }
}

/**
 * Crée un média PNG valide via sharp.
 * Un PNG 1×1 base64 minimal est rejeté par `checkFileRestrictions` (Payload 3.86).
 */
export async function createTestMedia(payload: Payload, alt: string) {
  const buffer = await sharp({
    create: { width: 16, height: 16, channels: 3, background: { r: 30, g: 60, b: 120 } },
  })
    .png()
    .toBuffer()

  const name = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`

  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name,
      size: buffer.length,
    },
  })
}

const SITE_SETTINGS_LOCK = join(tmpdir(), 'modern-portfolio-site-settings.lock')

/** Attend et prend le verrou (specs qui mutent `site-settings`). */
export async function acquireSiteSettingsLock(timeoutMs = 60_000): Promise<void> {
  const started = Date.now()
  mkdirSync(tmpdir(), { recursive: true })
  while (true) {
    try {
      const fd = openSync(SITE_SETTINGS_LOCK, 'wx')
      closeSync(fd)
      return
    } catch {
      if (Date.now() - started > timeoutMs) {
        throw new Error('Timeout waiting for site-settings test lock')
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

export function releaseSiteSettingsLock(): void {
  if (!existsSync(SITE_SETTINGS_LOCK)) return
  try {
    unlinkSync(SITE_SETTINGS_LOCK)
  } catch {
    // ignore
  }
}

/**
 * Restaure un upload de global sans écraser le contenu CMS réel.
 * - Si `previousId` existe encore → on le remet
 * - Si `previousId` est null et que la valeur courante est encore le média de test → on nettoie
 * - Sinon on ne touche pas (évite d’effacer un avatar prod après une course)
 */
export async function restoreGlobalUpload(
  payload: Payload,
  slug: 'site-settings' | 'seo-defaults',
  field: 'avatar' | 'ogImage' | 'cv',
  previousId: number | null,
  testMediaId?: number,
): Promise<void> {
  if (previousId != null) {
    try {
      await payload.findByID({ collection: 'media', id: previousId })
      await payload.updateGlobal({ slug, data: { [field]: previousId } })
    } catch {
      // média précédent disparu — ne pas écraser
    }
    return
  }

  if (testMediaId == null) return

  const current = await payload.findGlobal({ slug, depth: 0 })
  const raw = (current as unknown as Record<string, unknown>)[field]
  const currentId =
    typeof raw === 'number'
      ? raw
      : raw && typeof raw === 'object' && 'id' in raw
        ? Number((raw as { id: number }).id)
        : null

  if (currentId === testMediaId) {
    await payload.updateGlobal({ slug, data: { [field]: null } }).catch(() => undefined)
  }
}
