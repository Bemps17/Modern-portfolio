import type { MetadataRoute } from 'next'

import { getSeoDefaultsContent } from '@/lib/content'
import { getSiteUrl } from '@/lib/site-url'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [siteUrl, seo] = await Promise.all([Promise.resolve(getSiteUrl()), getSeoDefaultsContent()])
  const noIndex = Boolean(seo?.noindexSite)

  return {
    rules: {
      userAgent: '*',
      allow: noIndex ? undefined : '/',
      disallow: noIndex ? ['/'] : ['/admin', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
