/** Connexion admin automatique pour tests — activer via ENABLE_ADMIN_TEST_LOGIN=true (jamais en prod sans flag explicite). */
export function isAdminTestLoginEnabled(): boolean {
  return process.env.ENABLE_ADMIN_TEST_LOGIN === 'true'
}

/** Lien footer toujours visible — /admin répond si Payload est configuré. */
export function isAdminLinkVisible(): boolean {
  return true
}

/** Lien footer : toujours /admin (page login Payload). La connexion test reste sur /api/admin/test-login. */
export function getAdminHref(): string {
  return '/admin'
}

export function getAdminTestCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_TEST_EMAIL?.trim() || process.env.SEED_ADMIN_EMAIL?.trim()
  const password =
    process.env.ADMIN_TEST_PASSWORD?.trim() || process.env.SEED_ADMIN_PASSWORD?.trim()
  if (!email || !password) return null
  return { email, password }
}
