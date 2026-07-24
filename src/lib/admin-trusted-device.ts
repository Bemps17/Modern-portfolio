import { createHash, randomBytes } from 'node:crypto'

export const TRUSTED_DEVICE_COOKIE = 'portfolio-admin-device'
/** 90 jours */
export const TRUSTED_DEVICE_MAX_AGE_SEC = 60 * 60 * 24 * 90

export type TrustedDeviceRecord = {
  deviceId: string
  label: string
  secretHash: string
  createdAt: string
  lastUsedAt?: string | null
  id?: string | null
}

export function hashDeviceSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex')
}

export function createTrustedDeviceSecret(): string {
  return randomBytes(32).toString('base64url')
}

export function createTrustedDeviceId(): string {
  return randomBytes(16).toString('base64url')
}

/** Cookie value: `deviceId.secret` */
export function encodeTrustedDeviceCookie(deviceId: string, secret: string): string {
  return `${deviceId}.${secret}`
}

export function parseTrustedDeviceCookie(raw: string | undefined | null): {
  deviceId: string
  secret: string
} | null {
  if (!raw) return null
  const separator = raw.indexOf('.')
  if (separator <= 0 || separator === raw.length - 1) return null
  const deviceId = raw.slice(0, separator)
  const secret = raw.slice(separator + 1)
  if (!deviceId || !secret) return null
  return { deviceId, secret }
}

export function deviceLabelFromUserAgent(userAgent: string | null): string {
  const ua = userAgent || 'Appareil inconnu'
  const browser =
    /Edg\//.test(ua) ? 'Edge'
    : /Chrome\//.test(ua) ? 'Chrome'
    : /Firefox\//.test(ua) ? 'Firefox'
    : /Safari\//.test(ua) ? 'Safari'
    : 'Navigateur'
  const os =
    /Windows/i.test(ua) ? 'Windows'
    : /Mac OS X|Macintosh/i.test(ua) ? 'macOS'
    : /Android/i.test(ua) ? 'Android'
    : /iPhone|iPad/i.test(ua) ? 'iOS'
    : /Linux/i.test(ua) ? 'Linux'
    : 'OS'
  return `${browser} · ${os}`
}

export function buildTrustedDeviceCookieHeader(value: string, maxAge = TRUSTED_DEVICE_MAX_AGE_SEC): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${TRUSTED_DEVICE_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

export function clearTrustedDeviceCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${TRUSTED_DEVICE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}
