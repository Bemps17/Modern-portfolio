import React from 'react'

const SHORTCUTS = [
  { href: '/admin/collections/projects/create', label: 'Nouveau projet' },
  { href: '/admin/collections/journal-posts/create', label: 'Nouvel article Lablog' },
  { href: '/admin/globals/site-settings', label: 'Configuration site' },
  { href: '/admin/collections/form-submissions', label: 'Inbox' },
] as const

export default function AdminShortcutsWidget() {
  return (
    <section className="portfolio-admin__shortcuts">
      <p className="portfolio-admin__welcome-eyebrow">Raccourcis éditoriaux</p>
      <div className="portfolio-admin__shortcuts-grid">
        {SHORTCUTS.map(({ href, label }) => (
          <a key={href} href={href} className="portfolio-admin__shortcut-link">
            {label}
          </a>
        ))}
      </div>
    </section>
  )
}
