'use client'

import { FolderKanban, Github, Home, Linkedin, Mail, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BrandLogo } from '@/components/layout/BrandLogo'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/projets', label: 'Projets', icon: FolderKanban },
  { href: '/a-propos', label: 'À propos', icon: UserRound },
  { href: '/contact', label: 'Contact', icon: Mail },
] as const

type SocialLink = {
  platform?: string | null
  url: string
  label?: string | null
}

type SidebarProps = {
  siteName: string
  socialLinks?: SocialLink[] | null
  logoUrl?: string | null
}

function SocialIcon({ platform }: { platform?: string | null }) {
  if (platform === 'github') return <Github className="h-4 w-4" />
  if (platform === 'linkedin') return <Linkedin className="h-4 w-4" />
  return <Mail className="h-4 w-4" />
}

export function Sidebar({ siteName, socialLinks, logoUrl }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[72px] flex-col border-r border-white/10 bg-[var(--background)]/90 backdrop-blur-xl lg:flex">
      <div className="flex justify-center px-3 pt-5">
        <BrandLogo className="flex flex-col items-center" compact logoUrl={logoUrl} siteName={siteName} />
      </div>

      <nav aria-label="Navigation principale" className="mt-10 flex flex-1 flex-col items-center gap-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              aria-current={active ? 'page' : undefined}
              aria-label={label}
              className={cn(
                'group relative flex h-11 w-11 items-center justify-center rounded-xl transition',
                active
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[color:var(--accent)]/30'
                  : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--accent-soft)]',
              )}
              data-cursor="link"
              href={href}
              key={href}
              title={label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 px-3 pb-6">
        {(socialLinks || []).map((link) => (
          <a
            aria-label={link.label || link.platform || 'Réseau social'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--accent-soft)]"
            data-cursor="open"
            href={link.url}
            key={link.url}
            rel="noreferrer"
            target="_blank"
            title={link.label || link.platform || undefined}
          >
            <SocialIcon platform={link.platform} />
          </a>
        ))}
        <span className="mt-2 [writing-mode:vertical-rl] rotate-180 text-[9px] tracking-[0.28em] text-[var(--muted)] uppercase">
          {siteName.split(' ')[0]}
        </span>
      </div>
    </aside>
  )
}
