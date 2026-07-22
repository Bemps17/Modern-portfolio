import React from 'react'

/**
 * Logo plein — écran de login Payload.
 * Remplacer `src` pour brancher un logo CMS ou un SVG dédié.
 */
export default function Logo() {
  return (
    <div className="brand-admin-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Portfolio" className="brand-admin-logo__mark" height={40} src="/brand/favicon.png" width={40} />
      <span className="brand-admin-logo__wordmark">Portfolio</span>
    </div>
  )
}
