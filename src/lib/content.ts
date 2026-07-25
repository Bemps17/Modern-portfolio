import { portfolioFallback } from '@/data/portfolio-fallback'
import type {
  Experience,
  JournalPost,
  Media,
  Project,
  Qualification,
  SiteSetting,
  Skill,
} from '@/payload-types'

import { getPayloadClientSafe } from './payload'
import { isPayloadConfigured } from './payload-env'
import type { SeoDefaultsContent } from './seo-metadata'

export { type SeoDefaultsContent } from './seo-metadata'

export function isDemoContentMode(): boolean {
  return !isPayloadConfigured()
}

/** Forme renvoyée au front (CMS + fallback éditorial). */
export type SiteSettingsContent = {
  siteName: string
  tagline: string
  aboutIntro?: string | null
  aboutHeadline?: string | null
  aboutBody?: string | null
  skillsTitle?: string | null
  skillsSubtitle?: string | null
  location?: string | null
  availability?: 'available' | 'limited' | 'unavailable' | null
  availabilityLabel?: string | null
  email?: string | null
  avatar?: SiteSetting['avatar']
  logo?: SiteSetting['logo']
  favicon?: SiteSetting['favicon']
  socialLinks?: SiteSetting['socialLinks']
  approachSteps?: SiteSetting['approachSteps']
  whyMePoints?: NonNullable<SiteSetting['whyMePoints']> | typeof portfolioFallback.siteSettings.whyMePoints
  skillGroups?: NonNullable<SiteSetting['skillGroups']> | typeof portfolioFallback.siteSettings.skillGroups
  personalProjects?:
    | NonNullable<SiteSetting['personalProjects']>
    | typeof portfolioFallback.siteSettings.personalProjects
  phone?: string | null
  cvJobTitle?: string | null
  cvPitch?: string | null
  mobility?: string | null
  interests?: string | null
  rqthNote?: string | null
  showRqthOnCv?: boolean | null
  languages?: NonNullable<SiteSetting['languages']> | typeof portfolioFallback.siteSettings.languages
  cvCompetencies?:
    | NonNullable<SiteSetting['cvCompetencies']>
    | typeof portfolioFallback.siteSettings.cvCompetencies
  cv?: SiteSetting['cv']
  themeColor?: string | null
  contactPageSubtitle?: string | null
  enableContactForm?: boolean | null
  legalPublisher?: string | null
  legalDirector?: string | null
  legalHostingProvider?: string | null
  footerExtraLine?: string | null
  maintenanceMode?: boolean | null
  maintenanceMessage?: string | null
  journalNavLabel?: string | null
  journalTitle?: string | null
  journalEyebrow?: string | null
  journalSubtitle?: string | null
}

/** Complète les champs éditoriaux absents du CMS sans écraser avatar / identité. */
function withEditorialFallback(
  settings: SiteSetting | typeof portfolioFallback.siteSettings,
): SiteSettingsContent {
  const fb = portfolioFallback.siteSettings
  return {
    ...fb,
    ...settings,
    aboutHeadline:
      ('aboutHeadline' in settings && settings.aboutHeadline?.trim()) || fb.aboutHeadline,
    aboutBody: settings.aboutBody?.trim() || fb.aboutBody,
    skillsTitle: ('skillsTitle' in settings && settings.skillsTitle?.trim()) || fb.skillsTitle,
    skillsSubtitle:
      ('skillsSubtitle' in settings && settings.skillsSubtitle?.trim()) || fb.skillsSubtitle,
    whyMePoints: settings.whyMePoints?.length ? settings.whyMePoints : fb.whyMePoints,
    skillGroups: settings.skillGroups?.length ? settings.skillGroups : fb.skillGroups,
    personalProjects: settings.personalProjects?.length
      ? settings.personalProjects
      : fb.personalProjects,
    phone: ('phone' in settings && settings.phone?.trim()) || fb.phone,
    cvJobTitle: ('cvJobTitle' in settings && settings.cvJobTitle?.trim()) || fb.cvJobTitle,
    cvPitch: ('cvPitch' in settings && settings.cvPitch?.trim()) || fb.cvPitch,
    mobility: ('mobility' in settings && settings.mobility?.trim()) || fb.mobility,
    interests: ('interests' in settings && settings.interests?.trim()) || fb.interests,
    rqthNote: ('rqthNote' in settings && settings.rqthNote?.trim()) || fb.rqthNote,
    showRqthOnCv:
      'showRqthOnCv' in settings && settings.showRqthOnCv !== undefined && settings.showRqthOnCv !== null
        ? settings.showRqthOnCv
        : fb.showRqthOnCv,
    languages: settings.languages?.length ? settings.languages : fb.languages,
    cvCompetencies: settings.cvCompetencies?.length ? settings.cvCompetencies : fb.cvCompetencies,
    journalNavLabel:
      ('journalNavLabel' in settings && settings.journalNavLabel?.trim()) || fb.journalNavLabel,
    journalTitle: ('journalTitle' in settings && settings.journalTitle?.trim()) || fb.journalTitle,
    journalEyebrow:
      ('journalEyebrow' in settings && settings.journalEyebrow?.trim()) || fb.journalEyebrow,
    journalSubtitle:
      ('journalSubtitle' in settings && settings.journalSubtitle?.trim()) || fb.journalSubtitle,
  }
}

