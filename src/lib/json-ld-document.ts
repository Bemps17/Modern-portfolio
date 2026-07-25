import { articleJsonLd, breadcrumbJsonLd, projectJsonLd } from '@/lib/json-ld'
import { resolveDocumentSeo } from '@/lib/seo-document'

const STACK_LABELS: Record<string, string> = {
  nextjs: 'Next.js',
  react: 'React',
  typescript: 'TypeScript',
  payload: 'Payload CMS',
  nodejs: 'Node.js',
  postgres: 'PostgreSQL',
  tailwind: 'Tailwind CSS',
  'framer-motion': 'Framer Motion',
  vercel: 'Vercel',
  neon: 'Neon',
}

export function buildArticleJsonLdFromDoc(input: {
  post: {
    title: string
    slug: string
    excerpt?: string | null
    publishedAt: string
    updatedAt: string
    meta?: { title?: string | null; description?: string | null } | null
  }
  siteUrl: string
  authorName?: string | null
  coverUrl?: string | null
}) {
  const path = `/carnet/${input.post.slug}`
  const seo = resolveDocumentSeo({
    docTitle: input.post.title,
    docExcerpt: input.post.excerpt,
    meta: input.post.meta,
    path,
    coverUrl: input.coverUrl,
  })
  return articleJsonLd({
    headline: seo.title,
    description: seo.description,
    url: `${input.siteUrl}${path}`,
    datePublished: input.post.publishedAt,
    dateModified: input.post.updatedAt,
    authorName: input.authorName,
    image: seo.image,
  })
}

export function buildProjectJsonLdFromDoc(input: {
  project: {
    title: string
    slug: string
    excerpt?: string | null
    createdAt: string
    stack?: string[] | null
    meta?: { title?: string | null; description?: string | null } | null
  }
  siteUrl: string
  authorName?: string | null
  coverUrl?: string | null
  tagNames?: string[]
}) {
  const path = `/projets/${input.project.slug}`
  const seo = resolveDocumentSeo({
    docTitle: input.project.title,
    docExcerpt: input.project.excerpt,
    meta: input.project.meta,
    path,
    coverUrl: input.coverUrl,
  })
  const stackKeywords = (input.project.stack || []).map((s) => STACK_LABELS[s] || s)
  const keywords = [...new Set([...(input.tagNames || []), ...stackKeywords])]
  return projectJsonLd({
    name: seo.title,
    description: seo.description,
    url: `${input.siteUrl}${path}`,
    image: seo.image,
    datePublished: input.project.createdAt,
    authorName: input.authorName,
    keywords,
  })
}

export { breadcrumbJsonLd }
