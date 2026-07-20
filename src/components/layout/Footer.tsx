import Link from 'next/link'

type FooterProps = {
  siteName: string
  email?: string | null
}

export function Footer({ siteName, email }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-white/10 pb-24 lg:pb-10">
      <div className="flex flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between xl:px-16">
        <p className="font-[family-name:var(--font-syne)] text-sm font-semibold">{siteName}</p>
        {email ? (
          <Link className="text-sm text-[var(--muted)] hover:text-white" href={`mailto:${email}`}>
            {email}
          </Link>
        ) : null}
        <p className="text-xs text-[var(--muted)]">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
