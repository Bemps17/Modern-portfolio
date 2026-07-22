import React from 'react'

/**
 * Bandeau dashboard — rappelle la synchro auto CMS → front + le bouton header.
 * Styles : `.cms-sync-banner` dans `src/app/(payload)/custom.scss`.
 */
export default function CmsSyncBanner() {
  return (
    <aside className="cms-sync-banner">
      <strong className="cms-sync-banner__title">Synchro CMS → site</strong>
      <p className="cms-sync-banner__text">
        Chaque enregistrement ou suppression revalide automatiquement les pages publiques. Un toast
        confirme l’action dans l’admin. Si le front paraît en retard, utilisez{' '}
        <strong>Actualiser le site</strong> dans la barre du haut.
      </p>
    </aside>
  )
}
