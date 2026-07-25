import React from 'react'
import type { WidgetServerProps } from 'payload'

export default async function AdminStatsWidget({ req }: WidgetServerProps) {
  const [projects, journalPosts, inbox] = await Promise.all([
    req.payload.count({ collection: 'projects', overrideAccess: true }),
    req.payload.count({ collection: 'journal-posts', overrideAccess: true }),
    req.payload.count({ collection: 'form-submissions', overrideAccess: true }),
  ])

  const latestPosts = await req.payload
    .find({
      collection: 'journal-posts',
      limit: 3,
      sort: '-updatedAt',
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] as Array<{ id?: number | string; title?: string; slug?: string }> }))

  return (
    <section className="portfolio-admin__stats">
      <p className="portfolio-admin__welcome-eyebrow">Vue d’ensemble</p>
      <div className="portfolio-admin__stats-grid">
        <div className="portfolio-admin__stat-card">
          <p className="portfolio-admin__stat-value">{projects.totalDocs}</p>
          <p className="portfolio-admin__stat-label">Projets</p>
        </div>
        <div className="portfolio-admin__stat-card">
          <p className="portfolio-admin__stat-value">{journalPosts.totalDocs}</p>
          <p className="portfolio-admin__stat-label">Articles Lablog</p>
        </div>
        <div className="portfolio-admin__stat-card">
          <p className="portfolio-admin__stat-value">{inbox.totalDocs}</p>
          <p className="portfolio-admin__stat-label">Messages inbox</p>
        </div>
      </div>
      {latestPosts.docs.length ? (
        <div className="portfolio-admin__stats-recent">
          <p className="portfolio-admin__stats-recent-title">Derniers articles modifiés</p>
          <ul className="portfolio-admin__stats-recent-list">
            {latestPosts.docs.map((doc, index) => (
              <li key={String(doc.id ?? doc.slug ?? index)}>
                {typeof doc.title === 'string' ? doc.title : 'Sans titre'}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
