'use client'

import { FolderKanban, Home, Mail, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/projets', label: 'Projets', icon: FolderKanban },
  { href: '/a-propos', label: 'À propos', icon: UserRound },
  { href: '/contact', label: 'Contact', icon: Mail },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[var(--background)]/90 backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition',
                  active ? 'text-cyan-300' : 'text-[var(--muted)]',
                )}
                href={href}
              >
                <Icon aria-hidden className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
