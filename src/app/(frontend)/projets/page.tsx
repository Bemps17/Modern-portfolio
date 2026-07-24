import type { Metadata } from 'next'

import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getPublishedProjects, getSeoDefaultsContent, getSiteSettingsContent } from '@/lib/content'
import { itemListJsonLd, JsonLd } from '@/lib/json-ld'
import { buildPageMetadata } from '@/lib/seo-metadata'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])

  return buildPageMetadata(seo, settings, {
    title: 'Projets',
    description: seo?.defaultDescription || `Projets de ${settings?.siteName || 'portfolio'}.`,
    path: '/projets',
  })
}

export default async function ProjetsPage() {
  const projects = await getPublishedProjects()
  const siteUrl = getSiteUrl()

  return (
    <Container className="py-12 sm:py-16">
      <ReadableSurface strong>
        <JsonLd
          data={itemListJsonLd({
            name: 'Projets',
            items: projects.map((project) => ({
              name: project.title,
              url: `${siteUrl}/projets/${project.slug}`,
            })),
          })}
        />
        <SectionTitle
          editorial
          eyebrow="Work"
          subtitle="Filtrez par stack si besoin — chaque carte mène au détail."
          title="Projets"
        />
        <ProjectGrid
          enableFilters
          enableTilt={false}
          layoutMode="grid"
          projects={projects}
          showStackChips
        />
      </ReadableSurface>
    </Container>
  )
}
