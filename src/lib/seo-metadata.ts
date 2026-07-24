import type { Metadata } from 'next'

import type { SeoDefault } from '@/payload-types'

import type { SiteSettingsContent } from './content'
import { resolveMediaUrl } from './media'
import { getSiteUrl } from './site-url'

export type SeoDefaultsContent = Pick<
  SeoDefault,
  | 'defaultTitle'
  | 'defaultDescription'
  | 'ogImage'
  | 'titleTemplate'
  | 'keywords'
  | 'ogLocale'
  | 'ogSiteName'
  | 'twitterCard'
  | 'twitterSite'
  | 'twitterCreator'
  | 'noindexSite'
  | 'robotsIndex'
  | 'robotsFollow'
  | 'googleSiteVerification'
  | 'canonicalBaseUrl'
  | 'enablePersonJsonLd'
  | 'enableWebsiteJsonLd'
  | 'schemaAuthorName'
>

export type PageSeoOptions = {
  title?: string
  description?: string
  path?: string
  image?: string | null
  noIndex?: boolean
  type?: 'website' | 'article'
}

function resolveSiteBaseUrl(seo?: SeoDefaultsContent | null): string {
  const override = seo?.canonicalBaseUrl?.trim()
  if (override) return override.replace(/\/$/, '')
  return getSiteUrl().replace(/\/$/, '')
}

function resolveCanonicalPath(path: string): string {
  if (!path || path === '/') return '/'
  return path.startsWith('/') ? path : `/${path}`
}

function resolvePageTitle(
  seo: SeoDefaultsContent | null | undefined,
  settings: Pick<SiteSettingsContent, 'siteName'> | null | undefined,
  pageTitle?: string,
): string {
  const fallbackSite = settings?.siteName || 'Portfolio'
  const baseTitle = seo?.defaultTitle || fallbackSite

  if (!pageTitle?.trim()) return baseTitle

  const template = seo?.titleTemplate?.trim()
  if (template?.includes('%s')) return template.replace('%s', pageTitle.trim())

  return `${pageTitle.trim()} — ${fallbackSite}`
}

function resolveKeywords(seo?: SeoDefaultsContent | null): string[] | undefined {
  const raw = seo?.keywords?.trim()
  if (!raw) return undefined
  const items = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return items.length ? items : undefined
}

function resolveTwitterCard(seo?: SeoDefaultsContent | null): 'summary' | 'summary_large_image' {
  return seo?.twitterCard === 'summary' ? 'summary' : 'summary_large_image'
}

export function buildPageMetadata(
  seo: SeoDefaultsContent | null | undefined,
  settings: Pick<SiteSettingsContent, 'siteName' | 'tagline'> | null | undefined,
  options: PageSeoOptions = {},
): Metadata {
  const siteBase = resolveSiteBaseUrl(seo)
  const path = resolveCanonicalPath(options.path ?? '/')
  const canonical = `${siteBase}${path}`

  const title = resolvePageTitle(seo, settings, options.title)
  const description =
    options.description?.trim() ||
    seo?.defaultDescription ||
    settings?.tagline ||
    undefined

  const ogImage =
    options.image ||
    resolveMediaUrl(seo?.ogImage) ||
    undefined

  const noIndex = Boolean(options.noIndex || seo?.noindexSite)
  const index = noIndex ? false : seo?.robotsIndex !== false
  const follow = seo?.robotsFollow !== false

  return {
    title,
    description,
    keywords: resolveKeywords(seo),
    alternates: { canonical },
    robots: {
      index,
      follow,
      googleBot: { index, follow },
    },
    verification: seo?.googleSiteVerification?.trim()
      ? { google: seo.googleSiteVerification.trim() }
      : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: seo?.ogSiteName?.trim() || settings?.siteName || undefined,
      locale: seo?.ogLocale?.trim() || 'fr_FR',
      type: options.type || 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: resolveTwitterCard(seo),
      site: seo?.twitterSite?.trim() || undefined,
      creator: seo?.twitterCreator?.trim() || undefined,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
