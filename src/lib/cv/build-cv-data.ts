import { formatCvDateRange } from './format-date-range'
import type { CvCompetencyItem, CvDocumentData } from './types'

export type BuildCvSettingsInput = {
  siteName: string
  tagline: string
  email: string
  phone?: string | null
  location?: string | null
  cvJobTitle?: string | null
  cvPitch?: string | null
  aboutIntro?: string | null
  availabilityLabel?: string | null
  mobility?: string | null
  interests?: string | null
  rqthNote?: string | null
  showRqthOnCv?: boolean | null
  languages?: Array<{ name: string; level: string }> | null
  cvCompetencies?: Array<{
    name: string
    description?: string | null
    items?: string | null
    level?: number | null
  }> | null
}

export type BuildCvExperienceInput = {
  title: string
  company: string
  dateStart: string
  dateEnd?: string | null
  current?: boolean | null
  earlyCareer?: boolean | null
  description: string
}

export type BuildCvQualificationInput = {
  title: string
  organization?: string | null
  year?: number | null
  description?: string | null
}

export type BuildCvDocumentInput = {
  settings: BuildCvSettingsInput
  experiences: BuildCvExperienceInput[]
  qualifications: BuildCvQualificationInput[]
}

const DEFAULT_JOB_TITLE = 'Chargé de Clientèle & Projets Digitaux | Commercial B2B'

/** Découpe une liste de compétences (virgules, points médians, retours ligne). */
export function parseCompetencyItems(raw: string): string[] {
  return raw
    .split(/[\n,;·•|]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function mapCompetency(item: {
  name: string
  description?: string | null
  items?: string | null
}): CvCompetencyItem {
  const raw = item.description?.trim() || item.items?.trim() || ''
  return {
    name: item.name.trim(),
    items: parseCompetencyItems(raw),
  }
}

export function buildCvDocumentData(input: BuildCvDocumentInput): CvDocumentData {
  const { settings, experiences, qualifications } = input
  const pitch = settings.cvPitch?.trim() || settings.aboutIntro?.trim() || settings.tagline
  const jobTitle = settings.cvJobTitle?.trim() || DEFAULT_JOB_TITLE

  return {
    fullName: settings.siteName,
    jobTitle,
    tagline: settings.tagline,
    email: settings.email,
    phone: settings.phone?.trim() || null,
    location: settings.location?.trim() || null,
    pitch,
    availabilityLabel: settings.availabilityLabel?.trim() || null,
    mobility: settings.mobility?.trim() || null,
    interests: settings.interests?.trim() || null,
    rqthNote: settings.rqthNote?.trim() || null,
    showRqthOnCv: Boolean(settings.showRqthOnCv),
    languages: (settings.languages || []).map((lang) => ({
      name: lang.name,
      level: lang.level,
    })),
    competencies: (settings.cvCompetencies || []).map(mapCompetency),
    experiences: experiences.map((experience) => ({
      title: experience.title,
      company: experience.company,
      dateLabel: formatCvDateRange(
        experience.dateStart,
        experience.dateEnd,
        Boolean(experience.current),
      ),
      dateStart: experience.dateStart,
      dateEnd: experience.dateEnd ?? null,
      current: Boolean(experience.current),
      description: experience.description,
      earlyCareer: Boolean(experience.earlyCareer),
    })),
    qualifications: qualifications.map((qualification) => ({
      title: qualification.title,
      organization: qualification.organization?.trim() || null,
      yearLabel:
        qualification.year !== null && qualification.year !== undefined
          ? String(qualification.year)
          : null,
      description: qualification.description?.trim() || null,
    })),
  }
}
