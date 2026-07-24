# CV PDF aéré + actions Visualiser / Partager / Télécharger

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ré-aérer le CV PDF sur une page A4 (marges correctes, typo lisible, usage de l’espace vertical) et remplacer le bouton unique de téléchargement par trois actions mises en avant — Visualiser, Partager, Télécharger — avec retours d’interaction (modales, états pressed) desktop et mobile.

**Architecture:** (1) Ajuster uniquement les styles / densités de `CvDocument.tsx` tout en gardant `pageCount === 1`. (2) Remplacer `CvDownloadButton` par un composant client `CvActions` + modales maison (pattern proche de `CommandPalette` : overlay, Escape, focus trap léger, `framer-motion`). Visualiser = iframe/`<embed>` vers `/api/cv`. Partager = liens `mailto` / WhatsApp / LinkedIn / copier le lien + `navigator.share` si dispo. Télécharger = déclenchement download de `/api/cv` avec feedback visuel. Helpers de partage purs et testables dans `src/lib/cv/share-links.ts`.

**Tech Stack:** Next.js 16, React 19, `@react-pdf/renderer` (PDF serveur), Framer Motion, Lucide, Sonner (toast), Vitest, tokens CSS existants.

## Global Constraints

- CMS-first : zéro copy marketing éditorial en dur dans les pages ; les libellés **Visualiser / Partager / Télécharger** sont du chrome UI fonctionnel (autorisé)
- Contenu CV (Payload / fallback) **inchangé** — pas de nouvelles sections, pas de recommandations
- PDF : **exactement 1 page A4** (`tests/int/cv-api.int.spec.ts` → `pageCount === 1`)
- Marges PDF (intérieur page / hors bandeau) : haut ≥ 28pt, bas ≥ 36pt, droite ≥ 20pt ; sidebar largeur ~185–200pt avec padding interne ≥ 14pt
- Typo PDF lisible : corps principal ≥ 8.5pt ; titres section ≥ 9.5pt ; nom ≥ 16pt — **interdire** les tailles ≤ 6.5pt sauf labels secondaires sidebar
- Ne pas tronquer les descriptions d’expériences récentes sous 180 caractères (retirer ou remonter le `compactText` agressif actuel)
- Palette site conservée : `#141418`, `#ff6b1a`, `#ffc266`, `#f8f4ef`
- Pas de lib UI lourde (pas shadcn/MUI) ; réutiliser tokens + Framer Motion déjà présents
- Touch targets ≥ 44px (mobile) ; état `active:` / `aria-pressed` visible sur chaque bouton
- Server Components par défaut ; `'use client'` seulement pour `CvActions` + modales
- Mode démo non cassé ; `GET /api/cv` inchangé fonctionnellement
- `SITE_VERSION` bumpé à `0.14.0`
- Gate : tests CV + `pnpm typecheck` (idéalement `pnpm verify`)

## File Structure

| Fichier | Rôle |
|---|---|
| `src/components/cv/CvDocument.tsx` | Mise en page PDF aérée (1 page) |
| `src/lib/cv/share-links.ts` | URLs de partage + copy helper (pur) |
| `src/components/ui/Modal.tsx` | Modale réutilisable accessible |
| `src/components/sections/CvActions.tsx` | Groupe de 3 boutons + modales Visualiser / Partager |
| `src/app/(frontend)/a-propos/page.tsx` | Remplace `CvDownloadButton` par `CvActions` |
| `src/components/sections/CvDownloadButton.tsx` | **Supprimé** (remplacé) |
| `tests/int/cv-share-links.int.spec.ts` | Tests helpers partage |
| `tests/int/cv-api.int.spec.ts` | Toujours `pageCount === 1` |
| `src/lib/site-version.ts` | `0.14.0` |
| `vitest.config.mts` | Include nouveau spec |

## Décisions UX verrouillées

