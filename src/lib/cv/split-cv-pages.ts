import type { CvDocumentData } from './types'

export type CvPagePlan = {
  page1: {
    recentExperiences: CvDocumentData['experiences']
  }
  page2: {
    earlyExperiences: CvDocumentData['experiences']
    qualifications: CvDocumentData['qualifications']
    recommendationQuote: string | null
    recommendationAuthor: string | null
  } | null
}

export function splitCvPages(data: CvDocumentData): CvPagePlan {
  const recentExperiences = data.experiences.filter((item) => !item.earlyCareer)
  const earlyExperiences = data.experiences.filter((item) => item.earlyCareer)
  const hasPage2 =
    earlyExperiences.length > 0 ||
    data.qualifications.length > 0 ||
    Boolean(data.recommendationQuote?.trim())

  return {
    page1: { recentExperiences },
    page2: hasPage2
      ? {
          earlyExperiences,
          qualifications: data.qualifications,
          recommendationQuote: data.recommendationQuote,
          recommendationAuthor: data.recommendationAuthor,
        }
      : null,
  }
}
