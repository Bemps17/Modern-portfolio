import React from 'react'

/**
 * Bandeau dashboard — rappelle la synchro auto CMS → front + le bouton header.
 */
export default function CmsSyncBanner() {
  return (
    <aside
      className="cms-sync-banner"
      style={{
        marginBottom: '1.25rem',
        padding: '0.9rem 1.1rem',
        borderRadius: 'var(--style-radius-m, 8px)',
        border: '1px solid var(--brand-border-subtle, var(--theme-elevation-150))',
        background: 'var(--brand-surface, var(--theme-elevation-50))',
        color: 'var(--brand-text-muted, var(--theme-elevation-600))',
        fontSize: '0.875rem',
        lineHeight: 1.45,
      }}
    >
      <strong style={{ color: 'var(--brand-text, var(--theme-text))', fontWeight: 600 }}>
        Synchro CMS → site
      </strong>
      <span style={{ display: 'block', marginTop: '0.35rem' }}>
        Chaque enregistrement ou suppression revalide automatiquement les pages publiques. Un toast
        confirme l’action dans l’admin. Si le front paraît en retard, utilisez{' '}
        <strong style={{ color: 'var(--brand-text, var(--theme-text))', fontWeight: 600 }}>
          Actualiser le site
        </strong>{' '}
        dans la barre du haut.
      </span>
    </aside>
  )
}
