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
    alternates: { canonical: `${getSiteUrl()}/projets` },
    openGraph: {
      title: `Projets — ${settings?.siteName || 'Portfolio'}`,
      description: seo?.defaultDescription || settings?.tagline || undefined,
      url: `${getSiteUrl()}/projets`,
      type: 'website',
    },
  }
}

export default async function ProjetsPage() {
  const projects = await getPublishedProjects()
  const siteUrl = getSiteUrl()

  return (
    <div className="readable-surface-strong mx-4 rounded-3xl px-6 py-16 sm:mx-6 xl:mx-16">
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
    </div>
  )
}
