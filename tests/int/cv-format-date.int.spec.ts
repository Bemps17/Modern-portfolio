import { describe, expect, it } from 'vitest'

import { formatCvDateRange, formatCvMonthYear } from '../../src/lib/cv/format-date-range'

describe('formatCvDateRange', () => {
  it('formats a closed range as MM/YYYY - MM/YYYY', () => {
    expect(formatCvDateRange('2023-10-01', '2024-06-01', false)).toBe('10/2023 - 06/2024')
  })

  it('uses Présent when current is true', () => {
    expect(formatCvDateRange('2025-11-01', null, true)).toBe('11/2025 - Présent')
  })

  it('uses Présent when current is true even if dateEnd is set', () => {
    expect(formatCvDateRange('2025-11-01', '2026-01-01', true)).toBe('11/2025 - Présent')
  })

  it('formats a single month as MM/YYYY', () => {
    expect(formatCvMonthYear('2025-11-01')).toBe('11/2025')
  })
})
