import { describe, expect, it } from 'vitest'

import { buildProjectCoverSvg } from '../../src/lib/project-cover-art'
import { isDuplicateCopy, normalizeComparableText } from '../../src/lib/text-dedupe'

describe('text-dedupe', () => {
  it('normalizes case and punctuation', () => {
    expect(normalizeComparableText('Hello, World!')).toBe('hello world')
  })

  it('detects identical copy', () => {
    expect(isDuplicateCopy('Suivi premium des scores.', 'suivi premium des scores')).toBe(true)
  })

  it('detects when one string contains the other', () => {
    expect(
      isDuplicateCopy(
        'Application interactive de visualisation historique.',
        'Application interactive de visualisation historique avec timeline.',
      ),
    ).toBe(true)
  })

  it('returns false for distinct messages', () => {
    expect(isDuplicateCopy('Prospection B2B', '50+ utilisateurs actifs')).toBe(false)
  })
})

describe('buildProjectCoverSvg', () => {
  it('does not embed the project title as readable cover text', () => {
    const svg = buildProjectCoverSvg('World Cup Scores 2026', 'world-cup-scores-2026', 'Next.js')
    expect(svg).not.toContain('World Cup Scores 2026')
    expect(svg).not.toContain('Next.js')
    expect(svg).toContain('WC')
  })
})
