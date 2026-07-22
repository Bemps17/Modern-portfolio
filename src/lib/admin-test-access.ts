import { getDatabaseUri, getPayloadSecret, isPayloadConfigured } from '@/lib/payload-env'

/** Connexion admin automatique — activer via ENABLE_ADMIN_TEST_LOGIN=true sur Vercel. */
export function isAdminTestLoginEnabled(): boolean {
  return process.env.ENABLE_ADMIN_TEST_LOGIN === 'true'
}

/** Lien footer toujours visible. */
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

function isOneClickAdminLoginAvailable(): boolean {
  return (
    isPayloadConfigured() && isAdminTestLoginEnabled() && getAdminTestCredentials() !== null
  )
}

/** Footer : connexion 1 clic si configuré, sinon setup ou login. */
export function getAdminHref(): string {
  if (isOneClickAdminLoginAvailable()) return '/api/admin/test-login'
  if (isPayloadConfigured()) return '/admin/login'
  return '/setup-admin'
}

export function getAdminLinkTitle(): string {
  if (isOneClickAdminLoginAvailable()) return 'Backoffice — connexion en 1 clic'
  if (isPayloadConfigured()) return 'Backoffice Payload CMS — se connecter'
  return 'Configurer le backoffice Payload (variables Vercel manquantes)'
}

export function getPayloadConfigSummary() {
  return {
    configured: isPayloadConfigured(),
    hasSecret: Boolean(getPayloadSecret()),
    hasDatabase: Boolean(getDatabaseUri()),
  }
}
