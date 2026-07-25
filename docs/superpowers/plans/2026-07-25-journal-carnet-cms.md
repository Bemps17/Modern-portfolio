# Carnet créatif (journal CMS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une section type Skyblog 2026 — articles + galeries d’images (créations IA, veille, perso) — entièrement gérée dans Payload CMS, accessible via `/carnet`, avec liens nav et cartes ouvrant dans un **nouvel onglet**.

**Architecture:** Collection Payload `journal-posts` (pattern proche de `projects` : slug, richText Lexical, cover, galerie, statut draft/published). Labels de section configurables dans `site-settings` (`journalNavLabel`, `journalTitle`, etc.). Couche `content.ts` + fallback démo. Pages Next `/carnet` et `/carnet/[slug]`. Navigation Sidebar + BottomTabBar avec `target="_blank"` et `rel="noopener noreferrer"`.

**Tech Stack:** Next.js 16 App Router, Payload 3, Lexical richText, Vitest, TypeScript, Tailwind tokens, lucide-react.

## Propositions de titre (CMS — champ `journalNavLabel`)

| Titre | Ton | Recommandation |
|---|---|---|
| **Carnet** | Personnel, court, intemporel | ✅ **Défaut retenu** |
| **Le Labo** | Expérimentations IA / prototypes | Fort pour créations IA |
| **En cours** | WIP, du moment, décontracté | Très Skyblog |
| **Brouillons & pixels** | Créatif, un peu nostalgique | Distinctif |
| **Carnet de vol** | Lien avec la métaphore fusée du site | Cohérent avec la marque |
| **Flux créatif** | Feed d’inspirations | Neutre |
| **Notes de studio** | Diary pro créatif | Élégant |
| **Skyline** | Clin d’œil Skyblog + horizon | Fun |
| **Atelier** | Minimal | Simple |

**Route URL fixe :** `/carnet` (indépendante du label affiché — renommable dans le CMS sans migration).

## Global Constraints

- CMS-first : titres, excerpts, contenus via Payload — pas de copy en dur dans les pages (sauf fallback démo)
- Local API Payload via `src/lib/content.ts` — pas de `fetch('/api/journal-posts')` depuis le front
- Mode démo : fallback dans `portfolio-fallback.ts` (2 posts exemple minimum)
- Palette tokens `styles.css` — pas de hex inline
- Server Components par défaut ; `'use client'` seulement si nécessaire
- Liens nav + cartes listing → **`target="_blank"`** + `rel="noopener noreferrer"`
- Page détail `/carnet/[slug]` reste accessible en direct (SEO, partage de lien)
- `pnpm generate:types` après modif schéma
- Branche : `cursor/journal-carnet-cms-ecc9`
- `SITE_VERSION` bump → **0.19.0**
- Gate : `pnpm verify` + `pnpm test:payload`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/collections/JournalPosts.ts` | Schéma CMS posts + hooks revalidation |
| `src/globals/SiteSettings.ts` | Champs `journalNavLabel`, `journalTitle`, `journalEyebrow`, `journalSubtitle` |
| `src/lib/content.ts` | `getPublishedJournalPosts`, `getJournalPostBySlug`, `getJournalSlugs` |
| `src/lib/revalidate.ts` | `revalidateJournalPosts` + paths `/carnet` |
| `src/data/portfolio-fallback.ts` | 2 posts démo + champs journal site-settings |
| `src/components/sections/JournalPostCard.tsx` | Carte feed (cover, excerpt, date, tag) |
| `src/components/sections/JournalPostGrid.tsx` | Grille responsive |
| `src/components/sections/JournalPostDetailView.tsx` | Détail article + galerie |
| `src/app/(frontend)/carnet/page.tsx` | Listing |
| `src/app/(frontend)/carnet/[slug]/page.tsx` | Détail SSG |
| `src/components/layout/Sidebar.tsx` | Nav item Carnet → `_blank` |
| `src/components/layout/BottomTabBar.tsx` | 5e onglet Carnet → `_blank` |
| `src/components/ui/SectionTitle.tsx` | Icône `journal: NotebookPen` |
| `src/app/sitemap.ts` | Routes `/carnet` + slugs |
| `tests/int/journal-posts.int.spec.ts` | CRUD Payload |
| `tests/int/journal-content.int.spec.ts` | Contrat content.ts |

---

### Task 1: Collection Payload `journal-posts`

**Files:**
- Create: `src/collections/JournalPosts.ts`
- Modify: `src/payload.config.ts:86`
- Modify: `src/lib/revalidate.ts`
- Create: `tests/int/journal-posts.int.spec.ts`

**Interfaces:**
- Produces: collection slug `'journal-posts'`, type généré `JournalPost` dans `payload-types.ts`
- Produces: `revalidateJournalPosts`, `revalidateJournalPostsDelete` hooks

- [ ] **Step 1: Write failing CRUD test**

```typescript
// tests/int/journal-posts.int.spec.ts
// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import { createTestMedia, getTestPayload, lexicalParagraph } from './helpers/payload'

