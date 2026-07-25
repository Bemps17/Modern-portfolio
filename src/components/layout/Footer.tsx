import Link from 'next/link'
import { Lock } from 'lucide-react'

import { ContactLink } from '@/components/ui/ContactLink'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { Container } from '@/components/ui/Container'
import type { FooterLink } from '@/lib/footer-links'
import { cn } from '@/lib/utils'

function isAdminGatewayHref(href: string): boolean {
  return href.startsWith('/api/admin/')
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('//')
}

function FooterNavLink({ link }: { link: FooterLink }) {
  const className = 'text-link text-xs'
  const openInNewTab = Boolean(link.openInNewTab) || isExternalHref(link.href)

  if (openInNewTab) {
    return (
      <a className={className} href={link.href} rel="noopener noreferrer" target="_blank">
        {link.label}
      </a>
    )
  }

  return (
    <Link className={className} href={link.href}>
      {link.label}
    </Link>
  )
}

type FooterProps = {
  siteName: string
  email?: string | null
  phone?: string | null
  footerExtraLine?: string | null
  footerLinks?: FooterLink[]
  adminHref?: string | null
  adminLinkTitle?: string
  showAdminLink?: boolean
  adminConfigured?: boolean
}

export function Footer({
  siteName,
  email,
  phone,
  footerExtraLine,
  footerLinks = [],
  adminHref = '/admin/login',
  adminLinkTitle = 'Backoffice Payload CMS',
  showAdminLink = true,
  adminConfigured = false,
}: FooterProps) {
  return (
    <footer className="mt-16 border-t border-[color:var(--border-subtle)]">
      <Container className="pb-24 lg:pb-10">
        <ReadableSurface as="footer" bleed={false} strong>
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-syne)] text-sm font-semibold text-[var(--foreground)]">
            {siteName}
          </p>
          <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            {email ? <ContactLink size="sm" type="email" value={email} /> : null}
            {phone ? <ContactLink size="sm" type="phone" value={phone} /> : null}
            {showAdminLink && adminHref ? (
              isAdminGatewayHref(adminHref) ? (
                <a
                  aria-label="Accès admin — backoffice Payload CMS"
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-glass)] text-[var(--foreground-secondary)] backdrop-blur-sm transition',
                    'hover:border-[color:var(--accent)]/35 hover:bg-[var(--glass)] hover:text-[var(--accent-soft)]',
                    !adminConfigured && 'opacity-80',
                  )}
                  href={adminHref}
                  title={adminLinkTitle}
                >
                  <Lock aria-hidden className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  aria-label="Accès admin — backoffice Payload CMS"
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-glass)] text-[var(--foreground-secondary)] backdrop-blur-sm transition',
                    'hover:border-[color:var(--accent)]/35 hover:bg-[var(--glass)] hover:text-[var(--accent-soft)]',
                    !adminConfigured && 'opacity-80',
                  )}
                  href={adminHref}
                  prefetch={false}
                  title={adminLinkTitle}
                >
                  <Lock aria-hidden className="h-4 w-4" />
                </Link>
              )
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
            <span>© {new Date().getFullYear()}</span>
            {footerExtraLine ? (
              <>
                <span aria-hidden className="text-[var(--muted-subtle)]">
                  ·
                </span>
                <span>{footerExtraLine}</span>
              </>
            ) : null}
            {footerLinks.map((link, index) => (
              <span className="contents" key={`${link.href}-${link.label}-${index}`}>
                <span aria-hidden className="text-[var(--muted-subtle)]">
                  ·
                </span>
                <FooterNavLink link={link} />
              </span>
            ))}
          </div>
        </div>
      </ReadableSurface>
      </Container>
    </footer>
  )
}