| Action | Desktop | Mobile |
|---|---|---|
| **Visualiser** | Bouton glass + icône `Eye` → modale plein viewport (max-w-4xl) avec `<iframe src="/api/cv">` | Icône seule (≥44px) + même modale |
| **Partager** | Bouton glass + `Share2` → modale grille : Copier le lien, Email, WhatsApp, LinkedIn, + `navigator.share` si disponible | Idem icône |
| **Télécharger** | Bouton **primary** (accent) + `Download` → `window.location` / `<a download>` programmatique + état pressed 300ms | Idem icône |
| Lien partagé | `{getSiteUrl()}/api/cv` (absolu) | idem |
| Feedback | Sonner toast « Lien copié » ; classes `active:scale-95` + `active:brightness-90` | Obligatoire |

---

### Task 1: Helpers de partage (TDD)

**Files:**
- Create: `src/lib/cv/share-links.ts`
- Create: `tests/int/cv-share-links.int.spec.ts`
- Modify: `vitest.config.mts` (ajouter le spec à l’include `node-payload`)

**Interfaces:**
- Produces:
```ts
export function buildCvShareUrl(siteUrl: string): string
export function buildMailtoShareUrl(cvUrl: string, fullName: string): string
export function buildWhatsAppShareUrl(cvUrl: string, fullName: string): string
export function buildLinkedInShareUrl(cvUrl: string): string
```

- [ ] **Step 1: Write the failing test**

Créer `tests/int/cv-share-links.int.spec.ts` :

```ts
import { describe, expect, it } from 'vitest'

import {
  buildCvShareUrl,
  buildLinkedInShareUrl,
  buildMailtoShareUrl,
  buildWhatsAppShareUrl,
} from '../../src/lib/cv/share-links'

describe('cv share links', () => {
  it('builds an absolute CV url without double slashes', () => {
    expect(buildCvShareUrl('https://example.com/')).toBe('https://example.com/api/cv')
    expect(buildCvShareUrl('https://example.com')).toBe('https://example.com/api/cv')
  })

  it('builds mailto with subject and body containing the cv url', () => {
    const url = buildMailtoShareUrl('https://example.com/api/cv', 'Bertrand Fouquet')
    expect(url.startsWith('mailto:?')).toBe(true)
    expect(url).toContain(encodeURIComponent('CV — Bertrand Fouquet'))
    expect(url).toContain(encodeURIComponent('https://example.com/api/cv'))
  })

  it('builds WhatsApp share url', () => {
    const url = buildWhatsAppShareUrl('https://example.com/api/cv', 'Bertrand Fouquet')
    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    expect(decodeURIComponent(url)).toContain('https://example.com/api/cv')
    expect(decodeURIComponent(url)).toContain('Bertrand Fouquet')
  })

  it('builds LinkedIn share url', () => {
    expect(buildLinkedInShareUrl('https://example.com/api/cv')).toBe(
      'https://www.linkedin.com/sharing/share-offsite/?url=' +
        encodeURIComponent('https://example.com/api/cv'),
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-share-links.int.spec.ts`  
Expected: FAIL module not found. Ajouter `'tests/int/cv-share-links.int.spec.ts'` dans `vitest.config.mts` include `node-payload` si besoin, re-run : toujours FAIL sur import.

- [ ] **Step 3: Write minimal implementation**

Créer `src/lib/cv/share-links.ts` :

```ts
function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

export function buildCvShareUrl(siteUrl: string): string {
  return `${trimTrailingSlash(siteUrl)}/api/cv`
}

export function buildMailtoShareUrl(cvUrl: string, fullName: string): string {
  const subject = `CV — ${fullName}`
  const body = `Bonjour,\n\nVoici mon CV : ${cvUrl}\n`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildWhatsAppShareUrl(cvUrl: string, fullName: string): string {
  const text = `CV — ${fullName}\n${cvUrl}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function buildLinkedInShareUrl(cvUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cvUrl)}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-share-links.int.spec.ts`  
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/cv/share-links.ts tests/int/cv-share-links.int.spec.ts vitest.config.mts
git commit -m "feat(cv): helpers d’URL de partage (mailto, WhatsApp, LinkedIn)"
```

---

### Task 2: Ré-aérer le PDF A4 (toujours 1 page)

