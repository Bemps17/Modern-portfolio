/** Covers SVG thématiques pour Le Lablog (16:9, sans texte). */

export type LablogCoverTheme =
  | 'agentic-ai'
  | 'vibe-coding'
  | 'embodied-ai'
  | 'sovereign-cloud'
  | 'npu-chip'
  | 'cybersecurity'
  | 'biotech'
  | 'spatial-bci'
  | 'graph-rag'
  | 'green-ai'
  | 'quantum'
  | 'depin'

type ThemePalette = {
  bg: string
  c1: string
  c2: string
  c3: string
  accent: string
  motif: 'nodes' | 'circuit' | 'helix' | 'shield' | 'globe' | 'quantum' | 'leaf' | 'grid'
}

const THEMES: Record<LablogCoverTheme, ThemePalette> = {
  'agentic-ai': {
    bg: '#0a1628',
    c1: '#06b6d4',
    c2: '#7c3aed',
    c3: '#22d3ee',
    accent: '#a855f7',
    motif: 'nodes',
  },
  'vibe-coding': {
    bg: '#0c0f14',
    c1: '#f97316',
    c2: '#06b6d4',
    c3: '#fb923c',
    accent: '#22d3ee',
    motif: 'grid',
  },
  'embodied-ai': {
    bg: '#111827',
    c1: '#14b8a6',
    c2: '#f97316',
    c3: '#2dd4bf',
    accent: '#fb923c',
    motif: 'circuit',
  },
  'sovereign-cloud': {
    bg: '#0f172a',
    c1: '#3b82f6',
    c2: '#94a3b8',
    c3: '#60a5fa',
    accent: '#cbd5e1',
    motif: 'shield',
  },
  'npu-chip': {
    bg: '#050505',
    c1: '#fbbf24',
    c2: '#2563eb',
    c3: '#fcd34d',
    accent: '#3b82f6',
    motif: 'circuit',
  },
  cybersecurity: {
    bg: '#120a1e',
    c1: '#10b981',
    c2: '#7c3aed',
    c3: '#34d399',
    accent: '#a78bfa',
    motif: 'shield',
  },
  biotech: {
    bg: '#f0f9ff',
    c1: '#38bdf8',
    c2: '#0ea5e9',
    c3: '#7dd3fc',
    accent: '#0284c7',
    motif: 'helix',
  },
  'spatial-bci': {
    bg: '#0a0a0f',
    c1: '#f59e0b',
    c2: '#06b6d4',
    c3: '#fbbf24',
    accent: '#22d3ee',
    motif: 'nodes',
  },
  'graph-rag': {
    bg: '#0b1020',
    c1: '#06b6d4',
    c2: '#ec4899',
    c3: '#22d3ee',
    accent: '#f472b6',
    motif: 'nodes',
  },
  'green-ai': {
    bg: '#0a1a0f',
    c1: '#22c55e',
    c2: '#64748b',
    c3: '#4ade80',
    accent: '#94a3b8',
    motif: 'leaf',
  },
  quantum: {
    bg: '#050508',
    c1: '#fbbf24',
    c2: '#1e1b4b',
    c3: '#fde68a',
    accent: '#6366f1',
    motif: 'quantum',
  },
  depin: {
    bg: '#0a1225',
    c1: '#f97316',
    c2: '#2563eb',
    c3: '#fb923c',
    accent: '#3b82f6',
    motif: 'globe',
  },
}

