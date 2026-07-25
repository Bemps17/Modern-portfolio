import type { MetadataRoute } from 'next'

import { getJournalSlugs, getProjectSlugs } from '@/lib/content'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const [slugs, journalSlugs] = await Promise.all([getProjectSlugs(), getJournalSlugs()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/projets`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/a-propos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/cv`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/carnet`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${siteUrl}/mentions-legales`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/confidentialite`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const projectRoutes = slugs.map((slug) => ({
    url: `${siteUrl}/projets/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const journalRoutes = journalSlugs.map((slug) => ({
    url: `${siteUrl}/carnet/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [...staticRoutes, ...projectRoutes, ...journalRoutes]
}
