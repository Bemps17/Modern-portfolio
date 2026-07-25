// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  buildFormSubmissionEmail,
  shouldNotifyFormSubmission,
} from '@/lib/form-submission-notify'

describe('form-submission-notify', () => {
  it('buildFormSubmissionEmail inclut nom, email et message', () => {
    const email = buildFormSubmissionEmail({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Bonjour, parlons d’un projet.',
    })

    expect(email.subject).toBe('Nouveau message de Ada Lovelace')
    expect(email.replyTo).toBe('ada@example.com')
    expect(email.text).toContain('Ada Lovelace')
    expect(email.text).toContain('ada@example.com')
    expect(email.text).toContain('Bonjour, parlons d’un projet.')
  })

  it('shouldNotifyFormSubmission est true uniquement à la création', () => {
    expect(shouldNotifyFormSubmission({ operation: 'create' })).toBe(true)
    expect(shouldNotifyFormSubmission({ operation: 'update' })).toBe(false)
  })
})
