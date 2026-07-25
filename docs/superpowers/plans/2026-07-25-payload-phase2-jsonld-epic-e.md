# Payload Phase 2 — JSON-LD CMS + Epic E Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compléter B4 (JSON-LD Article/Project depuis meta CMS) puis Epic E (projets liés, Lablog featured, liens footer éditables) en respectant CMS-first et mode démo.

**Architecture:** Helpers purs `json-ld.tsx` + `resolveDocumentSeo` alimentent les pages détail ; schéma Payload étendu (relationship + array site-settings) ; `content.ts` expose les données ; composants front consomment via props CMS. TDD sur toute logique métier.

**Tech Stack:** Payload 3.86, Next.js 16, Postgres/Neon, Vitest, `@payloadcms/plugin-seo` (meta tab)

## Global Constraints

- CMS-first : pas de copy marketing en dur dans les pages
- Local API uniquement côté front public (`content.ts`)
- Ne pas casser le mode démo (`isPayloadConfigured()`)
- `pnpm verify` avant merge
- Branches agent : `cursor/<description>-ecc9`
- Bump `SITE_VERSION` par livraison notable
- TDD obligatoire : test qui échoue → implémentation minimale → vert
- `pnpm generate:types` après modif schéma
- Ne pas toucher `portfolio-fallback.ts` sauf champs site-settings optionnels vides

---

## File map

| File | Responsibility |
|---|---|
| `src/lib/json-ld.tsx` | Builders Article, CreativeWork enrichis |
| `tests/int/json-ld-document.int.spec.ts` | Tests builders B4 |
| `src/app/(frontend)/carnet/[slug]/page.tsx` | JSON-LD Article + breadcrumb |
| `src/app/(frontend)/projets/[slug]/page.tsx` | JSON-LD depuis meta CMS |
| `src/collections/Projects.ts` | Champ `relatedProjects` self-relation |
| `src/components/sections/RelatedProjects.tsx` | Bloc « Voir aussi » |
| `src/components/sections/ProjectDetailView.tsx` | Affiche related |
| `src/globals/SiteSettings.ts` | `featuredJournalPosts`, `footerLinks` |
| `src/lib/content.ts` | Resolvers featured journal + footer links |
| `src/components/layout/Footer.tsx` | Liens CMS footer |
| `src/app/(frontend)/page.tsx` | Section Lablog featured accueil |

---

### Task 1: JSON-LD builders Article + Project (B4)

**Files:**
- Modify: `src/lib/json-ld.tsx`
- Create: `tests/int/json-ld-document.int.spec.ts`
- Modify: `vitest.config.mts` (include new test)

**Interfaces:**
- Consumes: `resolveDocumentSeo` output shape from `src/lib/seo-document.ts`
- Produces:
  - `articleJsonLd(input: ArticleJsonLdInput): Record<string, unknown>`
  - `projectJsonLd(input: ProjectJsonLdInput): Record<string, unknown>` — alias CreativeWork enrichi avec `keywords` depuis tags

- [ ] **Step 1: Write the failing test**

```typescript
// tests/int/json-ld-document.int.spec.ts
import { describe, expect, it } from 'vitest'
import { articleJsonLd, projectJsonLd } from '@/lib/json-ld'

describe('articleJsonLd', () => {
  it('émet un schema.org Article avec headline et dates', () => {
    const data = articleJsonLd({
      headline: 'Mon article',
      description: 'Résumé',
      url: 'https://example.com/carnet/mon-article',
      datePublished: '2026-01-15T10:00:00.000Z',
      dateModified: '2026-01-16T12:00:00.000Z',
      authorName: 'Bertrand',
      image: 'https://example.com/cover.jpg',
    })
    expect(data['@type']).toBe('Article')
    expect(data.headline).toBe('Mon article')
    expect(data.datePublished).toBe('2026-01-15T10:00:00.000Z')
    expect(data.author).toEqual({ '@type': 'Person', name: 'Bertrand' })
  })
})

describe('projectJsonLd', () => {
  it('émet CreativeWork avec keywords depuis tags', () => {
    const data = projectJsonLd({
      name: 'Portfolio',
      description: 'CMS portfolio',
      url: 'https://example.com/projets/portfolio',
      keywords: ['Next.js', 'Payload'],
    })
    expect(data['@type']).toBe('CreativeWork')
    expect(data.keywords).toBe('Next.js, Payload')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/int/json-ld-document.int.spec.ts`
Expected: FAIL — `articleJsonLd` / `projectJsonLd` not exported

- [ ] **Step 3: Write minimal implementation**

Add to `src/lib/json-ld.tsx`:

