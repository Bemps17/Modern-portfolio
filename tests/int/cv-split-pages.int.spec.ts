import { describe, expect, it } from 'vitest'

import { splitCvPages } from '../../src/lib/cv/split-cv-pages'
import type { CvDocumentData } from '../../src/lib/cv/types'

function baseData(overrides: Partial<CvDocumentData> = {}): CvDocumentData {
  return {
    fullName: 'Bertrand Fouquet',
    tagline: 'Profil polyvalent',
    email: 'a@b.c',
    phone: null,
    location: null,
    pitch: 'Pitch',
    recommendationQuote: 'Super collab',
    recommendationAuthor: 'Directeur X',
    availabilityLabel: null,
    mobility: null,
    interests: null,
    rqthNote: null,
    showRqthOnCv: false,
    languages: [],
    competencies: [],
    experiences: [
      {
        title: 'Téléconseiller',
        company: 'Malakoff',
        dateLabel: 'nov. 2025 – Présent',
        description: 'Conseil',
        earlyCareer: false,
      },
      {
        title: 'Commercial terrain',
        company: 'Divers',
        dateLabel: '2007 – 2012',
        description: 'Prospection',
        earlyCareer: true,
      },
    ],
    qualifications: [
      {
        title: 'Infographiste',
        organization: 'AP Formation',
        yearLabel: '2023',
        description: null,
      },
    ],
    ...overrides,
  }
}

describe('splitCvPages', () => {
  it('puts only recent experiences on page 1 and the rest on page 2', () => {
    const plan = splitCvPages(baseData())
    expect(plan.page1.recentExperiences).toHaveLength(1)
    expect(plan.page1.recentExperiences[0].company).toBe('Malakoff')
    expect(plan.page2).not.toBeNull()
    expect(plan.page2!.earlyExperiences).toHaveLength(1)
    expect(plan.page2!.qualifications).toHaveLength(1)
    expect(plan.page2!.recommendationQuote).toBe('Super collab')
  })

  it('returns null page2 when there is nothing after recent experiences', () => {
    const plan = splitCvPages(
      baseData({
        experiences: [
          {
            title: 'Solo',
            company: 'Co',
            dateLabel: '2024 – Présent',
            description: 'Desc',
            earlyCareer: false,
          },
        ],
        qualifications: [],
        recommendationQuote: null,
        recommendationAuthor: null,
      }),
    )
    expect(plan.page2).toBeNull()
  })

  it('starts page2 with formations when early career is empty', () => {
    const plan = splitCvPages(
      baseData({
        experiences: [
          {
            title: 'Solo',
            company: 'Co',
            dateLabel: '2024 – Présent',
            description: 'Desc',
            earlyCareer: false,
          },
        ],
      }),
    )
    expect(plan.page2).not.toBeNull()
    expect(plan.page2!.earlyExperiences).toHaveLength(0)
    expect(plan.page2!.qualifications).toHaveLength(1)
  })
})
