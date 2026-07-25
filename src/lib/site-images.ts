/** Chemins des assets statiques locaux (`public/`) — fallbacks hors CMS. */
export const SITE_IMAGES = {
  /** Monogramme BF — sidebar, header, logo fallback. */
  brandLogo: '/brand/favicon.svg',
  /** Favicon navigateur — monogramme BF orange (pas le portrait CMS). */
  favicon: '/brand/favicon.svg',
  faviconPng: '/brand/favicon.png',
  appleIcon: '/apple-icon.png',
  backgrounds: {
    marsHighway: '/images/backgrounds/mars-highway.jpg',
  },
} as const
