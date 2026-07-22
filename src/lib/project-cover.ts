import type { Project } from '@/payload-types'

import { resolveMediaUrl } from '@/lib/media'

/** Cover statique commitée dans `public/projects/` (toujours disponible sur Vercel). */
export function projectCoverPublicPath(slug: string): string {
  return `/projects/${slug}-cover.webp`
}

/**
 * URL de cover pour le front.
 * Les médias uploadés hors Blob (disque local) exposent `/api/media/file/…` en 404 sur Vercel :
 * on retombe alors sur la cover statique commitée dans `public/projects/`.
 */
export function resolveProjectCoverUrl(project: Pick<Project, 'slug' | 'cover'>): string {
  const cmsUrl = resolveMediaUrl(project.cover)
  if (cmsUrl && /^https?:\/\//i.test(cmsUrl)) return cmsUrl
  return projectCoverPublicPath(project.slug)
}
