/** Génère une cover SVG unique par slug (gradient + titre). */

function hashSlug(slug: string): number {
  let hash = 0
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h % 360} ${s}% ${l}%)`
}

function slugPalette(slug: string): { c1: string; c2: string; c3: string } {
  const hash = hashSlug(slug)
  const h1 = hash % 360
  const h2 = (hash * 5 + 47) % 360
  const h3 = (hash * 11 + 120) % 360
  return {
    c1: hsl(h1, 72, 48),
    c2: hsl(h2, 58, 28),
    c3: hsl(h3, 65, 55),
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function initials(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function buildProjectCoverSvg(title: string, slug: string, subtitle?: string): string {
  const { c1, c2, c3 } = slugPalette(slug)
  const mono = initials(title)
  const sub = subtitle?.slice(0, 48) ?? slug

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="22%" r="55%">
      <stop offset="0%" stop-color="${c3}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${c3}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="750" fill="url(#bg)"/>
  <rect width="1200" height="750" fill="url(#glow)"/>
  <rect width="1200" height="750" fill="url(#grid)"/>
  <circle cx="980" cy="140" r="120" fill="${c3}" fill-opacity="0.12"/>
  <circle cx="180" cy="620" r="90" fill="${c1}" fill-opacity="0.15"/>
  <text x="80" y="520" font-family="system-ui, sans-serif" font-size="140" font-weight="800" fill="rgba(255,255,255,0.08)">${escapeXml(mono)}</text>
  <text x="80" y="340" font-family="system-ui, sans-serif" font-size="64" font-weight="700" fill="#f5f1ea">${escapeXml(title.slice(0, 40))}</text>
  <text x="80" y="400" font-family="system-ui, sans-serif" font-size="28" fill="rgba(245,241,234,0.65)">${escapeXml(sub)}</text>
  <rect x="80" y="430" width="120" height="4" rx="2" fill="${c3}"/>
</svg>`
}
