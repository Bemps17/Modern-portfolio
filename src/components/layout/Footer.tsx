import Link from 'next/link'
import { Lock } from 'lucide-react'

import { SITE_VERSION } from '@/lib/site-version'

type FooterProps = {
  siteName: string
  email?: string | null
  adminHref?: string | null
  showAdminLink?: boolean
}

export function Footer({
  siteName,
  email,
  adminHref = '/admin',
  showAdminLink = true,
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
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--accent-soft)]"
              href={adminHref}
              prefetch={false}
            >
              <Lock aria-hidden className="h-3.5 w-3.5" />
              Accès admin
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
