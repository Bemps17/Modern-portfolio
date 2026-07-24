import React from 'react'

const quickLinks = [
  { href: '/admin/globals/site-settings', label: 'Paramètres du site', hint: 'Identité, contact, légal' },
  { href: '/admin/globals/seo-defaults', label: 'SEO par défaut', hint: 'Meta, OG, indexation' },
  { href: '/admin/collections/projects', label: 'Projets', hint: 'Portfolio & case studies' },
  { href: '/admin/collections/media', label: 'Médias', hint: 'Images & fichiers' },
]

/**
 * Hero dashboard — accès rapide aux globals et collections clés.
 * Styles : `.admin-dashboard-hero` dans `custom.scss`.
 */
export default function AdminDashboardHero() {
  return (
    <section aria-label="Raccourcis éditoriaux" className="admin-dashboard-hero">
      <div className="admin-dashboard-hero__intro">
        <p className="admin-dashboard-hero__eyebrow">Studio éditorial</p>
        <h2 className="admin-dashboard-hero__title">Pilotez le portfolio depuis ici</h2>
        <p className="admin-dashboard-hero__text">
          Interface mobile-first, onglets clairs et synchro automatique vers le site public après
          chaque enregistrement.
        </p>
      </div>
      <ul className="admin-dashboard-hero__grid">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <a className="admin-dashboard-hero__card" href={link.href}>
              <span className="admin-dashboard-hero__card-label">{link.label}</span>
              <span className="admin-dashboard-hero__card-hint">{link.hint}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
