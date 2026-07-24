export type CvLanguageItem = {
  name: string
  level: string
}

export type CvCompetencyItem = {
  name: string
  level: number
  description: string
}

export type CvExperienceItem = {
  title: string
  company: string
  dateLabel: string
  description: string
  earlyCareer: boolean
}

export type CvQualificationItem = {
  title: string
  organization: string | null
  yearLabel: string | null
  description: string | null
}

export type CvDocumentData = {
  fullName: string
  tagline: string
  email: string
  phone: string | null
  location: string | null
  pitch: string
  recommendationQuote: string | null
  recommendationAuthor: string | null
  availabilityLabel: string | null
  mobility: string | null
  interests: string | null
  rqthNote: string | null
  showRqthOnCv: boolean
  languages: CvLanguageItem[]
  competencies: CvCompetencyItem[]
  experiences: CvExperienceItem[]
  qualifications: CvQualificationItem[]
}
