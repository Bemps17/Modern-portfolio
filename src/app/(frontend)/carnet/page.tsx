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
    title: settings?.journalTitle ?? 'Carnet',
    description:
      settings?.journalSubtitle ??
      seo?.defaultDescription ??
      `Carnet créatif de ${settings?.siteName || 'portfolio'}.`,
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
          eyebrow={settings?.journalEyebrow ?? 'Créations & veille'}
          icon="journal"
          subtitle={settings?.journalSubtitle ?? undefined}
          title={settings?.journalTitle ?? 'Carnet'}
        />
        <JournalPostGrid posts={posts} />
      </ReadableSurface>
    </Container>
  )
}
