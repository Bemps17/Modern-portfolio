import type { Metadata } from 'next'

import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { getPayloadClientSafe } from '@/lib/payload'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Liste des projets publiés.',
}

export default async function ProjetsPage() {
  const payload = await getPayloadClientSafe()
  const projects = payload
    ? await payload.find({
        collection: 'projects',
        where: { status: { equals: 'published' } },
        sort: 'order',
        depth: 1,
        limit: 100,
      })
    : { docs: [] }

  return (
    <Container className="py-16">
      <SectionTitle
        eyebrow="Work"
        subtitle="Filtrez par stack — tout est chargé une fois côté client."
        title="Projets"
      />
      <ProjectGrid enableFilters projects={projects.docs} />
    </Container>
  )
}
