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
import { resolveJournalCoverUrl } from '@/lib/journal-cover'
import { buildPageMetadata } from '@/lib/seo-metadata'

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

  return buildPageMetadata(seo, settings, {
    title: post.title,
    description: post.excerpt,
    path: `/carnet/${post.slug}`,
    image: coverUrl,
    type: 'article',
  })
}

export default async function CarnetDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getJournalPostBySlug(slug), getSiteSettingsContent()])
  if (!post) notFound()

  return (
    <>
      <JournalPostDetailView backLabel={settings?.journalNavLabel ?? 'Le Lablog'} post={post} />
      <PayloadLivePreviewRefresh />
    </>
  )
}
