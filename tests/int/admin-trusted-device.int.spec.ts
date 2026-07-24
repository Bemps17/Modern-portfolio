import { describe, expect, it } from 'vitest'

import {
  createTrustedDeviceId,
  createTrustedDeviceSecret,
  encodeTrustedDeviceCookie,
  hashDeviceSecret,
  parseTrustedDeviceCookie,
} from '../../src/lib/admin-trusted-device'
import { getAdminHref } from '../../src/lib/admin-test-access'

describe('admin trusted device helpers', () => {
  it('round-trips cookie payload', () => {
    const deviceId = createTrustedDeviceId()
    const secret = createTrustedDeviceSecret()
    const raw = encodeTrustedDeviceCookie(deviceId, secret)
    expect(parseTrustedDeviceCookie(raw)).toEqual({ deviceId, secret })
  })

  it('hashes secrets stably', () => {
    const secret = 'test-secret'
    expect(hashDeviceSecret(secret)).toBe(hashDeviceSecret(secret))
    expect(hashDeviceSecret(secret)).not.toBe(hashDeviceSecret('other'))
  })

  it('rejects malformed cookies', () => {
    expect(parseTrustedDeviceCookie('')).toBeNull()
    expect(parseTrustedDeviceCookie('noperiod')).toBeNull()
    expect(parseTrustedDeviceCookie('.nosecret')).toBeNull()
  })
})

describe('admin entry href', () => {
  it('never exposes the legacy one-click login from the footer', () => {
    expect(getAdminHref()).not.toBe('/api/admin/test-login')
    expect(['/api/admin/gateway', '/setup-admin']).toContain(getAdminHref())
  })
})
