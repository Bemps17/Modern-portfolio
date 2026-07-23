import Link from 'next/link'
import { Home } from 'lucide-react'

import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SITE_VERSION } from '@/lib/site-version'
import { cn } from '@/lib/utils'

type FooterProps = {
  siteName: string
  email?: string | null
  adminHref?: string | null
  adminLinkTitle?: string
  showAdminLink?: boolean
  adminConfigured?: boolean
}

export function Footer({
  siteName,
  email,
  adminHref = '/admin/login',
  adminLinkTitle = 'Backoffice Payload CMS',
  showAdminLink = true,
  adminConfigured = false,
}: FooterProps) {
  return (
    <footer className="mt-16 border-t border-[color:var(--border-subtle)] px-3 pb-24 sm:px-5 lg:pb-10 xl:px-16">
      <ReadableSurface as="footer" bleed={false} strong>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-syne)] text-sm font-semibold text-[var(--foreground)]">
            {siteName}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {email ? (
              <Link
                className="text-sm text-[var(--foreground-secondary)] transition hover:text-[var(--foreground)]"
                href={`mailto:${email}`}
              >
                {email}
              </Link>
            ) : null}
            {showAdminLink && adminHref ? (
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
                <Home aria-hidden className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <span>© {new Date().getFullYear()}</span>
            <span aria-hidden className="text-[var(--muted-subtle)]">
              ·
            </span>
            <span>Next.js · Vercel</span>
            <span aria-hidden className="text-[var(--muted-subtle)]">
              ·
            </span>
            <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-wider text-[var(--muted-subtle)] tabular-nums">
              v{SITE_VERSION}
            </span>
          </div>
        </div>
      </ReadableSurface>
    </footer>
  )
}
