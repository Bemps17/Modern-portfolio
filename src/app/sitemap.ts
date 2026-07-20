import type { MetadataRoute } from 'next'

import { getProjectSlugs } from '@/lib/content'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const slugs = await getProjectSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/projets`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/a-propos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const projectRoutes = slugs.map((slug) => ({
    url: `${siteUrl}/projets/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}
