import { getDatabaseUri, getPayloadSecret, isPayloadConfigured } from '@/lib/payload-env'

/**
 * Ancien bypass « 1 clic » — uniquement hors production et si flag explicite.
 * Le footer n’utilise plus cette voie.
 */
export function isAdminTestLoginEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false
  return process.env.ENABLE_ADMIN_TEST_LOGIN === 'true'
}

/** Lien footer toujours visible (point d’entrée sécurisé). */
export function isAdminLinkVisible(): boolean {
  return true
}

export function getAdminTestCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_TEST_EMAIL?.trim() || process.env.SEED_ADMIN_EMAIL?.trim()
  const password =
    process.env.ADMIN_TEST_PASSWORD?.trim() || process.env.SEED_ADMIN_PASSWORD?.trim()
  if (!email || !password) return null
  return { email, password }
}

/**
 * Footer cadenas :
 * - CMS non configuré → setup
 * - sinon → gateway (appareil de confiance ou login mot de passe)
 */
export function getAdminHref(): string {
  if (!isPayloadConfigured()) return '/setup-admin'
  return '/api/admin/gateway'
}

export function getAdminLinkTitle(): string {
  if (!isPayloadConfigured()) {
    return 'Configurer le backoffice Payload (variables Vercel manquantes)'
  }
  return 'Backoffice Payload CMS — connexion sécurisée'
}

export function getPayloadConfigSummary() {
  return {
    configured: isPayloadConfigured(),
    hasSecret: Boolean(getPayloadSecret()),
    hasDatabase: Boolean(getDatabaseUri()),
  }
}
