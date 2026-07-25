import { draftMode } from 'next/headers'

export type DraftFindOptions = {
  draft?: boolean
  overrideAccess?: boolean
}

/** Options Local API pour charger brouillons (live preview / draft mode). */
export function resolvePreviewFetchMode(isPreview: boolean): DraftFindOptions {
  if (!isPreview) return {}
  return { draft: true, overrideAccess: true }
}

export function buildDraftFindOptions<TWhere extends Record<string, unknown>>(
  where: TWhere,
  isPreview: boolean,
) {
  return {
    where,
    ...resolvePreviewFetchMode(isPreview),
  }
}

/** Lit draftMode Next.js (Server Components). */
export async function isDraftPreviewEnabled(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch {
    return false
  }
}
