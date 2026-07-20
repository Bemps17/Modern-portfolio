'use client'

import { FolderKanban, Home, Mail, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
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
      <ul className="relative mx-auto grid max-w-lg grid-cols-4 px-2 py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li className="relative" key={href}>
              {active ? (
                <motion.span
                  className="absolute inset-x-2 inset-y-1 rounded-xl bg-[var(--accent)]/15 ring-1 ring-[color:var(--accent)]/25"
                  layoutId="mobile-tab-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              ) : null}
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative z-[1] flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition',
                  active ? 'text-[var(--accent)]' : 'text-[var(--muted)]',
                )}
                data-cursor="link"
                href={href}
              >
                <motion.span animate={active ? { scale: 1.08 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }}>
                  <Icon aria-hidden className="h-5 w-5" />
                </motion.span>
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
