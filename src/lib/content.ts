import { portfolioFallback } from '@/data/portfolio-fallback'
import type { Experience, Project, Skill } from '@/payload-types'

import { getPayloadClientSafe } from './payload'
import { isPayloadConfigured } from './payload-env'

export function isDemoContentMode(): boolean {
  return !isPayloadConfigured()
}

export async function getSiteSettingsContent() {
  const payload = await getPayloadClientSafe()
  if (payload) {
    return payload.findGlobal({ slug: 'site-settings' }).catch(() => portfolioFallback.siteSettings)
  }
  return portfolioFallback.siteSettings
}

export async function getSeoDefaultsContent() {
  const payload = await getPayloadClientSafe()
  if (payload) {
    return payload.findGlobal({ slug: 'seo-defaults' }).catch(() => portfolioFallback.seoDefaults)
  }
  return portfolioFallback.seoDefaults
}

export async function getPublishedProjects(): Promise<Project[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' } },
      sort: 'order',
      depth: 1,
      limit: 100,
    })
    return result.docs
  }
  return portfolioFallback.projects
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'projects',
      where: {
        and: [{ status: { equals: 'published' } }, { featured: { equals: true } }],
      },
      sort: 'order',
      depth: 1,
      limit: 6,
    })
    if (result.docs.length > 0) return result.docs
    const fallback = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'published' } },
      sort: 'order',
      depth: 1,
      limit: 6,
    })
    return fallback.docs
  }
  return portfolioFallback.projects.filter((project) => project.featured)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'projects',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  }
  return portfolioFallback.projects.find((project) => project.slug === slug) ?? null
}

export async function getExperiences(): Promise<Experience[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'experiences',
      sort: '-dateStart',
      limit: 50,
    })
    return result.docs
  }
  return portfolioFallback.experiences
}

export async function getSkills(): Promise<Skill[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'skills',
      sort: 'name',
      limit: 100,
      depth: 1,
    })
    return result.docs
  }
  return portfolioFallback.skills
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getPublishedProjects()
  return projects.map((project) => project.slug)
}
