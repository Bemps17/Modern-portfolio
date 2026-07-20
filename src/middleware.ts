import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 60_000
const MAX_LOGIN_ATTEMPTS = 10
const MAX_CONTACT_ATTEMPTS = 8

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/users/login', '/api/contact'],
}
