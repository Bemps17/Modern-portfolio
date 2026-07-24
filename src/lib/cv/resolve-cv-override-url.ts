/**
 * Resolves a CV override media URL for server-side fetch.
 * Relative Payload paths (`/api/media/file/...`) become absolute using `siteUrl`.
 */
export function resolveCvOverrideUrl(url: string | null, siteUrl: string): string | null {
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('/')) {
    const base = siteUrl.replace(/\/$/, '')
    return `${base}${url}`
  }

  return null
}
