import { describe, expect, it } from 'vitest'

import { CV_PDF_LAYOUT } from '../../src/lib/cv/pdf-layout'

describe('CV_PDF_LAYOUT', () => {
  it('keeps readable type and comfortable margins', () => {
    expect(CV_PDF_LAYOUT.pagePaddingTop).toBeGreaterThanOrEqual(28)
    expect(CV_PDF_LAYOUT.pagePaddingBottom).toBeGreaterThanOrEqual(36)
    expect(CV_PDF_LAYOUT.mainPaddingHorizontal).toBeGreaterThanOrEqual(20)
    expect(CV_PDF_LAYOUT.headerNameFontSize).toBeGreaterThanOrEqual(16)
    expect(CV_PDF_LAYOUT.sectionTitleFontSize).toBeGreaterThanOrEqual(9.5)
    expect(CV_PDF_LAYOUT.bodyFontSize).toBeGreaterThanOrEqual(8.5)
    expect(CV_PDF_LAYOUT.sideBodyFontSize).toBeGreaterThanOrEqual(7.5)
    expect(CV_PDF_LAYOUT.recentDescriptionMaxChars).toBeGreaterThanOrEqual(180)
  })
})
