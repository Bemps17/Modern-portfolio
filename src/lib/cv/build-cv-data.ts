import { formatCvDateRange } from './format-date-range'
import type { CvDocumentData } from './types'

export type BuildCvSettingsInput = {
  siteName: string
  tagline: string
  email: string
  phone?: string | null
  location?: string | null
  cvPitch?: string | null
  aboutIntro?: string | null
  recommendationQuote?: string | null
  recommendationAuthor?: string | null
  availabilityLabel?: string | null
  mobility?: string | null
  interests?: string | null
  rqthNote?: string | null
  showRqthOnCv?: boolean | null
  languages?: Array<{ name: string; level: string }> | null
  cvCompetencies?: Array<{ name: string; level: number; description: string }> | null
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

function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return 0
  return Math.min(100, Math.max(0, Math.round(level)))
}

export function buildCvDocumentData(input: BuildCvDocumentInput): CvDocumentData {
  const { settings, experiences, qualifications } = input
  const pitch = settings.cvPitch?.trim() || settings.aboutIntro?.trim() || settings.tagline

  return {
    fullName: settings.siteName,
    tagline: settings.tagline,
    email: settings.email,
    phone: settings.phone?.trim() || null,
    location: settings.location?.trim() || null,
    pitch,
    recommendationQuote: settings.recommendationQuote?.trim() || null,
    recommendationAuthor: settings.recommendationAuthor?.trim() || null,
    availabilityLabel: settings.availabilityLabel?.trim() || null,
    mobility: settings.mobility?.trim() || null,
    interests: settings.interests?.trim() || null,
    rqthNote: settings.rqthNote?.trim() || null,
    showRqthOnCv: Boolean(settings.showRqthOnCv),
    languages: (settings.languages || []).map((lang) => ({
      name: lang.name,
      level: lang.level,
    })),
    competencies: (settings.cvCompetencies || []).map((item) => ({
      name: item.name,
      level: clampLevel(item.level),
      description: item.description,
    })),
    experiences: experiences.map((experience) => ({
      title: experience.title,
      company: experience.company,
      dateLabel: formatCvDateRange(
        experience.dateStart,
        experience.dateEnd,
        Boolean(experience.current),
      ),
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
