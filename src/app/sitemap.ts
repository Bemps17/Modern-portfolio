import type { MetadataRoute } from 'next'

import { isPayloadConfigured } from '@/lib/payload-env'
import { getPayloadClientSafe } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/projets`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/a-propos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  if (!isPayloadConfigured()) return staticRoutes

  const payload = await getPayloadClientSafe()
  if (!payload) return staticRoutes

  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 200,
  })

  const projectRoutes = projects.docs.map((project) => ({
    url: `${siteUrl}/projets/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}
