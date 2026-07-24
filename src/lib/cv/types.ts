export type CvLanguageItem = {
  name: string
  level: string
}

/** Catégorie de compétences textuelles (ATS) — pas de pourcentages. */
export type CvCompetencyItem = {
  name: string
  items: string[]
}

export type CvExperienceItem = {
  title: string
  company: string
  /** Libellé ATS : MM/AAAA - MM/AAAA ou MM/AAAA - Présent */
  dateLabel: string
  /** ISO dateStart pour attribut datetime HTML */
  dateStart: string
  dateEnd: string | null
  current: boolean
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
  /** Intitulé de poste sous le nom (ATS). */
  jobTitle: string
  /** Phrase d'accroche / sous-titre. */
  tagline: string
  email: string
  phone: string | null
  location: string | null
  pitch: string
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