type AvatarRow = {
  site_name: string | null
  tagline: string | null
  email: string | null
  about_intro: string | null
  about_body: string | null
  location: string | null
  availability: string | null
  availability_label: string | null
  avatar_id: number | null
  media_id: number | null
  media_alt: string | null
  media_url: string | null
  media_filename: string | null
  media_mime: string | null
}

/** Si findGlobal échoue (tables array absentes), récupère au moins l’avatar CMS. */
async function getSiteSettingsWithAvatarFallback(): Promise<SiteSettingsContent> {
  const payload = await getPayloadClientSafe()
  if (!payload) return portfolioFallback.siteSettings

  try {
    const pool = payload.db.pool
    if (!pool?.query) return portfolioFallback.siteSettings

    const { rows } = await pool.query<AvatarRow>(`
      select
        ss.site_name,
        ss.tagline,
        ss.email,
        ss.about_intro,
        ss.about_body,
        ss.location,
        ss.availability,
        ss.availability_label,
        ss.avatar_id,
        m.id as media_id,
        m.alt as media_alt,
        m.url as media_url,
        m.filename as media_filename,
        m.mime_type as media_mime
      from site_settings ss
      left join media m on m.id = ss.avatar_id
      limit 1
    `)

    const row = rows[0]
    if (!row) return portfolioFallback.siteSettings

    const avatar: Media | null =
      row.media_id != null
        ? ({
            id: row.media_id,
            alt: row.media_alt || 'Portrait',
            url: row.media_url,
            filename: row.media_filename,
            mimeType: row.media_mime,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          } as Media)
        : null

    return {
      ...portfolioFallback.siteSettings,
      siteName: row.site_name || portfolioFallback.siteSettings.siteName,
      tagline: row.tagline || portfolioFallback.siteSettings.tagline,
      email: row.email || portfolioFallback.siteSettings.email,
      aboutIntro: row.about_intro || portfolioFallback.siteSettings.aboutIntro,
      aboutBody: row.about_body || portfolioFallback.siteSettings.aboutBody,
      location: row.location || portfolioFallback.siteSettings.location,
      availability:
        (row.availability as SiteSettingsContent['availability']) ||
        portfolioFallback.siteSettings.availability,
      availabilityLabel:
        row.availability_label || portfolioFallback.siteSettings.availabilityLabel,
      avatar,
    }
  } catch {
    return portfolioFallback.siteSettings
  }
}

export async function getSiteSettingsContent(): Promise<SiteSettingsContent> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
      return withEditorialFallback(settings)
    } catch {
      return getSiteSettingsWithAvatarFallback()
    }
  }
  return portfolioFallback.siteSettings
}

export async function getSeoDefaultsContent(): Promise<SeoDefaultsContent> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    return payload
      .findGlobal({ slug: 'seo-defaults', depth: 1 })
      .catch(() => portfolioFallback.seoDefaults)
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

export async function getQualifications(): Promise<Qualification[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload
      .find({
        collection: 'qualifications',
        sort: '-year',
        limit: 50,
      })
      .catch(() => ({ docs: portfolioFallback.qualifications }))
    return result.docs.length > 0 ? result.docs : portfolioFallback.qualifications
  }
  return portfolioFallback.qualifications
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

export async function getPublishedJournalPosts(): Promise<JournalPost[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'journal-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 1,
      limit: 100,
    })
    return result.docs
  }
  return portfolioFallback.journalPosts
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'journal-posts',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  }
  return portfolioFallback.journalPosts.find((post) => post.slug === slug) ?? null
}

export async function getJournalSlugs(): Promise<string[]> {
  const posts = await getPublishedJournalPosts()
  return posts.map((post) => post.slug)
}
