import { describe, expect, it } from 'vitest'

import { buildCvDocumentData } from '../../src/lib/cv/build-cv-data'

describe('buildCvDocumentData', () => {
  it('maps settings, experiences and qualifications into CvDocumentData', () => {
    const data = buildCvDocumentData({
      settings: {
        siteName: 'Bertrand Fouquet',
        tagline: 'Profil polyvalent',
        email: 'bertrandfouquet@gmail.com',
        phone: '06 66 93 82 35',
        location: '17138 Puilboreau',
        cvPitch:
          'Professionnel expérimenté avec plus de 10 ans d’expérience dans la relation client.',
        aboutIntro: 'Intro courte Hero',
        recommendationQuote: 'Bertrand a su redynamiser notre prospection.',
        recommendationAuthor: 'Directeur Commercial, Entreprise X',
        availabilityLabel: 'Disponible immédiatement',
        mobility: 'Permis B — véhicule personnel, déplacements régionaux',
        interests: 'Création visuelle, Technologie, Art',
        rqthNote: 'RQTH — adaptations possibles du poste de travail.',
        showRqthOnCv: true,
        languages: [
          { name: 'Anglais', level: 'Conversationnel' },
          { name: 'Espagnol', level: 'Scolaire' },
        ],
        cvCompetencies: [
          {
            name: 'Prospection B2B/B2C',
            level: 85,
            description: 'Qualification de leads et conversion',
          },
        ],
      },
      experiences: [
        {
          title: 'Téléconseiller',
          company: 'Malakoff Humanis',
          dateStart: '2025-11-01',
          dateEnd: null,
          current: true,
          earlyCareer: false,
          description: 'Relation client et conseil.',
        },
        {
          title: 'Attaché Commercial Terrain',
          company: 'Diverses entreprises',
          dateStart: '2007-01-01',
          dateEnd: '2012-12-01',
          current: false,
          earlyCareer: true,
          description: 'Prospection B2B terrain.',
        },
      ],
      qualifications: [
        {
          title: 'Infographiste Designer Web',
          organization: 'AP Formation',
          year: 2023,
          description: 'Design graphique et web.',
        },
      ],
    })

    expect(data.fullName).toBe('Bertrand Fouquet')
    expect(data.pitch).toContain('10 ans')
    expect(data.phone).toBe('06 66 93 82 35')
    expect(data.experiences).toHaveLength(2)
    expect(data.experiences[0].dateLabel).toBe('nov. 2025 – Présent')
    expect(data.experiences[0].earlyCareer).toBe(false)
    expect(data.experiences[1].earlyCareer).toBe(true)
    expect(data.qualifications[0].yearLabel).toBe('2023')
    expect(data.competencies[0].level).toBe(85)
    expect(data.showRqthOnCv).toBe(true)
    expect(data.languages).toHaveLength(2)
  })

  it('falls back pitch to aboutIntro when cvPitch is empty', () => {
    const data = buildCvDocumentData({
      settings: {
        siteName: 'Bertrand Fouquet',
        tagline: 'Tag',
        email: 'a@b.c',
        phone: null,
        location: null,
        cvPitch: null,
        aboutIntro: 'Pitch de secours',
        recommendationQuote: null,
        recommendationAuthor: null,
        availabilityLabel: null,
        mobility: null,
        interests: null,
        rqthNote: null,
        showRqthOnCv: false,
        languages: [],
        cvCompetencies: [],
      },
      experiences: [],
      qualifications: [],
    })
    expect(data.pitch).toBe('Pitch de secours')
    expect(data.showRqthOnCv).toBe(false)
  })

  it('clamps competency level between 0 and 100', () => {
    const data = buildCvDocumentData({
      settings: {
        siteName: 'Bertrand Fouquet',
        tagline: 'Tag',
        email: 'a@b.c',
        phone: null,
        location: null,
        cvPitch: 'Pitch',
        aboutIntro: null,
        recommendationQuote: null,
        recommendationAuthor: null,
        availabilityLabel: null,
        mobility: null,
        interests: null,
        rqthNote: null,
        showRqthOnCv: false,
        languages: [],
        cvCompetencies: [{ name: 'X', level: 140, description: 'Y' }],
      },
      experiences: [],
      qualifications: [],
    })
    expect(data.competencies[0].level).toBe(100)
  })
})
