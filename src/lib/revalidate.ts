import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // No-op outside Next.js runtime (seed scripts, CLI, etc.)
  }
}

export const revalidateProjects: CollectionAfterChangeHook = ({ doc, operation }) => {
  if (operation === 'create' || operation === 'update' || operation === 'delete') {
    safeRevalidate('/')
    safeRevalidate('/projets')
    if (doc?.slug) safeRevalidate(`/projets/${doc.slug}`)
  }
  return doc
}

export const revalidateContentPages: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate('/')
  safeRevalidate('/a-propos')
  return doc
}

export const revalidateGlobals: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidate('/')
  safeRevalidate('/a-propos')
  safeRevalidate('/contact')
  safeRevalidate('/projets')
  return doc
}
