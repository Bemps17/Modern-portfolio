import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PayloadLivePreviewRefresh } from '@/components/cms/PayloadLivePreviewRefresh'
import { ProjectDetailView } from '@/components/sections/ProjectDetailView'
import { JsonLd } from '@/lib/json-ld'
import { breadcrumbJsonLd, buildProjectJsonLdFromDoc } from '@/lib/json-ld-document'
import {
  getProjectBySlug,
  getProjectSlugs,
  getPublishedProjects,
  getSeoDefaultsContent,
  getSiteSettingsContent,
} from '@/lib/content'
import { resolveRelatedProjects } from '@/lib/related-projects'
import { resolveDocumentSeo } from '@/lib/seo-document'
import { resolveProjectCoverUrl } from '@/lib/project-cover'
import { buildPageMetadata } from '@/lib/seo-metadata'
import { getSiteUrl } from '@/lib/site-url'
import type { Project, Tag } from '@/payload-types'

function resolveProjectTagNames(tags: Project['tags']): string[] {
  if (!tags?.length) return []
  return tags
    .map((tag) => (typeof tag === 'object' && tag !== null ? (tag as Tag).name : null))
    .filter((name): name is string => Boolean(name))
}

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
  const docSeo = resolveDocumentSeo({
    docTitle: project.title,
    docExcerpt: project.excerpt,
    meta: project.meta,
    path: `/projets/${project.slug}`,
    coverUrl,
  })

  return buildPageMetadata(seo, settings, {
    title: docSeo.title,
    description: docSeo.description,
    path: `/projets/${project.slug}`,
    image: docSeo.image,
    type: 'article',
    noIndex: docSeo.noIndex,
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
  const relatedProjects = resolveRelatedProjects(project, allProjects)

  const siteUrl = getSiteUrl()
  const projectUrl = `${siteUrl}/projets/${project.slug}`
  const coverUrl = resolveProjectCoverUrl(project)

  return (
    <>
      <JsonLd
        data={buildProjectJsonLdFromDoc({
          project,
          siteUrl,
          authorName: settings?.siteName,
          coverUrl,
          tagNames: resolveProjectTagNames(project.tags),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', url: `${siteUrl}/` },
          { name: 'Projets', url: `${siteUrl}/projets` },
          { name: project.title, url: projectUrl },
        ])}
      />
      <ProjectDetailView
        nextProject={nextProject}
        prevProject={prevProject}
        project={project}
        relatedProjects={relatedProjects}
      />
      <PayloadLivePreviewRefresh />
    </>
  )
}
