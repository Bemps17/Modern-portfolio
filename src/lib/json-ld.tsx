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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name || undefined,
    email: input.email || undefined,
    description: input.description || undefined,
    url: input.url,
    sameAs: input.sameAs?.length ? input.sameAs : undefined,
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description || undefined,
    url: input.url || undefined,
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
