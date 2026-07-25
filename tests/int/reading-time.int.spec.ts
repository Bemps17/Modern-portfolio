// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { estimateJournalReadingTime, lexicalToPlainText } from '@/lib/reading-time'

describe('reading-time — Lablog', () => {
  it('lexicalToPlainText extrait le texte des paragraphes', () => {
    const plain = lexicalToPlainText({
      root: {
        children: [
          {
            children: [{ text: 'Premier paragraphe.' }, { text: ' Suite.' }],
          },
        ],
      },
    })
    expect(plain).toBe('Premier paragraphe.  Suite.')
  })

  it('estimateJournalReadingTime calcule au moins 1 minute', () => {
    const minutes = estimateJournalReadingTime({
      excerpt: 'Court.',
      content: {
        root: {
          children: [{ children: [{ text: 'Un mot.' }] }],
        },
      },
    })
    expect(minutes).toBeGreaterThanOrEqual(1)
  })

  it('estimateJournalReadingTime augmente avec le volume de texte', () => {
    const words = Array.from({ length: 400 }, (_, i) => `mot${i}`).join(' ')
    const short = estimateJournalReadingTime({ excerpt: 'x', content: null })
    const long = estimateJournalReadingTime({
      excerpt: words,
      content: { root: { children: [{ children: [{ text: words }] }] } },
    })
    expect(long).toBeGreaterThan(short)
  })
})
