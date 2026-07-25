// @vitest-environment node
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'

import { checkContactRateLimit, resetContactRateLimitForTests } from '@/lib/contact-rate-limit'

describe('contact-rate-limit', () => {
  beforeEach(() => {
    resetContactRateLimitForTests()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('autorise les premières soumissions dans la fenêtre', () => {
    expect(checkContactRateLimit('127.0.0.1')).toEqual({ allowed: true })
    expect(checkContactRateLimit('127.0.0.1')).toEqual({ allowed: true })
    expect(checkContactRateLimit('127.0.0.1')).toEqual({ allowed: true })
  })

  it('bloque après le quota par IP', () => {
    for (let i = 0; i < 3; i++) {
      expect(checkContactRateLimit('10.0.0.1').allowed).toBe(true)
    }
    expect(checkContactRateLimit('10.0.0.1')).toEqual({
      allowed: false,
      retryAfterSeconds: expect.any(Number),
    })
  })

  it('réinitialise le quota après la fenêtre', () => {
    for (let i = 0; i < 3; i++) checkContactRateLimit('10.0.0.2')
    expect(checkContactRateLimit('10.0.0.2').allowed).toBe(false)

    vi.advanceTimersByTime(61_000)
    expect(checkContactRateLimit('10.0.0.2')).toEqual({ allowed: true })
  })
})
