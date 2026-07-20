import type { Metadata } from 'next'

import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getPublishedProjects } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Liste des projets publiés.',
}

export default async function ProjetsPage() {
  const projects = await getPublishedProjects()

  return (
    <div className="px-6 py-16 xl:px-16">
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
