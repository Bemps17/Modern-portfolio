import { getExperiences, getQualifications, getSiteSettingsContent } from '@/lib/content'

import { buildCvDocumentData } from './build-cv-data'
import type { CvDocumentData } from './types'

export async function getCvDocumentData(): Promise<CvDocumentData> {
  const [settings, experiences, qualifications] = await Promise.all([
    getSiteSettingsContent(),
    getExperiences(),
    getQualifications(),
  ])

  return buildCvDocumentData({
    settings: {
      siteName: settings.siteName,
      tagline: settings.tagline,
      email: settings.email || 'contact@example.com',
      phone: settings.phone,
      location: settings.location,
      cvPitch: settings.cvPitch,
      aboutIntro: settings.aboutIntro,
      availabilityLabel: settings.availabilityLabel,
      mobility: settings.mobility,
      interests: settings.interests,
      rqthNote: settings.rqthNote,
      showRqthOnCv: settings.showRqthOnCv,
      languages: settings.languages,
      cvCompetencies: settings.cvCompetencies,
    },
    experiences: experiences.map((experience) => ({
      title: experience.title,
      company: experience.company,
      dateStart: experience.dateStart,
      dateEnd: experience.dateEnd,
      current: experience.current,
      earlyCareer: experience.earlyCareer,
      description: experience.description,
    })),
    qualifications: qualifications.map((qualification) => ({
      title: qualification.title,
      organization: qualification.institution,
      year: qualification.year,
      description: null,
    })),
  })
}
