import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 60_000
const MAX_LOGIN_ATTEMPTS = 10
const MAX_CONTACT_ATTEMPTS = 8
const MAX_GATEWAY_ATTEMPTS = 30
const MAX_TRUSTED_DEVICE_ATTEMPTS = 20

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function take(key: string, limit: number): boolean {
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = clientIp(req)

  if (pathname === '/api/users/login' && req.method === 'POST') {
    if (!take(`login:${ip}`, MAX_LOGIN_ATTEMPTS)) {
      return NextResponse.json({ errors: [{ message: 'Too many login attempts' }] }, { status: 429 })
    }
  }

  if (pathname === '/api/contact' && req.method === 'POST') {
    if (!take(`contact:${ip}`, MAX_CONTACT_ATTEMPTS)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  if (pathname === '/api/admin/gateway' && req.method === 'GET') {
    if (!take(`gateway:${ip}`, MAX_GATEWAY_ATTEMPTS)) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  if (pathname === '/api/admin/trusted-device') {
    if (!take(`trusted-device:${ip}`, MAX_TRUSTED_DEVICE_ATTEMPTS)) {
      return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })
    }
  }

  if (pathname === '/api/admin/test-login' && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/users/login',
    '/api/contact',
    '/api/admin/gateway',
    '/api/admin/trusted-device',
    '/api/admin/test-login',
  ],
}
