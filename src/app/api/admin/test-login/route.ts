import { NextResponse } from 'next/server'

import {
  getAdminTestCredentials,
  isAdminTestLoginEnabled,
} from '@/lib/admin-test-access'
import { isPayloadConfigured } from '@/lib/payload-env'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = getSiteUrl()
  const loginUrl = new URL('/admin/login', siteUrl)

  if (!isPayloadConfigured() || !isAdminTestLoginEnabled()) {
    return NextResponse.redirect(loginUrl)
  }

  const credentials = getAdminTestCredentials()
  if (!credentials) {
    return NextResponse.redirect(loginUrl)
  }

  const loginResponse = await fetch(new URL('/api/users/login', siteUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!loginResponse.ok) {
    return NextResponse.redirect(loginUrl)
  }

  const adminUrl = new URL('/admin', siteUrl)
  const response = NextResponse.redirect(adminUrl)
  const setCookie = loginResponse.headers.get('set-cookie')

  if (setCookie) {
    response.headers.set('Set-Cookie', setCookie)
  }

  return response
}
