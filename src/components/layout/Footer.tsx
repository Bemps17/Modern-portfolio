import Link from 'next/link'
import { Home } from 'lucide-react'

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
    <footer className="mt-24 border-t border-white/10 pb-24 lg:pb-10">
      <div className="flex flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between xl:px-16">
        <p className="font-[family-name:var(--font-syne)] text-sm font-semibold">{siteName}</p>
        <div className="flex flex-wrap items-center gap-4">
          {email ? (
            <Link className="text-sm text-[var(--muted)] hover:text-white" href={`mailto:${email}`}>
              {email}
            </Link>
          ) : null}
          {showAdminLink && adminHref ? (
            <Link
              aria-label="Accès admin — backoffice Payload CMS"
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-[var(--muted)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition',
                'hover:border-[color:var(--accent)]/35 hover:bg-white/[0.1] hover:text-[var(--accent-soft)]',
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
          <span aria-hidden className="text-white/15">
            ·
          </span>
          <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-wider text-[var(--muted)]/45 tabular-nums">
            v{SITE_VERSION}
          </span>
        </div>
      </div>
    </footer>
  )
}