**Files:**
- Modify: `src/components/cv/CvDocument.tsx`
- Test: `tests/int/cv-api.int.spec.ts` (garde `expect(pageCount).toBe(1)`)

**Interfaces:**
- Consumes: `CvDocumentData` (inchangé)
- Produces: même sections ; typo / paddings / gaps augmentés ; descriptions récentes moins tronquées

- [ ] **Step 1: Write / confirm failing expectation for readability constants**

Ajouter en tête de `tests/int/cv-api.int.spec.ts` (ou créer `tests/int/cv-layout-constants.int.spec.ts` si on exporte les constantes) — **approche retenue** : exporter les constantes de layout depuis `CvDocument` n’est pas idéal. À la place, après redesign, le test API doit **toujours** passer avec `pageCount === 1`. Vérifier manuellement via script preview.

Créer `src/lib/cv/pdf-layout.ts` avec les constantes numériques testables :

```ts
export const CV_PDF_LAYOUT = {
  sidebarWidth: 190,
  pagePaddingTop: 28,
  pagePaddingBottom: 40,
  mainPaddingHorizontal: 22,
  sidebarPaddingHorizontal: 16,
  sidebarPaddingTop: 28,
  headerNameFontSize: 18,
  sectionTitleFontSize: 10,
  bodyFontSize: 8.5,
  sideBodyFontSize: 8,
  timelineItemMarginBottom: 7,
  recentDescriptionMaxChars: 220,
  pitchMaxChars: 420,
} as const
```

Test `tests/int/cv-pdf-layout.int.spec.ts` :

```ts
import { describe, expect, it } from 'vitest'

import { CV_PDF_LAYOUT } from '../../src/lib/cv/pdf-layout'

describe('CV_PDF_LAYOUT', () => {
  it('keeps readable type and comfortable margins', () => {
    expect(CV_PDF_LAYOUT.pagePaddingTop).toBeGreaterThanOrEqual(28)
    expect(CV_PDF_LAYOUT.pagePaddingBottom).toBeGreaterThanOrEqual(36)
    expect(CV_PDF_LAYOUT.mainPaddingHorizontal).toBeGreaterThanOrEqual(20)
    expect(CV_PDF_LAYOUT.headerNameFontSize).toBeGreaterThanOrEqual(16)
    expect(CV_PDF_LAYOUT.sectionTitleFontSize).toBeGreaterThanOrEqual(9.5)
    expect(CV_PDF_LAYOUT.bodyFontSize).toBeGreaterThanOrEqual(8.5)
    expect(CV_PDF_LAYOUT.sideBodyFontSize).toBeGreaterThanOrEqual(7.5)
    expect(CV_PDF_LAYOUT.recentDescriptionMaxChars).toBeGreaterThanOrEqual(180)
  })
})
```

- [ ] **Step 2: Run layout test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-pdf-layout.int.spec.ts`  
Expected: FAIL module not found. Ajouter le fichier à `vitest.config.mts` include.

- [ ] **Step 3: Add pdf-layout.ts then wire CvDocument**

Créer `src/lib/cv/pdf-layout.ts` avec l’objet ci-dessus.

Dans `CvDocument.tsx`, importer `CV_PDF_LAYOUT` et remplacer les hardcodes :

```ts
import { CV_PDF_LAYOUT as L } from '@/lib/cv/pdf-layout'

const SIDEBAR_WIDTH = L.sidebarWidth

