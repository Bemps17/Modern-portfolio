import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/** Pages publiques à invalider après une action CMS. */
export const PUBLIC_PATHS = ['/', '/projets', '/a-propos', '/contact'] as const

function safeRevalidate(path: string, type: 'page' | 'layout' = 'page') {
  try {
    revalidatePath(path, type)
  } catch {
    // No-op hors runtime Next.js (seed, CLI, tests).
  }
}

/**
 * Invalide tout le front public (layout racine + pages clés).
 * Appelé après create/update/delete CMS et via le bouton admin.
 */
export function revalidatePublicSite() {
  // Layout : invalide toutes les pages sous le layout frontend.
  safeRevalidate('/', 'layout')
  for (const path of PUBLIC_PATHS) {
    safeRevalidate(path, 'page')
  }
  safeRevalidate('/sitemap.xml', 'page')
}

export const revalidateProjects: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  revalidatePublicSite()
  if (doc?.slug) safeRevalidate(`/projets/${doc.slug}`)
  // Ancien slug si renommage — évite une page ISR périmée.
  const previousSlug = previousDoc?.slug
  if (previousSlug && previousSlug !== doc?.slug) {
    safeRevalidate(`/projets/${previousSlug}`)
  }
  return doc
}

export const revalidateProjectsDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidatePublicSite()
  if (doc?.slug) safeRevalidate(`/projets/${doc.slug}`)
}

export const revalidateContentPages: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePublicSite()
  return doc
}

export const revalidateContentPagesDelete: CollectionAfterDeleteHook = () => {
  revalidatePublicSite()
}

/** Médias (logo, avatar, covers) — impact potentiel sur tout le front. */
export const revalidateMediaChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePublicSite()
  return doc
}

export const revalidateMediaDelete: CollectionAfterDeleteHook = () => {
  revalidatePublicSite()
}

export const revalidateGlobals: GlobalAfterChangeHook = ({ doc }) => {
  revalidatePublicSite()
  return doc
}
