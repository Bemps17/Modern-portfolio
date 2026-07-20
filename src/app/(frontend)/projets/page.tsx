import type { Metadata } from 'next'

import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getPublishedProjects, getSeoDefaultsContent, getSiteSettingsContent } from '@/lib/content'
import { itemListJsonLd, JsonLd } from '@/lib/json-ld'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])

  return {
    title: 'Projets',
    description: seo?.defaultDescription || `Projets de ${settings?.siteName || 'portfolio'}.`,
    openGraph: {
      title: `Projets — ${settings?.siteName || 'Portfolio'}`,
      description: seo?.defaultDescription || settings?.tagline || undefined,
      type: 'website',
    },
  }
}

export default async function ProjetsPage() {
  const projects = await getPublishedProjects()
  const siteUrl = getSiteUrl()

  return (
    <div className="px-6 py-16 xl:px-16">
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
        subtitle="Survolez pour prévisualiser — filtrez par stack si besoin."
        title="Projets"
      />
      <ProjectGrid enableFilters enablePreview layoutMode="masonry" projects={projects} showStackChips={false} />
    </div>
  )
}