function motifSvg(theme: ThemePalette): string {
  switch (theme.motif) {
    case 'nodes':
      return `
        <circle cx="620" cy="280" r="8" fill="${theme.c3}" opacity="0.9"/>
        <circle cx="780" cy="220" r="6" fill="${theme.accent}" opacity="0.8"/>
        <circle cx="900" cy="340" r="10" fill="${theme.c1}" opacity="0.85"/>
        <circle cx="520" cy="380" r="5" fill="${theme.c2}" opacity="0.7"/>
        <line x1="620" y1="280" x2="780" y2="220" stroke="${theme.c3}" stroke-width="2" opacity="0.35"/>
        <line x1="780" y1="220" x2="900" y2="340" stroke="${theme.accent}" stroke-width="2" opacity="0.35"/>
        <line x1="620" y1="280" x2="520" y2="380" stroke="${theme.c1}" stroke-width="2" opacity="0.3"/>
        <line x1="520" y1="380" x2="900" y2="340" stroke="${theme.c2}" stroke-width="1.5" opacity="0.25"/>
      `
    case 'circuit':
      return `
        <rect x="560" y="200" width="320" height="220" rx="12" fill="none" stroke="${theme.c1}" stroke-width="2" opacity="0.4"/>
        <path d="M580 260 H860 M580 320 H820 M580 380 H780" stroke="${theme.c3}" stroke-width="2" opacity="0.35"/>
        <circle cx="860" cy="260" r="6" fill="${theme.accent}"/>
        <circle cx="820" cy="320" r="6" fill="${theme.c1}"/>
        <circle cx="780" cy="380" r="6" fill="${theme.c2}"/>
      `
    case 'helix':
      return `
        <path d="M700 180 Q760 240 700 300 Q640 360 700 420 Q760 480 700 540" fill="none" stroke="${theme.c1}" stroke-width="4" opacity="0.5"/>
        <path d="M740 180 Q800 240 740 300 Q680 360 740 420 Q800 480 740 540" fill="none" stroke="${theme.accent}" stroke-width="4" opacity="0.35"/>
      `
    case 'shield':
      return `
        <path d="M700 180 L820 230 L820 360 Q820 460 700 520 Q580 460 580 360 L580 230 Z" fill="${theme.c1}" fill-opacity="0.12" stroke="${theme.c3}" stroke-width="2" opacity="0.6"/>
        <circle cx="700" cy="340" r="48" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.45"/>
      `
    case 'globe':
      return `
        <circle cx="700" cy="340" r="140" fill="none" stroke="${theme.c1}" stroke-width="2" opacity="0.35"/>
        <ellipse cx="700" cy="340" rx="140" ry="50" fill="none" stroke="${theme.c3}" stroke-width="1.5" opacity="0.3"/>
        <ellipse cx="700" cy="340" rx="50" ry="140" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.3"/>
        <circle cx="820" cy="280" r="5" fill="${theme.c2}"/>
        <circle cx="600" cy="400" r="5" fill="${theme.c1}"/>
      `
    case 'quantum':
      return `
        <circle cx="700" cy="340" r="100" fill="none" stroke="${theme.c1}" stroke-width="2" opacity="0.5"/>
        <circle cx="700" cy="340" r="70" fill="none" stroke="${theme.c3}" stroke-width="1.5" opacity="0.4"/>
        <circle cx="700" cy="340" r="40" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.35"/>
        <circle cx="700" cy="340" r="6" fill="${theme.c1}"/>
      `
    case 'leaf':
      return `
        <path d="M700 520 Q640 420 680 300 Q720 200 760 280 Q800 380 700 520" fill="${theme.c1}" fill-opacity="0.25" stroke="${theme.c3}" stroke-width="2" opacity="0.5"/>
        <line x1="700" y1="520" x2="720" y2="280" stroke="${theme.accent}" stroke-width="2" opacity="0.4"/>
      `
    case 'grid':
    default:
      return `
        <rect x="500" y="180" width="400" height="280" fill="none" stroke="${theme.c1}" stroke-width="1" opacity="0.2"/>
        <line x1="500" y1="240" x2="900" y2="240" stroke="${theme.c3}" stroke-width="1" opacity="0.15"/>
        <line x1="500" y1="300" x2="900" y2="300" stroke="${theme.c3}" stroke-width="1" opacity="0.15"/>
        <line x1="500" y1="360" x2="900" y2="360" stroke="${theme.c3}" stroke-width="1" opacity="0.15"/>
        <line x1="620" y1="180" x2="620" y2="460" stroke="${theme.accent}" stroke-width="1" opacity="0.12"/>
        <line x1="780" y1="180" x2="780" y2="460" stroke="${theme.accent}" stroke-width="1" opacity="0.12"/>
      `
  }
}

/** Cover 16:9 sans texte — palette par thème éditorial. */
export function buildLablogCoverSvg(themeId: LablogCoverTheme): string {
  const theme = THEMES[themeId]

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}"/>
      <stop offset="50%" stop-color="${theme.c2}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${theme.bg}"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="38%" r="50%">
      <stop offset="0%" stop-color="${theme.c1}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${theme.c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  ${motifSvg(theme)}
  <circle cx="220" cy="720" r="160" fill="${theme.c2}" fill-opacity="0.08"/>
  <circle cx="1380" cy="160" r="120" fill="${theme.c3}" fill-opacity="0.1"/>
</svg>`
}
