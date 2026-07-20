import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/projets', label: 'Projets' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

type HeaderProps = {
  siteName: string
}

export function Header({ siteName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-xl lg:block">
      <Container className="flex h-16 items-center justify-between">
        <Link className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight" href="/">
          {siteName}
        </Link>
        <nav aria-label="Navigation principale" className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              className={cn('text-sm text-[var(--muted)] transition hover:text-white')}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  )
}