const styles = StyleSheet.create({
  page: {
    paddingLeft: SIDEBAR_WIDTH,
    paddingTop: L.pagePaddingTop,
    paddingBottom: L.pagePaddingBottom,
    fontSize: L.bodyFontSize,
    fontFamily: 'Helvetica',
    color: colors.ink,
    backgroundColor: colors.page,
  },
  sidebarContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: L.sidebarPaddingTop,
    paddingBottom: 24,
    paddingHorizontal: L.sidebarPaddingHorizontal,
  },
  main: {
    paddingHorizontal: L.mainPaddingHorizontal,
  },
  headerName: {
    fontSize: L.headerNameFontSize,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: L.sectionTitleFontSize,
    fontFamily: 'Helvetica-Bold',
    color: colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sideBody: {
    fontSize: L.sideBodyFontSize,
    lineHeight: 1.4,
    color: colors.sidebarMuted,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: L.timelineItemMarginBottom,
  },
  // …autres styles : remonter sideContact/lang/competency ~7.5–8pt, earlyRow un peu plus aéré (marginBottom 4)
})
```

Mettre à jour `compactText` usages :
- pitch : `compactText(data.pitch, L.pitchMaxChars)`
- descriptions récentes : `compactText(experience.description, L.recentDescriptionMaxChars)`
- RQTH : garder ~160 chars max

Augmenter aussi `headerTagline` (~9pt), `jobTitle` (~9pt), `jobBody` (= `L.bodyFontSize`), paddings sidebar sections (`marginTop` ~12).

Structure JSX **inchangée** (sidebar + expériences + early compact + formations). Pas de page 2.

- [ ] **Step 4: Run tests**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-pdf-layout.int.spec.ts tests/int/cv-api.int.spec.ts
pnpm typecheck
```

Expected: PASS ; `pageCount === 1`. Si `pageCount > 1`, réduire **uniquement** `timelineItemMarginBottom` / `recentDescriptionMaxChars` / `pitchMaxChars` de 10–15 % jusqu’à repasser à 1 page — **ne pas** redescendre les font-sizes sous les planchers de `CV_PDF_LAYOUT` testés.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cv/pdf-layout.ts src/components/cv/CvDocument.tsx tests/int/cv-pdf-layout.int.spec.ts vitest.config.mts tests/int/cv-api.int.spec.ts
git commit -m "feat(cv): mise en page PDF aérée sur une page A4"
```

---

### Task 3: Composant Modal accessible

**Files:**
- Create: `src/components/ui/Modal.tsx`

**Interfaces:**
- Produces:
```tsx
type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}
export function Modal({ open, onClose, title, children, className }: ModalProps): React.JSX.Element | null
```

- [ ] **Step 1: Implement Modal**

Créer `src/components/ui/Modal.tsx` :

```tsx
'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

import { cn } from '@/lib/utils'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('button, [href], input, iframe')?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      lastFocusedRef.current?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.button
            aria-label="Fermer"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn(
              'relative z-[1] flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background-elevated)] shadow-2xl',
              className,
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            role="dialog"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] px-4 py-3">
              <h2 className="font-[family-name:var(--font-syne)] text-base font-semibold text-[var(--foreground)]" id={titleId}>
                {title}
              </h2>
              <button
                aria-label="Fermer la fenêtre"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--foreground-secondary)] transition active:scale-95 hover:bg-white/10 hover:text-[var(--foreground)]"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Modal.tsx
git commit -m "feat(ui): modale accessible réutilisable (overlay + Escape)"
```

---

### Task 4: `CvActions` — Visualiser / Partager / Télécharger

**Files:**
- Create: `src/components/sections/CvActions.tsx`
- Delete: `src/components/sections/CvDownloadButton.tsx`
- Modify: `src/app/(frontend)/a-propos/page.tsx`

**Interfaces:**
- Consumes: `Modal`, `buildCvShareUrl`, `buildMailtoShareUrl`, `buildWhatsAppShareUrl`, `buildLinkedInShareUrl`, `getSiteUrl` (passé en prop depuis le Server Component — **ne pas** appeler `getSiteUrl` côté client si elle lit des env serveur uniquement ; passer `shareUrl` en prop string)
- Produces: `CvActions({ shareUrl, fullName }: { shareUrl: string; fullName: string })`

- [ ] **Step 1: Implement CvActions**

Créer `src/components/sections/CvActions.tsx` :

```tsx
'use client'

