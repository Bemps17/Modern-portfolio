import { generatePayloadCookie } from 'payload'
import { NextResponse } from 'next/server'

import {
  getAdminTestCredentials,
  isAdminTestLoginEnabled,
} from '@/lib/admin-test-access'
import { getPayloadClient } from '@/lib/payload'
import { isPayloadConfigured } from '@/lib/payload-env'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const loginUrl = new URL('/admin/login', origin)

  if (!isPayloadConfigured() || !isAdminTestLoginEnabled()) {
    return NextResponse.redirect(loginUrl)
  }

  const credentials = getAdminTestCredentials()
  if (!credentials) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.login({
      collection: 'users',
      data: credentials,
    })

    if (!result.token) {
      return NextResponse.redirect(loginUrl)
    }

    const usersCollection = payload.collections.users
    const cookie = generatePayloadCookie({
      collectionAuthConfig: usersCollection.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token: result.token,
    })

    const response = NextResponse.redirect(new URL('/admin', origin))
    response.headers.set('Set-Cookie', cookie)
    return response
  } catch (error) {
    console.error('[admin/test-login]', error)
    return NextResponse.redirect(loginUrl)
  }
}
