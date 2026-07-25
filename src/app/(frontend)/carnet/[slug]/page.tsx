import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PayloadLivePreviewRefresh } from '@/components/cms/PayloadLivePreviewRefresh'
import { JournalPostDetailView } from '@/components/sections/JournalPostDetailView'
import {
  getJournalPostBySlug,
  getJournalSlugs,
  getSeoDefaultsContent,
  getSiteSettingsContent,
} from '@/lib/content'
import {
  breadcrumbJsonLd,
  buildArticleJsonLdFromDoc,
} from '@/lib/json-ld-document'
import { JsonLd } from '@/lib/json-ld'
import { resolveJournalCoverUrl } from '@/lib/journal-cover'
import { resolveDocumentSeo } from '@/lib/seo-document'
import { buildPageMetadata } from '@/lib/seo-metadata'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getJournalSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [post, settings, seo] = await Promise.all([
    getJournalPostBySlug(slug),
    getSiteSettingsContent(),
    getSeoDefaultsContent(),
  ])
  if (!post) return { title: 'Le Lablog' }

  const coverUrl = resolveJournalCoverUrl(post.cover, post.slug)
  const docSeo = resolveDocumentSeo({
    docTitle: post.title,
    docExcerpt: post.excerpt,
    meta: post.meta,
    path: `/carnet/${post.slug}`,
    coverUrl,
  })

  return buildPageMetadata(seo, settings, {
    title: docSeo.title,
    description: docSeo.description,
    path: `/carnet/${post.slug}`,
    image: docSeo.image,
    type: 'article',
    noIndex: docSeo.noIndex,
  })
}

export default async function CarnetDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getJournalPostBySlug(slug), getSiteSettingsContent()])
  if (!post) notFound()

  const siteUrl = getSiteUrl()
  const coverUrl = resolveJournalCoverUrl(post.cover, post.slug)
  const postUrl = `${siteUrl}/carnet/${post.slug}`
  const journalLabel = settings?.journalNavLabel ?? 'Le Lablog'

  return (
    <>
      <JsonLd
        data={buildArticleJsonLdFromDoc({
          post,
          siteUrl,
          authorName: settings?.siteName,
          coverUrl,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', url: `${siteUrl}/` },
          { name: journalLabel, url: `${siteUrl}/carnet` },
          { name: post.title, url: postUrl },
        ])}
      />
      <JournalPostDetailView backLabel={journalLabel} post={post} />
      <PayloadLivePreviewRefresh />
    </>
  )
}
