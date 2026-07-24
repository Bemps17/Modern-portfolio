function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

/** Lien partageable : PDF en aperçu inline (pas en téléchargement forcé). */
export function buildCvShareUrl(siteUrl: string): string {
  return `${trimTrailingSlash(siteUrl)}/api/cv?preview=1`
}

export function buildMailtoShareUrl(cvUrl: string, fullName: string): string {
  const subject = `CV — ${fullName}`
  const body = `Bonjour,\n\nVoici mon CV : ${cvUrl}\n`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildWhatsAppShareUrl(cvUrl: string, fullName: string): string {
  const text = `CV — ${fullName}\n${cvUrl}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function buildLinkedInShareUrl(cvUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cvUrl)}`
}
