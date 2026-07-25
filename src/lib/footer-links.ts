export type FooterLink = {
  label: string
  href: string
  openInNewTab?: boolean | null
}

export const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

/** Liens footer : CMS si renseignés, sinon mentions légales + confidentialité par défaut. */
export function resolveFooterLinks(cmsLinks: FooterLink[] | null | undefined): FooterLink[] {
  if (!cmsLinks?.length) return DEFAULT_FOOTER_LINKS
  return cmsLinks
}
