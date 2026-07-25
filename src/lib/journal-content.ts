import type { JournalPost } from '@/payload-types'

/** Libellé CMS avec migration des valeurs legacy « Carnet » / early journal. */
export function resolveJournalCopy(
  cmsValue: string | null | undefined,
  fallback: string,
  legacyValues: string[] = [],
): string {
  const trimmed = cmsValue?.trim()
  if (!trimmed) return fallback
  if (trimmed === 'Carnet' || legacyValues.includes(trimmed)) return fallback
  return trimmed
}

/** Post par slug : CMS prioritaire, fallback démo si absent. */
export function resolveJournalPostBySlug(
  cmsPost: JournalPost | undefined,
  slug: string,
  fallbackPosts: JournalPost[],
): JournalPost | null {
  if (cmsPost) return cmsPost
  return fallbackPosts.find((post) => post.slug === slug) ?? null
}

/** Posts publiés : CMS prioritaire, fallback démo si liste vide. */
export function resolvePublishedJournalPosts(
  cmsDocs: JournalPost[],
  fallbackPosts: JournalPost[],
): JournalPost[] {
  if (cmsDocs.length > 0) return cmsDocs
  return fallbackPosts
}
