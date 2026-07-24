import { describe, expect, it } from 'vitest'

import { portfolioFallback } from '../../src/data/portfolio-fallback'

describe('portfolioFallback experiences — Hautier copy', () => {
  it('keeps Groupe Hautier off Sonotra/PAPREC and on Transports Hautier only', () => {
    const experiences = portfolioFallback.experiences

    const sonotraPaprec = experiences.find(
      (experience) => experience.title === 'Agent de planning & Assistant d’exploitation',
    )
    expect(sonotraPaprec).toBeDefined()
    expect(sonotraPaprec!.company).toBe('Sonotra / PAPREC La Rochelle')
    expect(sonotraPaprec!.company).not.toContain('Groupe Hautier')
    expect(sonotraPaprec!.description).not.toContain('Groupe Hautier')

    const hautierMission = experiences.find(
      (experience) => experience.title === 'Chargé de projet informatique embarquée',
    )
    expect(hautierMission).toBeDefined()
    expect(hautierMission!.company).toContain('Hautier')
  })
})
