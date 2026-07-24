import React from 'react'
import type { WidgetServerProps } from 'payload'

export default async function AdminWelcomeWidget({ req }: WidgetServerProps) {
  const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)
  const siteName = settings?.siteName || 'Portfolio'
  const tagline = settings?.tagline || ''

  return (
    <section className="portfolio-admin__welcome">
      <p className="portfolio-admin__welcome-eyebrow">Studio éditorial</p>
      <h2 className="portfolio-admin__welcome-title">{siteName}</h2>
      {tagline ? <p className="portfolio-admin__welcome-text">{tagline}</p> : null}
      <p className="portfolio-admin__welcome-hint">
        Modifiez le contenu via <strong>Configuration</strong> ci-dessous. Chaque enregistrement
        revalide le site public automatiquement.
      </p>
    </section>
  )
}
