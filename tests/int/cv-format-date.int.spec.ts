import { describe, expect, it } from 'vitest'

import { formatCvDateRange } from '../../src/lib/cv/format-date-range'

describe('formatCvDateRange', () => {
  it('formats a closed range in French abbreviated months', () => {
    expect(formatCvDateRange('2023-10-01', '2024-06-01', false)).toBe('oct. 2023 – juin 2024')
  })

  it('uses Présent when current is true', () => {
    expect(formatCvDateRange('2025-11-01', null, true)).toBe('nov. 2025 – Présent')
  })

  it('uses Présent when current is true even if dateEnd is set', () => {
    expect(formatCvDateRange('2025-11-01', '2026-01-01', true)).toBe('nov. 2025 – Présent')
  })
})
