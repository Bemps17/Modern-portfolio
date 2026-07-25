import { getSiteUrl } from '@/lib/site-url'

type SeoMeta = {
  title?: string | null
  description?: string | null
  image?: unknown
  canonicalURL?: string | null
  noIndex?: boolean | null
}

type ResolveDocumentSeoInput = {
  docTitle: string
  docExcerpt?: string | null
  meta?: SeoMeta | null
  path: string
  coverUrl?: string | null
}

export type DocumentSeo = {
  title: string
  description: string
  canonicalUrl: string
  noIndex: boolean
  image?: string | null
}

/** Fusionne meta plugin SEO + champs document pour metadata front. */
export function resolveDocumentSeo(input: ResolveDocumentSeoInput): DocumentSeo {
  const siteUrl = getSiteUrl()
  const title = input.meta?.title?.trim() || input.docTitle
  const description = input.meta?.description?.trim() || input.docExcerpt?.trim() || ''
  const canonicalUrl = input.meta?.canonicalURL?.trim() || `${siteUrl}${input.path}`

  return {
    title,
    description,
    canonicalUrl,
    noIndex: Boolean(input.meta?.noIndex),
    image: input.coverUrl ?? null,
  }
}
