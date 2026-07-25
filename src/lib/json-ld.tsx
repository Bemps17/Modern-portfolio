type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  )
}

export function personJsonLd(input: {
  name?: string | null
  email?: string | null
  description?: string | null
  url?: string
  sameAs?: string[]
  image?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name || undefined,
    email: input.email || undefined,
    description: input.description || undefined,
    url: input.url,
    sameAs: input.sameAs?.length ? input.sameAs : undefined,
    image: input.image || undefined,
  }
}

export function websiteJsonLd(input: { name: string; url: string; description?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    description: input.description || undefined,
  }
}

export function creativeWorkJsonLd(input: {
  name: string
  description?: string | null
  url?: string | null
  image?: string | null
  datePublished?: string | null
  authorName?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description || undefined,
    url: input.url || undefined,
    image: input.image || undefined,
    datePublished: input.datePublished || undefined,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
  }
}

export type ArticleJsonLdInput = {
  headline: string
  description?: string | null
  url: string
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string | null
  image?: string | null
}

export function articleJsonLd(input: ArticleJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description || undefined,
    url: input.url,
    datePublished: input.datePublished || undefined,
    dateModified: input.dateModified || undefined,
    image: input.image || undefined,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
  }
}

export type ProjectJsonLdInput = {
  name: string
  description?: string | null
  url?: string | null
  image?: string | null
  datePublished?: string | null
  authorName?: string | null
  keywords?: string[]
}

export function projectJsonLd(input: ProjectJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description || undefined,
    url: input.url || undefined,
    image: input.image || undefined,
    datePublished: input.datePublished || undefined,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function itemListJsonLd(input: {
  name: string
  items: Array<{ name: string; url: string }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
