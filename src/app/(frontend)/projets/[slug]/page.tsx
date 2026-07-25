import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PayloadLivePreviewRefresh } from '@/components/cms/PayloadLivePreviewRefresh'
import { ProjectDetailView } from '@/components/sections/ProjectDetailView'
import { breadcrumbJsonLd, creativeWorkJsonLd, JsonLd } from '@/lib/json-ld'
import {
  getProjectBySlug,
  getProjectSlugs,
  getPublishedProjects,
  getSeoDefaultsContent,
  getSiteSettingsContent,
} from '@/lib/content'
import { resolveProjectCoverUrl } from '@/lib/project-cover'
import { buildPageMetadata } from '@/lib/seo-metadata'
import { getSiteUrl } from '@/lib/site-url'
import type { Project } from '@/payload-types'

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
  const [project, settings, seo] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettingsContent(),
    getSeoDefaultsContent(),
  ])
  if (!project) return { title: 'Projet' }

  const coverUrl = resolveProjectCoverUrl(project)

  return buildPageMetadata(seo, settings, {
    title: project.title,
    description: project.excerpt,
    path: `/projets/${project.slug}`,
    image: coverUrl,
    type: 'article',
  })
}

function toAdjacent(project: Project | undefined) {
  if (!project) return null
  return {
    slug: project.slug,
    title: project.title,
    coverUrl: resolveProjectCoverUrl(project),
  }
}

export default async function ProjetDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [project, allProjects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
    getSiteSettingsContent(),
  ])
  if (!project) notFound()

  const index = allProjects.findIndex((item) => item.slug === slug)
  const prevProject = toAdjacent(allProjects[index - 1])
  const nextProject = toAdjacent(allProjects[index + 1])

  const siteUrl = getSiteUrl()
  const projectUrl = `${siteUrl}/projets/${project.slug}`

  return (
    <>
      <JsonLd
        data={creativeWorkJsonLd({
          name: project.title,
          description: project.excerpt,
          url: projectUrl,
          image: resolveProjectCoverUrl(project),
          datePublished: project.createdAt,
          authorName: settings?.siteName,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', url: `${siteUrl}/` },
          { name: 'Projets', url: `${siteUrl}/projets` },
          { name: project.title, url: projectUrl },
        ])}
      />
      <ProjectDetailView nextProject={nextProject} prevProject={prevProject} project={project} />
      <PayloadLivePreviewRefresh />
    </>
  )
}