```typescript
export type ArticleJsonLdInput = {
  headline: string
  description?: string | null
  url: string
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string | null
  image?: string | null
}

export function articleJsonLd(input: ArticleJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description || undefined,
    url: input.url,
    datePublished: input.datePublished || undefined,
    dateModified: input.dateModified || undefined,
    image: input.image || undefined,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
  }
}

export type ProjectJsonLdInput = {
  name: string
  description?: string | null
  url?: string | null
  image?: string | null
  datePublished?: string | null
  authorName?: string | null
  keywords?: string[]
}

export function projectJsonLd(input: ProjectJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description || undefined,
    url: input.url || undefined,
    image: input.image || undefined,
    datePublished: input.datePublished || undefined,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
  }
}
```

Keep existing `creativeWorkJsonLd` — pages migrate to `projectJsonLd` in Task 2.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/int/json-ld-document.int.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/json-ld.tsx tests/int/json-ld-document.int.spec.ts vitest.config.mts
git commit -m "feat(seo): builders JSON-LD Article et Project (B4)"
```

---

### Task 2: Brancher JSON-LD CMS sur pages détail (B4)

**Files:**
- Modify: `src/app/(frontend)/carnet/[slug]/page.tsx`
- Modify: `src/app/(frontend)/projets/[slug]/page.tsx`
- Modify: `src/lib/site-version.ts` (bump patch)

**Interfaces:**
- Consumes: `articleJsonLd`, `projectJsonLd`, `breadcrumbJsonLd`, `resolveDocumentSeo`, `getSiteUrl`
- Produces: `<JsonLd>` scripts on carnet + projet pages using CMS meta title/description when present

- [ ] **Step 1: Write the failing test**

```typescript
// tests/int/json-ld-pages.int.spec.ts
import { describe, expect, it } from 'vitest'
import { buildProjectJsonLdFromDoc } from '@/lib/json-ld-document'

