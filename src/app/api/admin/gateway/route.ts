import { NextResponse } from 'next/server'

import { mintPayloadAdminSession } from '@/lib/admin-session'
import {
  hashDeviceSecret,
  parseTrustedDeviceCookie,
  TRUSTED_DEVICE_COOKIE,
  type TrustedDeviceRecord,
} from '@/lib/admin-trusted-device'
import { getPayloadClient } from '@/lib/payload'
import { isPayloadConfigured } from '@/lib/payload-env'

export const dynamic = 'force-dynamic'

function redirectLogin(origin: string) {
  return NextResponse.redirect(new URL('/admin/login', origin))
}

function redirectAdmin(origin: string) {
  return NextResponse.redirect(new URL('/admin', origin))
}

function redirectSetup(origin: string) {
  return NextResponse.redirect(new URL('/setup-admin', origin))
}

function redirectHome(origin: string) {
  return NextResponse.redirect(new URL('/', origin))
}

/**
 * Point d’entrée du cadenas footer :
 * - CMS non configuré → setup
 * - Session Payload déjà valide → /admin
 * - Appareil de confiance → session auto → /admin
 * - Sinon → /admin/login (mot de passe requis)
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin

  if (!isPayloadConfigured()) {
    return redirectSetup(origin)
  }

  try {
    const payload = await getPayloadClient()
    const auth = await payload.auth({ headers: request.headers })
    if (auth.user) {
      return redirectAdmin(origin)
    }

    const rawCookie = request.headers
      .get('cookie')
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${TRUSTED_DEVICE_COOKIE}=`))
      ?.slice(TRUSTED_DEVICE_COOKIE.length + 1)

    const parsed = parseTrustedDeviceCookie(rawCookie ? decodeURIComponent(rawCookie) : null)
    if (!parsed) {
      return redirectLogin(origin)
    }

    const users = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 50,
      overrideAccess: true,
    })

    const secretHash = hashDeviceSecret(parsed.secret)
    let matchedUser: (typeof users.docs)[number] | null = null
    let matchedDevice: TrustedDeviceRecord | null = null

    for (const user of users.docs) {
      const devices = (user.trustedDevices || []) as TrustedDeviceRecord[]
      const device = devices.find(
        (item) => item.deviceId === parsed.deviceId && item.secretHash === secretHash,
      )
      if (device) {
        matchedUser = user
        matchedDevice = device
        break
      }
    }

    if (!matchedUser || !matchedDevice) {
      return redirectLogin(origin)
    }

    const sessionCookie = await mintPayloadAdminSession({
      payload,
      user: matchedUser as never,
    })

    const updatedDevices = ((matchedUser.trustedDevices || []) as TrustedDeviceRecord[]).map(
      (device) =>
        device.deviceId === matchedDevice.deviceId
          ? { ...device, lastUsedAt: new Date().toISOString() }
          : device,
    )

    await payload.update({
      collection: 'users',
      id: matchedUser.id,
      data: { trustedDevices: updatedDevices },
      overrideAccess: true,
    })

    const response = redirectAdmin(origin)
    response.headers.append('Set-Cookie', sessionCookie)
    return response
  } catch (error) {
    console.error('[admin/gateway]', error)
    return redirectHome(origin)
  }
}
