import type { Metadata } from 'next'

import { JournalPostGrid } from '@/components/sections/JournalPostGrid'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  getPublishedJournalPosts,
  getSeoDefaultsContent,
  getSiteSettingsContent,
} from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo-metadata'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])

  return buildPageMetadata(seo, settings, {
    title: settings?.journalTitle ?? 'Le Lablog',
    description:
      settings?.journalSubtitle ??
      seo?.defaultDescription ??
      `Le Lablog de ${settings?.siteName || 'portfolio'}.`,
    path: '/carnet',
  })
}

export default async function CarnetPage() {
  const [posts, settings] = await Promise.all([
    getPublishedJournalPosts(),
    getSiteSettingsContent(),
  ])

  return (
    <Container className="py-12 sm:py-16">
      <ReadableSurface strong>
        <SectionTitle
          editorial
          eyebrow={settings?.journalEyebrow ?? 'La blague du labo'}
          icon="journal"
          subtitle={settings?.journalSubtitle ?? undefined}
          title={settings?.journalTitle ?? 'Le Lablog'}
        />
        <JournalPostGrid posts={posts} />
      </ReadableSurface>
    </Container>
  )
}
