'use client'

import { FolderKanban, Home, Mail, NotebookPen, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type TabItem = {
  href: string
  label: string
  icon: typeof Home
  external?: boolean
}

function buildTabs(journalNavLabel: string): TabItem[] {
  return [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/projets', label: 'Projets', icon: FolderKanban },
    { href: '/a-propos', label: 'À propos', icon: UserRound },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/carnet', label: journalNavLabel, icon: NotebookPen },
  ]
}

type BottomTabBarProps = {
  journalNavLabel?: string
}

export function BottomTabBar({ journalNavLabel = 'Le Lablog' }: BottomTabBarProps) {
  const pathname = usePathname()
  const tabs = buildTabs(journalNavLabel)

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
    >
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-t-2xl border-x border-t border-white/12 bg-white/[0.06] shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/[0.05] to-transparent"
        />
        <ul className="relative grid grid-cols-5 px-1.5 py-1.5">
          {tabs.map(({ href, label, icon: Icon, external }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li className="relative" key={href}>
                {active ? (
                  <motion.span
                    className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-[var(--accent)]/15 ring-1 ring-[color:var(--accent)]/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                    layoutId="mobile-tab-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                ) : null}
                <Link
                  aria-current={active ? 'page' : undefined}
                  aria-label={label}
                  className={cn(
                    'relative z-[1] flex min-h-11 min-w-11 items-center justify-center rounded-xl transition',
                    active ? 'text-[var(--accent)]' : 'text-[var(--foreground-secondary)]',
                  )}
                  data-cursor={external ? 'open' : 'link'}
                  href={href}
                  rel={external ? 'noopener noreferrer' : undefined}
                  target={external ? '_blank' : undefined}
                >
                  <motion.span animate={active ? { scale: 1.08 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }}>
                    <Icon aria-hidden className="h-5 w-5" />
                  </motion.span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
