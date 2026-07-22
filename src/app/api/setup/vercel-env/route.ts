import { NextResponse } from 'next/server'

import { isPayloadConfigured } from '@/lib/payload-env'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const DEFAULT_PROJECT_ID = 'prj_tjETaKIa0PFAUQuqD5ZfCf8vC3kw'
const DEFAULT_TEAM_ID = 'team_bDrALhuIP24RecBVIFibd3aV'

type SetupBody = {
  vercelToken?: string
  databaseUri?: string
  payloadSecret?: string
  siteUrl?: string
  enableAdminTestLogin?: boolean
  seedAdminEmail?: string
  seedAdminPassword?: string
  projectId?: string
  teamId?: string
}

type VercelEnvItem = {
  id: string
  key: string
  target?: string[]
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

async function vercelFetch(
  token: string,
  path: string,
  init?: RequestInit & { teamId?: string },
) {
  const url = new URL(`https://api.vercel.com${path}`)
  if (init?.teamId) url.searchParams.set('teamId', init.teamId)
  const { teamId: _teamId, ...rest } = init || {}
  const response = await fetch(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
  })
  const text = await response.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }
  return { response, data }
}

async function upsertEnv(
  token: string,
  projectId: string,
  teamId: string,
  key: string,
  value: string,
  existing: VercelEnvItem[],
) {
  const targets = ['production', 'preview', 'development'] as const
  const matches = existing.filter((item) => item.key === key)

  for (const match of matches) {
    await vercelFetch(token, `/v9/projects/${projectId}/env/${match.id}`, {
      method: 'DELETE',
      teamId,
    })
  }

  const created = await vercelFetch(token, `/v10/projects/${projectId}/env`, {
    method: 'POST',
    teamId,
    body: JSON.stringify({
      key,
      value,
      type: 'encrypted',
      target: [...targets],
    }),
  })

  if (!created.response.ok) {
    const message =
      typeof created.data === 'object' &&
      created.data &&
      'error' in created.data &&
      typeof (created.data as { error?: { message?: string } }).error?.message === 'string'
        ? (created.data as { error: { message: string } }).error.message
        : `Échec création ${key} (${created.response.status})`
    throw new Error(message)
  }
}

export async function POST(request: Request) {
  if (isPayloadConfigured()) {
    return jsonError(
      'Payload est déjà configuré. Désactivez ce bootstrap en retirant /setup-admin.',
      403,
    )
  }

  let body: SetupBody
  try {
    body = (await request.json()) as SetupBody
  } catch {
    return jsonError('JSON invalide')
  }

  const vercelToken = body.vercelToken?.trim()
  const databaseUri = body.databaseUri?.trim()
  const payloadSecret = body.payloadSecret?.trim()
  const siteUrl =
    body.siteUrl?.trim() || 'https://modern-portfolio-two-orcin.vercel.app'
  const projectId = body.projectId?.trim() || DEFAULT_PROJECT_ID
  const teamId = body.teamId?.trim() || DEFAULT_TEAM_ID

  if (!vercelToken) return jsonError('vercelToken requis')
  if (!databaseUri) return jsonError('databaseUri requis (connection string Neon pooler)')
  if (!payloadSecret || payloadSecret.length < 32) {
    return jsonError('payloadSecret requis (≥ 32 caractères)')
  }

  try {
    const whoami = await vercelFetch(vercelToken, '/v2/user')
    if (!whoami.response.ok) {
      return jsonError('Token Vercel invalide — créez-en un sur vercel.com/account/tokens', 401)
    }

    const envList = await vercelFetch(vercelToken, `/v9/projects/${projectId}/env`, {
      teamId,
    })
    if (!envList.response.ok) {
      return jsonError(
        `Impossible de lire les env du projet (${envList.response.status}). Vérifiez le token et le projet.`,
        400,
      )
    }

    const existing =
      typeof envList.data === 'object' &&
      envList.data &&
      'envs' in envList.data &&
      Array.isArray((envList.data as { envs: VercelEnvItem[] }).envs)
        ? (envList.data as { envs: VercelEnvItem[] }).envs
        : []

    const vars: Record<string, string> = {
      DATABASE_URI: databaseUri,
      PAYLOAD_SECRET: payloadSecret,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    }

    if (body.enableAdminTestLogin !== false) {
      vars.ENABLE_ADMIN_TEST_LOGIN = 'true'
      if (body.seedAdminEmail?.trim()) vars.SEED_ADMIN_EMAIL = body.seedAdminEmail.trim()
      if (body.seedAdminPassword?.trim()) {
        vars.SEED_ADMIN_PASSWORD = body.seedAdminPassword.trim()
      }
    }

    const applied: string[] = []
    for (const [key, value] of Object.entries(vars)) {
      await upsertEnv(vercelToken, projectId, teamId, key, value, existing)
      applied.push(key)
    }

    const deployments = await vercelFetch(
      vercelToken,
      `/v6/deployments?projectId=${encodeURIComponent(projectId)}&target=production&limit=1`,
      { teamId },
    )

    let redeployId: string | null = null
    if (
      deployments.response.ok &&
      typeof deployments.data === 'object' &&
      deployments.data &&
      'deployments' in deployments.data &&
      Array.isArray((deployments.data as { deployments: { uid?: string }[] }).deployments) &&
      (deployments.data as { deployments: { uid?: string }[] }).deployments[0]?.uid
    ) {
      const latest = (deployments.data as { deployments: { uid: string }[] }).deployments[0]
      const redeploy = await vercelFetch(vercelToken, `/v13/deployments/${latest.uid}/redeploy`, {
        method: 'POST',
        teamId,
        body: JSON.stringify({}),
      })
      if (
        redeploy.response.ok &&
        typeof redeploy.data === 'object' &&
        redeploy.data &&
        'id' in redeploy.data
      ) {
        redeployId = String((redeploy.data as { id: string }).id)
      }
    }

    return NextResponse.json({
      ok: true,
      applied,
      redeployId,
      healthUrl: `${siteUrl}/payload-health`,
      adminUrl: `${siteUrl}/admin`,
      hint: 'Attendez 1–2 min que le redeploy soit Ready, puis ouvrez /payload-health (ok:true) et l’icône maison du footer.',
    })
  } catch (error) {
    console.error('[setup/vercel-env]', error)
    return jsonError(error instanceof Error ? error.message : 'Erreur setup Vercel', 500)
  }
}