describe('buildProjectJsonLdFromDoc', () => {
  it('priorise meta SEO title sur title document', () => {
    const data = buildProjectJsonLdFromDoc({
      project: { title: 'Titre CMS', slug: 'foo', excerpt: 'Excerpt', createdAt: '2026-01-01', stack: ['nextjs'] },
      meta: { title: 'Titre SEO' },
      siteUrl: 'https://example.com',
      authorName: 'Dev',
      coverUrl: null,
      tagNames: ['Next.js'],
    })
    expect(data.name).toBe('Titre SEO')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

- [ ] **Step 3: Create `src/lib/json-ld-document.ts`**

```typescript
import { articleJsonLd, breadcrumbJsonLd, projectJsonLd } from '@/lib/json-ld'
import { resolveDocumentSeo } from '@/lib/seo-document'

const STACK_LABELS: Record<string, string> = {
  nextjs: 'Next.js', react: 'React', typescript: 'TypeScript', payload: 'Payload CMS',
  nodejs: 'Node.js', postgres: 'PostgreSQL', tailwind: 'Tailwind CSS',
  'framer-motion': 'Framer Motion', vercel: 'Vercel', neon: 'Neon',
}

export function buildArticleJsonLdFromDoc(input: {
  post: { title: string; slug: string; excerpt?: string | null; publishedAt: string; updatedAt: string; meta?: { title?: string | null; description?: string | null } | null }
  siteUrl: string
  authorName?: string | null
  coverUrl?: string | null
}) {
  const path = `/carnet/${input.post.slug}`
  const seo = resolveDocumentSeo({
    docTitle: input.post.title,
    docExcerpt: input.post.excerpt,
    meta: input.post.meta,
    path,
    coverUrl: input.coverUrl,
  })
  return articleJsonLd({
    headline: seo.title,
    description: seo.description,
    url: `${input.siteUrl}${path}`,
    datePublished: input.post.publishedAt,
    dateModified: input.post.updatedAt,
    authorName: input.authorName,
    image: seo.image,
  })
}

export function buildProjectJsonLdFromDoc(input: {
  project: { title: string; slug: string; excerpt?: string | null; createdAt: string; stack?: string[] | null; meta?: { title?: string | null; description?: string | null } | null }
  siteUrl: string
  authorName?: string | null
  coverUrl?: string | null
  tagNames?: string[]
}) {
  const path = `/projets/${input.project.slug}`
  const seo = resolveDocumentSeo({
    docTitle: input.project.title,
    docExcerpt: input.project.excerpt,
    meta: input.project.meta,
    path,
    coverUrl: input.coverUrl,
  })
  const stackKeywords = (input.project.stack || []).map((s) => STACK_LABELS[s] || s)
  const keywords = [...new Set([...(input.tagNames || []), ...stackKeywords])]
  return projectJsonLd({
    name: seo.title,
    description: seo.description,
    url: `${input.siteUrl}${path}`,
    image: seo.image,
    datePublished: input.project.createdAt,
    authorName: input.authorName,
    keywords,
  })
}

export { breadcrumbJsonLd }
```

Wire pages to use these helpers + breadcrumb on carnet page.

- [ ] **Step 4: Run tests + typecheck**

Run: `pnpm vitest run tests/int/json-ld-pages.int.spec.ts && pnpm typecheck`

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(seo): JSON-LD Article/Project depuis meta CMS sur pages détail"
```

---

### Task 3: Projets liés E1

**Files:**
- Modify: `src/collections/Projects.ts`
- Create: `src/components/sections/RelatedProjects.tsx`
- Modify: `src/components/sections/ProjectDetailView.tsx`
- Modify: `src/app/(frontend)/projets/[slug]/page.tsx`
- Create: `tests/int/related-projects.int.spec.ts`

**Interfaces:**
- Consumes: `Project.relatedProjects` (relationship self, max 3)
- Produces: `resolveRelatedProjects(project, allPublished): AdjacentProject[]`

- [ ] **Step 1: Write failing test for resolver**

```typescript
import { resolveRelatedProjects } from '@/lib/related-projects'

it('retourne les projets liés publiés dans l ordre CMS', () => {
  const all = [
    { id: 1, slug: 'a', title: 'A', status: 'published' },
    { id: 2, slug: 'b', title: 'B', status: 'published' },
    { id: 3, slug: 'c', title: 'C', status: 'draft' },
  ]
  const current = { id: 1, slug: 'a', relatedProjects: [3, 2] }
  const related = resolveRelatedProjects(current, all)
  expect(related.map((p) => p.slug)).toEqual(['b'])
})
```

- [ ] **Step 2–4: Implement field + resolver + UI section « Voir aussi »**

Add to Projects.ts before `featured`:

```typescript
{
  name: 'relatedProjects',
  type: 'relationship',
  relationTo: 'projects',
  hasMany: true,
  maxRows: 3,
  admin: { description: 'Projets suggérés en bas de fiche (publiés uniquement).' },
},
```

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(projects): relation projets liés + bloc Voir aussi (E1)"
```

---

### Task 4: Lablog featured accueil E3

**Files:**
- Modify: `src/globals/SiteSettings.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/app/(frontend)/page.tsx`
- Create: `src/components/sections/FeaturedJournalPosts.tsx` (or reuse JournalPostGrid)
- Create: `tests/int/featured-journal.int.spec.ts`

**Interfaces:**
- Consumes: `site-settings.featuredJournalPosts` (relationship journal-posts, max 3)
- Produces: `getFeaturedJournalPosts(): Promise<JournalPost[]>`

- [ ] **Step 1: Failing test**

```typescript
import { resolveFeaturedJournalPosts } from '@/lib/featured-journal'

it('filtre brouillons et limite à 3', () => {
  const posts = [
    { id: 1, slug: 'a', status: 'published' },
    { id: 2, slug: 'b', status: 'draft' },
  ]
  const picked = resolveFeaturedJournalPosts([1, 2], posts)
  expect(picked.map((p) => p.slug)).toEqual(['a'])
})
```

- [ ] **Step 2–4: Schema + content + home section below projects**

Field in SiteSettings (navigationFields or new lablogFields):

```typescript
{
  name: 'featuredJournalPosts',
  type: 'relationship',
  relationTo: 'journal-posts',
  hasMany: true,
  maxRows: 3,
  admin: { description: 'Articles Lablog mis en avant sur l’accueil (max 3).' },
},
```

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(home): articles Lablog featured depuis site-settings (E3)"
```

---

### Task 5: Liens footer éditables E4

**Files:**
- Modify: `src/globals/SiteSettings.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/(frontend)/layout.tsx`
- Create: `tests/int/footer-links.int.spec.ts`

**Interfaces:**
- Consumes: `site-settings.footerLinks: { label, href, openInNewTab? }[]`
- Produces: Footer renders CMS links before mentions légales ; fallback = liens actuels en dur si array vide (mode démo OK)

- [ ] **Step 1: Failing test**

```typescript
import { resolveFooterLinks } from '@/lib/footer-links'

it('retourne les liens CMS ou fallback légal par défaut', () => {
  expect(resolveFooterLinks([])).toHaveLength(2)
  expect(resolveFooterLinks([{ label: 'GitHub', href: 'https://github.com/x' }])).toHaveLength(1)
})
```

- [ ] **Step 2–4: Implement array + Footer props**

- [ ] **Step 5: Commit + bump SITE_VERSION + pnpm verify**

```bash
git commit -m "feat(cms): liens footer éditables site-settings (E4)"
pnpm verify
```

---

## Self-review

| Spec requirement | Task |
|---|---|
| B4 Article JSON-LD CMS | Task 1 + 2 |
| B4 Project JSON-LD CMS | Task 1 + 2 |
| E1 related projects | Task 3 |
| E3 featured Lablog | Task 4 |
| E4 footer links | Task 5 |
| A2 drafts | **Hors scope** — push Neon interactif, documenter séparément |

No placeholders remain in task steps.
