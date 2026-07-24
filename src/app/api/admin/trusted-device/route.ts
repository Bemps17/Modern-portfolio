import { NextResponse } from 'next/server'

import {
  buildTrustedDeviceCookieHeader,
  clearTrustedDeviceCookieHeader,
  createTrustedDeviceId,
  createTrustedDeviceSecret,
  deviceLabelFromUserAgent,
  hashDeviceSecret,
  parseTrustedDeviceCookie,
  TRUSTED_DEVICE_COOKIE,
  type TrustedDeviceRecord,
} from '@/lib/admin-trusted-device'
import { getPayloadClient } from '@/lib/payload'
import { isPayloadConfigured } from '@/lib/payload-env'

export const dynamic = 'force-dynamic'

type RegisterBody = {
  label?: string
}

export async function POST(request: Request) {
  if (!isPayloadConfigured()) {
    return NextResponse.json({ ok: false, error: 'CMS non configuré' }, { status: 503 })
  }

  try {
    const payload = await getPayloadClient()
    const auth = await payload.auth({ headers: request.headers })
    if (!auth.user) {
      return NextResponse.json({ ok: false, error: 'Non authentifié' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as RegisterBody
    const deviceId = createTrustedDeviceId()
    const secret = createTrustedDeviceSecret()
    const label =
      body.label?.trim() || deviceLabelFromUserAgent(request.headers.get('user-agent'))

    const fresh = await payload.findByID({
      collection: 'users',
      id: auth.user.id,
      depth: 0,
      overrideAccess: true,
    })

    const existing = (fresh.trustedDevices || []) as TrustedDeviceRecord[]
    const nextDevice: TrustedDeviceRecord = {
      deviceId,
      label,
      secretHash: hashDeviceSecret(secret),
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    }

    await payload.update({
      collection: 'users',
      id: auth.user.id,
      data: {
        trustedDevices: [...existing, nextDevice],
      },
      overrideAccess: true,
    })

    const response = NextResponse.json({
      ok: true,
      deviceId,
      label,
      message: 'Appareil enregistré — les prochaines connexions depuis cet appareil ne demanderont pas le mot de passe.',
    })
    response.headers.set(
      'Set-Cookie',
      buildTrustedDeviceCookieHeader(`${deviceId}.${secret}`),
    )
    return response
  } catch (error) {
    console.error('[admin/trusted-device POST]', error)
    return NextResponse.json({ ok: false, error: 'Impossible d’enregistrer l’appareil' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isPayloadConfigured()) {
    return NextResponse.json({ ok: false, error: 'CMS non configuré' }, { status: 503 })
  }

  try {
    const payload = await getPayloadClient()
    const auth = await payload.auth({ headers: request.headers })
    if (!auth.user) {
      return NextResponse.json({ ok: false, error: 'Non authentifié' }, { status: 401 })
    }

    const url = new URL(request.url)
    const deviceId = url.searchParams.get('deviceId')?.trim()
    const revokeAll = url.searchParams.get('all') === '1'

    const fresh = await payload.findByID({
      collection: 'users',
      id: auth.user.id,
      depth: 0,
      overrideAccess: true,
    })

    const existing = (fresh.trustedDevices || []) as TrustedDeviceRecord[]
    const remaining = revokeAll
      ? []
      : deviceId
        ? existing.filter((device) => device.deviceId !== deviceId)
        : existing

    await payload.update({
      collection: 'users',
      id: auth.user.id,
      data: { trustedDevices: remaining },
      overrideAccess: true,
    })

    const response = NextResponse.json({ ok: true })
    const rawCookie = request.headers
      .get('cookie')
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${TRUSTED_DEVICE_COOKIE}=`))
      ?.slice(TRUSTED_DEVICE_COOKIE.length + 1)
    const parsed = parseTrustedDeviceCookie(rawCookie ? decodeURIComponent(rawCookie) : null)

    if (revokeAll || (parsed && (!deviceId || parsed.deviceId === deviceId))) {
      response.headers.set('Set-Cookie', clearTrustedDeviceCookieHeader())
    }

    return response
  } catch (error) {
    console.error('[admin/trusted-device DELETE]', error)
    return NextResponse.json({ ok: false, error: 'Impossible de révoquer l’appareil' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  if (!isPayloadConfigured()) {
    return NextResponse.json({ ok: false, error: 'CMS non configuré' }, { status: 503 })
  }

  try {
    const payload = await getPayloadClient()
    const auth = await payload.auth({ headers: request.headers })
    if (!auth.user) {
      return NextResponse.json({ ok: false, error: 'Non authentifié' }, { status: 401 })
    }

    const fresh = await payload.findByID({
      collection: 'users',
      id: auth.user.id,
      depth: 0,
      overrideAccess: true,
    })

    const devices = ((fresh.trustedDevices || []) as TrustedDeviceRecord[]).map((device) => ({
      deviceId: device.deviceId,
      label: device.label,
      createdAt: device.createdAt,
      lastUsedAt: device.lastUsedAt ?? null,
    }))

    const rawCookie = request.headers
      .get('cookie')
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${TRUSTED_DEVICE_COOKIE}=`))
      ?.slice(TRUSTED_DEVICE_COOKIE.length + 1)
    const parsed = parseTrustedDeviceCookie(rawCookie ? decodeURIComponent(rawCookie) : null)

    return NextResponse.json({
      ok: true,
      devices,
      currentDeviceId: parsed?.deviceId ?? null,
    })
  } catch (error) {
    console.error('[admin/trusted-device GET]', error)
    return NextResponse.json({ ok: false, error: 'Impossible de lister les appareils' }, { status: 500 })
  }
}
