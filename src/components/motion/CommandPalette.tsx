'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type CommandItem = {
  id: string
  label: string
  href: string
  group: string
}

type CommandPaletteProps = {
  projects: Array<{ title: string; slug: string }>
}

const NAV_ITEMS: CommandItem[] = [
  { id: 'home', label: 'Accueil', href: '/', group: 'Navigation' },
  { id: 'projects', label: 'Projets', href: '/projets', group: 'Navigation' },
  { id: 'about', label: 'À propos', href: '/a-propos', group: 'Navigation' },
  { id: 'contact', label: 'Contact', href: '/contact', group: 'Navigation' },
]

export function CommandPalette({ projects }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const items = useMemo(() => {
    const projectItems = projects.map((project) => ({
      id: project.slug,
      label: project.title,
      href: `/projets/${project.slug}`,
      group: 'Projets',
    }))
    return [...NAV_ITEMS, ...projectItems]
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.label.toLowerCase().includes(q))
  }, [items, query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (open) close()
        else setOpen(true)
      }
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null
      inputRef.current?.focus()
    } else {
      lastFocusedRef.current?.focus()
    }
  }, [open])

  const onDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables || focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const groups = [...new Set(filtered.map((item) => item.group))]

  return (
    <>
      <button
        className="fixed right-4 bottom-24 z-40 hidden items-center gap-2 rounded-full border border-white/10 bg-[var(--background)]/90 px-3 py-1.5 text-xs text-[var(--muted)] backdrop-blur lg:bottom-6 lg:flex"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Cmd+K</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              aria-label="Recherche rapide"
              aria-modal="true"
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[var(--background-elevated)] shadow-2xl"
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={onDialogKeyDown}
              ref={dialogRef}
              role="dialog"
            >
              <div className="border-b border-white/10 px-4 py-3">
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une page ou un projet…"
                  ref={inputRef}
                  value={query}
                />
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {groups.map((group) => (
                  <div className="mb-3" key={group}>
                    <p className="px-2 py-1 text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">{group}</p>
                    {filtered
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <Link
                          className="block rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
                          href={item.href}
                          key={item.id}
                          onClick={close}
                        >
                          {item.label}
                        </Link>
                      ))}
                  </div>
                ))}
                {!filtered.length ? (
                  <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">Aucun résultat</p>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
