import React from 'react'

/**
 * Icône compacte — sidebar / favicon admin.
 * Remplacer `src` pour un pictogramme dédié (carré 32×32 recommandé).
 */
export default function Icon() {
  return (
    <div className="brand-admin-icon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Portfolio" className="brand-admin-icon__mark" height={28} src="/brand/favicon.png" width={28} />
    </div>
  )
}
