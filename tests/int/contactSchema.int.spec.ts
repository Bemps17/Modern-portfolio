import { describe, expect, it } from 'vitest'

import { contactSchema } from '../../src/lib/contactSchema'

describe('contactSchema', () => {
  it('accepts a valid payload', () => {
    const result = contactSchema.safeParse({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Bonjour, parlons d’un projet.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Ada',
      email: 'not-an-email',
      message: 'Bonjour, parlons d’un projet.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects honeypot-filled payloads at the schema level when website has content', () => {
    const result = contactSchema.safeParse({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Bonjour, parlons d’un projet.',
      website: 'https://spam.example',
    })
    expect(result.success).toBe(false)
  })
})