import { Download, Eye, Link2, Linkedin, Mail, Share2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { Modal } from '@/components/ui/Modal'
import {
  buildLinkedInShareUrl,
  buildMailtoShareUrl,
  buildWhatsAppShareUrl,
} from '@/lib/cv/share-links'
import { cn } from '@/lib/utils'

type CvActionsProps = {
  shareUrl: string
  fullName: string
}

const actionBase =
  'inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/50 active:scale-95 sm:px-4'

const glassAction = cn(
  actionBase,
  'border border-white/15 bg-white/10 text-white backdrop-blur-md',
  'hover:border-[color:var(--accent)]/35 hover:bg-white/15',
  'active:bg-white/20 active:brightness-90',
)

const primaryAction = cn(
  actionBase,
  'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white',
  'hover:brightness-110 active:brightness-90',
)

export function CvActions({ shareUrl, fullName }: CvActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const onDownload = useCallback(() => {
    setDownloading(true)
    const anchor = document.createElement('a')
    anchor.href = '/api/cv'
    anchor.download = ''
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => setDownloading(false), 400)
  }, [])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Lien du CV copié')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }, [shareUrl])

  const onNativeShare = useCallback(async () => {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: `CV — ${fullName}`,
        text: `CV de ${fullName}`,
        url: shareUrl,
      })
    } catch {
      // annulé par l’utilisateur — ignorer
    }
  }, [fullName, shareUrl])

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          aria-label="Visualiser le CV"
          className={glassAction}
          onClick={() => setPreviewOpen(true)}
          type="button"
        >
          <Eye aria-hidden className="size-4 shrink-0" />
          <span className="hidden sm:inline">Visualiser</span>
        </button>

        <button
          aria-label="Partager le CV"
          className={glassAction}
          onClick={() => setShareOpen(true)}
          type="button"
        >
          <Share2 aria-hidden className="size-4 shrink-0" />
          <span className="hidden sm:inline">Partager</span>
        </button>

        <button
          aria-busy={downloading}
          aria-label="Télécharger le CV PDF"
          className={primaryAction}
          onClick={onDownload}
          type="button"
        >
          <Download aria-hidden className="size-4 shrink-0" />
          <span className="hidden sm:inline">{downloading ? 'Téléchargement…' : 'Télécharger'}</span>
        </button>
      </div>

      <Modal
        className="max-w-4xl"
        onClose={() => setPreviewOpen(false)}
        open={previewOpen}
        title="Aperçu du CV"
      >
        <div className="h-[70vh] overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-black/40">
          <iframe className="h-full w-full" src="/api/cv" title={`Aperçu CV — ${fullName}`} />
        </div>
      </Modal>

      <Modal onClose={() => setShareOpen(false)} open={shareOpen} title="Partager le CV">
        <div className="grid gap-2">
          <ShareOption icon={Link2} label="Copier le lien" onClick={onCopy} />
          <ShareOption href={buildMailtoShareUrl(shareUrl, fullName)} icon={Mail} label="E-mail" />
          <ShareOption
            href={buildWhatsAppShareUrl(shareUrl, fullName)}
            icon={Share2}
            label="WhatsApp"
          />
          <ShareOption href={buildLinkedInShareUrl(shareUrl)} icon={Linkedin} label="LinkedIn" />
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
            <ShareOption icon={Share2} label="Plus d’options…" onClick={onNativeShare} />
          ) : null}
        </div>
      </Modal>
    </>
  )
}

