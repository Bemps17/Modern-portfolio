import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProjectDetailView } from '@/components/sections/ProjectDetailView'
import { getProjectBySlug, getProjectSlugs, getPublishedProjects } from '@/lib/content'
import type { Media, Project } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Projet' }

  const cover = typeof project.cover === 'object' ? (project.cover as Media) : null

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: cover?.url ? [{ url: cover.url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.excerpt,
      images: cover?.url ? [cover.url] : undefined,
    },
  }
}

function toAdjacent(project: Project | undefined) {
  if (!project) return null
  const cover = typeof project.cover === 'object' ? (project.cover as Media) : null
  return {
    slug: project.slug,
    title: project.title,
    coverUrl: cover?.url ?? null,
  }
}

export default async function ProjetDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getPublishedProjects()])
  if (!project) notFound()

  const index = allProjects.findIndex((item) => item.slug === slug)
  const prevProject = toAdjacent(allProjects[index - 1])
  const nextProject = toAdjacent(allProjects[index + 1])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt,
    url: project.liveUrl || undefined,
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <ProjectDetailView nextProject={nextProject} prevProject={prevProject} project={project} />
    </>
  )
}