describe('journal-posts collection', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getTestPayload()
  }, 60_000)

  it('crée, lit et supprime un post publié', async () => {
    const media = await createTestMedia(payload, 'Journal cover')
    const slug = `journal-crud-${Date.now()}`
    try {
      const post = await payload.create({
        collection: 'journal-posts',
        data: {
          title: 'Test Carnet',
          slug,
          excerpt: 'Excerpt test carnet.',
          content: lexicalParagraph('Contenu carnet CRUD.'),
          cover: media.id,
          status: 'published',
          publishedAt: new Date().toISOString(),
          category: 'ia',
        },
      })
      expect(post.slug).toBe(slug)
      const found = await payload.findByID({ collection: 'journal-posts', id: post.id, depth: 1 })
      expect(found.title).toBe('Test Carnet')
      expect(typeof found.cover).toBe('object')
    } finally {
      const existing = await payload.find({
        collection: 'journal-posts',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs[0]) {
        await payload.delete({ collection: 'journal-posts', id: existing.docs[0].id })
      }
      await payload.delete({ collection: 'media', id: media.id }).catch(() => undefined)
    }
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm vitest run tests/int/journal-posts.int.spec.ts --project node-payload`
Expected: FAIL — collection `journal-posts` not found

- [ ] **Step 3: Create JournalPosts collection**

```typescript
// src/collections/JournalPosts.ts — champs clés
// slug: 'journal-posts'
// admin.useAsTitle: 'title', group: 'Contenu', label: 'Carnet'
// fields: title, slug, excerpt (max 220), content (richText), cover (upload media),
//   gallery (array { image upload }), category select [ia, design, veille, perso, autre],
//   publishedAt (date), status [draft, published], order (number sidebar)
// access: même pattern isPublishedOrAuthenticated que Projects
// hooks: beforeChange slugify, afterChange revalidateJournalPosts
```

- [ ] **Step 4: Register + revalidate paths**

```typescript
// src/lib/revalidate.ts — ajouter à PUBLIC_PATHS
export const PUBLIC_PATHS = ['/', '/projets', '/a-propos', '/contact', '/carnet'] as const

export const revalidateJournalPosts: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  revalidatePublicSite()
  if (doc?.slug) safeRevalidate(`/carnet/${doc.slug}`)
  const previousSlug = previousDoc?.slug
  if (previousSlug && previousSlug !== doc?.slug) safeRevalidate(`/carnet/${previousSlug}`)
  return doc
}
```

```typescript
// src/payload.config.ts
import { JournalPosts } from './collections/JournalPosts'
// collections: [..., JournalPosts],
```

- [ ] **Step 5: Generate types + run test**

Run: `pnpm generate:types && pnpm vitest run tests/int/journal-posts.int.spec.ts --project node-payload`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/collections/JournalPosts.ts src/payload.config.ts src/lib/revalidate.ts tests/int/journal-posts.int.spec.ts src/payload-types.ts
git commit -m "feat(cms): collection journal-posts pour le carnet"
```

---

### Task 2: SiteSettings + content.ts + fallback démo

**Files:**
- Modify: `src/globals/SiteSettings.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/data/portfolio-fallback.ts`
- Create: `tests/int/journal-content.int.spec.ts`

**Interfaces:**
- Produces: `SiteSettingsContent` étendu avec `journalNavLabel`, `journalTitle`, `journalEyebrow`, `journalSubtitle`
- Produces:
  - `getPublishedJournalPosts(): Promise<JournalPost[]>`
  - `getJournalPostBySlug(slug: string): Promise<JournalPost | null>`
  - `getJournalSlugs(): Promise<string[]>`

- [ ] **Step 1: SiteSettings journal fields**

```typescript
// Ajouter dans SiteSettings.ts (collapsible « Carnet »)
{
  name: 'journalNavLabel',
  type: 'text',
  defaultValue: 'Carnet',
  admin: { description: 'Libellé navigation (sidebar / mobile).' },
},
{
  name: 'journalTitle',
  type: 'text',
  defaultValue: 'Carnet',
  admin: { description: 'Titre H1 page listing.' },
},
{
  name: 'journalEyebrow',
  type: 'text',
  defaultValue: 'Créations & veille',
},
{
  name: 'journalSubtitle',
  type: 'textarea',
  defaultValue: 'Créations IA, expérimentations visuelles et notes du moment — un skyblog 2026.',
},
```

- [ ] **Step 2: content.ts getters**

```typescript
export async function getPublishedJournalPosts(): Promise<JournalPost[]> {
  const payload = await getPayloadClientSafe()
  if (payload) {
    const result = await payload.find({
      collection: 'journal-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 1,
      limit: 100,
    })
    return result.docs
  }
  return portfolioFallback.journalPosts
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  // pattern identique getProjectBySlug
}

export async function getJournalSlugs(): Promise<string[]> {
  const posts = await getPublishedJournalPosts()
  return posts.map((post) => post.slug)
}
```

- [ ] **Step 3: Fallback 2 posts démo** (titres/excerpts sans richText complexe — réutiliser structure Project simplifiée)

- [ ] **Step 4: Test content layer**

```typescript
// tests/int/journal-content.int.spec.ts
it('getPublishedJournalPosts peuple cover', async () => {
  const posts = await getPublishedJournalPosts()
  expect(posts.length).toBeGreaterThan(0)
  // ...
})
```

- [ ] **Step 5: Run tests + commit**

Run: `pnpm generate:types && pnpm vitest run tests/int/journal-content.int.spec.ts tests/int/journal-posts.int.spec.ts --project node-payload`

```bash
git add src/globals/SiteSettings.ts src/lib/content.ts src/data/portfolio-fallback.ts tests/int/journal-content.int.spec.ts src/payload-types.ts
git commit -m "feat(content): getters carnet + labels CMS + fallback démo"
```

---

### Task 3: UI composants + pages `/carnet`

**Files:**
- Create: `src/components/sections/JournalPostCard.tsx`
- Create: `src/components/sections/JournalPostGrid.tsx`
- Create: `src/components/sections/JournalPostDetailView.tsx`
- Create: `src/app/(frontend)/carnet/page.tsx`
- Create: `src/app/(frontend)/carnet/[slug]/page.tsx`
- Modify: `src/components/ui/SectionTitle.tsx`
- Modify: `src/app/(frontend)/styles.css` (optionnel `.journal-*` si besoin)

**Interfaces:**
- Consumes: `getPublishedJournalPosts`, `getJournalPostBySlug`, `getSiteSettingsContent`
- Produces: pages SSG avec `revalidate = 3600`

- [ ] **Step 1: JournalPostCard — lien `_blank`**

```tsx
<Link
  href={`/carnet/${post.slug}`}
  rel="noopener noreferrer"
  target="_blank"
  className="journal-post-card ..."
>
  {/* cover Image, category badge, title, excerpt, date formatée fr-FR */}
</Link>
```

- [ ] **Step 2: Listing page**

```tsx
// src/app/(frontend)/carnet/page.tsx
export default async function CarnetPage() {
  const [posts, settings] = await Promise.all([getPublishedJournalPosts(), getSiteSettingsContent()])
  return (
    <Container>
      <ReadableSurface strong>
        <SectionTitle
          editorial
          eyebrow={settings.journalEyebrow ?? 'Créations & veille'}
          icon="journal"
          subtitle={settings.journalSubtitle ?? undefined}
          title={settings.journalTitle ?? 'Carnet'}
        />
        <JournalPostGrid posts={posts} />
      </ReadableSurface>
    </Container>
  )
}
```

- [ ] **Step 3: Detail page** — `JournalPostDetailView` avec `RichTextRenderer`, galerie images, breadcrumb retour `/carnet`

- [ ] **Step 4: SectionTitle icon**

```typescript
import { NotebookPen } from 'lucide-react'
// SECTION_ICONS.journal = NotebookPen
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/JournalPost*.tsx src/app/\(frontend\)/carnet/ src/components/ui/SectionTitle.tsx src/app/\(frontend\)/styles.css
git commit -m "feat(carnet): pages listing et détail + composants feed"
```

---

### Task 4: Navigation nouvel onglet + sitemap

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/components/layout/BottomTabBar.tsx`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `journalNavLabel` from layout (pass from `layout.tsx` like siteName)

- [ ] **Step 1: Pass journalNavLabel in layout.tsx**

```tsx
// src/app/(frontend)/layout.tsx — lire getSiteSettingsContent, passer à Sidebar/BottomTabBar
journalNavLabel={settings.journalNavLabel ?? 'Carnet'}
```

- [ ] **Step 2: Sidebar — NotebookPen icon, target _blank**

```tsx
const NAV = [
  // ...existing
  { href: '/carnet', label: journalNavLabel, icon: NotebookPen, external: true },
] as const

// Link: target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
```

- [ ] **Step 3: BottomTabBar — grid-cols-5, même lien _blank**

- [ ] **Step 4: Sitemap**

```typescript
{ url: `${siteUrl}/carnet`, changeFrequency: 'weekly', priority: 0.85 },
// + journal slugs
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/components/layout/BottomTabBar.tsx src/app/\(frontend\)/layout.tsx src/app/sitemap.ts
git commit -m "feat(nav): entrée Carnet ouvrant dans un nouvel onglet"
```

---

### Task 5: Verify, bump, push

- [ ] **Step 1: Bump SITE_VERSION**

```typescript
export const SITE_VERSION = '0.19.0'
```

- [ ] **Step 2: Full gate**

Run: `pnpm verify && pnpm test:payload`
Expected: PASS

- [ ] **Step 3: Push**

```bash
git add src/lib/site-version.ts
git commit -m "chore: bump SITE_VERSION to 0.19.0"
git push -u origin cursor/journal-carnet-cms-ecc9
```

---

## Self-Review

| Spec | Task |
|---|---|
| Articles + images CMS | Task 1 (gallery, cover, richText) |
| Gérable Payload | Task 1 + 2 |
| Nouvel onglet | Task 3 (cards) + Task 4 (nav) |
| Titre sympa (pas Blog) | CMS `journalNavLabel`, défaut Carnet |
| Mode démo | Task 2 fallback |
| SEO sitemap | Task 4 |

No placeholders.

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-07-25-journal-carnet-cms.md`.

**Subagent-Driven execution requested.**