function ShareOption({
  label,
  icon: Icon,
  href,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  href?: string
  onClick?: () => void
}) {
  const classes = cn(
    'flex h-12 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-left text-sm font-medium text-[var(--foreground)]',
    'transition active:scale-[0.98] active:bg-white/15 hover:border-[color:var(--accent)]/30 hover:bg-white/10',
  )

  if (href) {
    return (
      <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
        <Icon aria-hidden className="size-4 text-[var(--accent-soft)]" />
        {label}
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      <Icon aria-hidden className="size-4 text-[var(--accent-soft)]" />
      {label}
    </button>
  )
}
```

**Note SSR / `navigator` :** le check `typeof navigator !== 'undefined' && navigator.share` dans le render peut différer SSR/CSR. Utiliser un state `canNativeShare` initialisé à `false` + `useEffect(() => setCanNativeShare(typeof navigator.share === 'function'), [])` pour éviter un mismatch d’hydratation.

- [ ] **Step 2: Wire About page**

Dans `src/app/(frontend)/a-propos/page.tsx` :

```tsx
import { CvActions } from '@/components/sections/CvActions'
import { buildCvShareUrl } from '@/lib/cv/share-links'
import { getSiteUrl } from '@/lib/site-url'
```

Remplacer :

```tsx
<div className="mt-6 flex flex-wrap gap-3">
  <CvDownloadButton />
</div>
```

par :

```tsx
<CvActions
  fullName={settings?.siteName || 'Portfolio'}
  shareUrl={buildCvShareUrl(getSiteUrl())}
/>
```

Supprimer l’import de `CvDownloadButton`.

- [ ] **Step 3: Delete old button**

```bash
rm src/components/sections/CvDownloadButton.tsx
```

Vérifier qu’aucun autre fichier ne l’importe :

```bash
rg "CvDownloadButton" -g '*.{ts,tsx}'
```

Expected: aucun match.

- [ ] **Step 4: Typecheck + CV tests**

```bash
pnpm typecheck
pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-api.int.spec.ts tests/int/cv-share-links.int.spec.ts tests/int/cv-pdf-layout.int.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/CvActions.tsx src/app/(frontend)/a-propos/page.tsx
git rm src/components/sections/CvDownloadButton.tsx
git commit -m "feat(about): actions CV Visualiser / Partager / Télécharger"
```

---

### Task 5: Version + verify

**Files:**
- Modify: `src/lib/site-version.ts` → `0.14.0`
- Modify: `docs/how-to/cms.md` — une ligne : les boutons Visualiser/Partager/Télécharger sur `/a-propos` pointent vers `/api/cv`

**Interfaces:**
- Produces: livraison versionnée

- [ ] **Step 1: Bump version**

```ts
export const SITE_VERSION = '0.14.0'
```

- [ ] **Step 2: Docs how-to**

Dans `docs/how-to/cms.md`, section **CV PDF**, ajouter :

```md
Sur `/a-propos` : **Visualiser** (aperçu), **Partager** (lien / e-mail / WhatsApp / LinkedIn), **Télécharger** (PDF).
```

- [ ] **Step 3: Verify**

```bash
pnpm verify
```

Expected: PASS

Smoke manuel :
1. Desktop `/a-propos` — 3 boutons avec labels ; Visualiser ouvre iframe PDF ; Partager copie / ouvre canaux ; Télécharger télécharge
2. Mobile 390px — icônes seules, targets ≥ 44px, `active:scale-95` visible au tap
3. PDF toujours 1 page, aéré, marges OK

- [ ] **Step 4: Commit**

```bash
git add src/lib/site-version.ts docs/how-to/cms.md
git commit -m "chore(cv): SITE_VERSION 0.14.0 et docs actions CV"
```

---

## Self-Review

**1. Spec coverage**
- PDF moins condensé, pleine page, marges → Task 2 + constantes testées
- 1 page A4 → contrainte + `cv-api` pageCount
- Partage multi-canal + copy link → Tasks 1 + 4
- Visualiser / Partager / Télécharger mis en avant → Task 4
- Feedback mobile (pressed) → classes `active:` Task 4
- Modales → Tasks 3–4
- Icons mobile → `hidden sm:inline` Task 4

**2. Placeholder scan**
- Pas de TBD ; code complet ; hydratation `navigator.share` documentée avec `useEffect`

**3. Type consistency**
- `shareUrl: string` passé depuis le serveur via `buildCvShareUrl(getSiteUrl())`
- `Modal` / `CvActions` alignés

---

## Execution Handoff

Plan enregistré dans `docs/superpowers/plans/2026-07-24-cv-actions-and-layout.md`.

**Deux options d’exécution :**

1. **Subagent-Driven (recommandé)** — un sous-agent frais par task, revue entre tasks  
2. **Inline Execution** — exécution séquentielle dans cette session  

Quelle approche ?
