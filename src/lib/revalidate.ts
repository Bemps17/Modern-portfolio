import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidateProjects: CollectionAfterChangeHook = ({ doc, operation }) => {
  if (operation === 'create' || operation === 'update' || operation === 'delete') {
    revalidatePath('/')
    revalidatePath('/projets')
    if (doc?.slug) revalidatePath(`/projets/${doc.slug}`)
  }
  return doc
}

export const revalidateContentPages: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePath('/')
  revalidatePath('/a-propos')
  return doc
}

export const revalidateGlobals: GlobalAfterChangeHook = ({ doc }) => {
  revalidatePath('/')
  revalidatePath('/a-propos')
  revalidatePath('/contact')
  revalidatePath('/projets')
  return doc
}
