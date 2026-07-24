# Refonte dashboard Payload CMS — doublons & globals vides

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger l’admin Payload (globals éditables, zéro doublon visuel) et livrer un dashboard mobile-first cohérent avec Payload 3.86, sans casser le mode démo ni le front public.

**Architecture:** (1) Phase diagnostic pour confirmer la cause réelle (UX vs CSS vs seed vs schéma DB). (2) Remplacer la pile `beforeDashboard` (3 blocs redondants + hero dupliqué) par **un seul widget dashboard Payload 3** + éventuellement un bandeau compact. (3) Refactoriser `custom.scss` en styles **namespacés** (`.portfolio-admin__*`) — supprimer les sélecteurs globaux `.card` / `.dashboard .card` qui recouvrent les composants natifs Payload. (4) Simplifier les globals : remplacer le `tabs` racine par des **`collapsible`** (moins fragile côté CSS Payload) tout en conservant les mêmes champs. (5) Compléter le seed + test E2E « champs visibles ».

**Tech Stack:** Next.js 16, Payload CMS 3.86, Postgres (Neon), SCSS admin (`src/app/(payload)/custom.scss`), Playwright e2e, Vitest int.

## Global Constraints

- Branches agents : `cursor/<description>-ecc9`
- CMS-first — pas de copy marketing en dur dans les pages publiques
- Server Components par défaut ; `'use client'` seulement si nécessaire (TrustedDevicePanel reste client)
- Pas de lib UI lourde dans l’admin
- Ne pas casser le **mode démo** (`isPayloadConfigured()`)
- Gate PR : `pnpm verify`
- Bump `SITE_VERSION` (`src/lib/site-version.ts`) si livraison notable
- Admin CSS : **pas de Tailwind** dans `(payload)/custom.scss`
- Schéma DB : `pnpm db:push` local ; auto sur build Vercel si `DATABASE_URI` + `PAYLOAD_SECRET` (sauf `PAYLOAD_DB_PUSH=false`)
- **Production non requise** pour éditer les globals — seulement `DATABASE_URI` + `PAYLOAD_SECRET` + schéma synchronisé

---

## Analyse préalable (état actuel — branche `cursor/redesign-payload-cms-ecc9`)

### Réponse à « faut-il être en production ? »

**Non.** Les globals Payload fonctionnent dès que :

1. `.env.local` contient `DATABASE_URI` + `PAYLOAD_SECRET`
2. Postgres tourne (`sudo pg_ctlcluster 16 main start`)
3. Le schéma est poussé (`pnpm db:push` ou build Vercel avec push auto)

Preuve locale (2026-07-24) : `GET /api/globals/site-settings` renvoie bien `siteName`, `themeColor`, `enableContactForm`, etc. Le problème est **UI/UX ou déploiement**, pas l’environnement production.

### Causes identifiées des doublons dashboard

| Source | Problème |
|---|---|
| `beforeDashboard` × 3 | `AdminDashboardHero` + `CmsSyncBanner` + `TrustedDevicePanel` empilés **avant** le widget natif |
| Widget natif Payload 3 | `CollectionCards` (`admin.dashboard.defaultLayout`) affiche déjà collections **et** globals (Configuration → Paramètres du site, SEO) |
| `AdminDashboardHero` | 4 cartes qui dupliquent exactement les liens déjà présents dans `CollectionCards` |
| `.cms-sync-banner` réutilisé | `TrustedDevicePanel` reprend la même classe que `CmsSyncBanner` → 2–3 blocs visuellement identiques |
| `custom.scss` §7 | Sélecteurs **globaux** `.card`, `.dashboard .card` recouvrent le composant Payload `Card` → double bordure / effet « container dans container » |

### Causes probables des globals « vides »

| Hypothèse | Symptôme | Vérification |
|---|---|---|
| **A — Confusion dashboard** | Cartes « Paramètres du site » n’affichent que le titre (comportement natif Payload) | Normal : pas de preview des champs sur le dashboard |
| **B — Seed incomplet** | Nouveaux champs SEO (`titleTemplate`, `robotsIndex`, …) restent `null` | `scripts/seed-portfolio.ts` ne peuple que `defaultTitle` + `defaultDescription` pour SEO |
| **C — CSS onglets** | Onglets visibles mais contenu difficile à lire / mauvais état actif | Notre CSS cible `[aria-selected='true']` alors que Payload utilise `.tabs-field__tab-button--active` |
| **D — Schéma prod non sync** | Page global en erreur ou partiellement vide après deploy | Logs Vercel build : `[db:push]` ; colonnes manquantes en SQL |
| **E — PR non déployée** | Ancien admin sans onglets / ancien schéma | Vérifier branche Vercel active |

---

## File Structure (cible)

| Fichier | Rôle |
|---|---|
| `src/payload.config.ts` | Widget dashboard unique ; retirer/simplifier `beforeDashboard` |
| `src/components/admin/AdminWelcomeWidget.tsx` | **Nouveau** widget Payload 3 (remplace Hero + Sync banner) |
| `src/components/admin/TrustedDevicePanel.tsx` | Styles propres `.portfolio-admin__security` (plus `.cms-sync-banner`) |
| `src/components/admin/AdminDashboardHero.tsx` | **Supprimer** (doublon) |
| `src/components/admin/CmsSyncBanner.tsx` | **Supprimer** ou fusionner dans le widget |
| `src/app/(payload)/custom.scss` | Refonte namespacée ; retirer `.card` global |
| `src/globals/SiteSettings.ts` | `tabs` → `collapsible` (6 sections) |
| `src/globals/SEODefaults.ts` | `tabs` → `collapsible` (5 sections) |
| `scripts/seed-portfolio.ts` | Peupler tous les nouveaux champs site + SEO |
| `tests/e2e/admin-globals.e2e.spec.ts` | **Nouveau** — champs visibles sur globals |
| `tests/int/payload-schema.int.spec.ts` | Adapter helper `fieldNames` si structure change |
| `src/lib/site-version.ts` | Bump ex. `0.17.1` |

---

## Décisions UX verrouillées

| Zone | Décision |
|---|---|
| Dashboard | **1 widget welcome** (texte + 1 CTA « Actualiser le site ») + widget natif `CollectionCards` — pas de second grille de liens |
| Sécurité appareils | Panneau **repliable** sous le welcome (pas un 3e bandeau pleine largeur identique) |
| Globals | **Collapsible** au lieu de tabs (moins de conflits CSS, scroll naturel mobile) |
| Styles custom | Préfixe obligatoire `.portfolio-admin__` — interdit de surcharger `.card`, `.dashboard`, `.tabs-field__*` sans scope |
| Preview dashboard | Optionnel : afficher `siteName · tagline` dans le welcome widget (données live via props widget) |

---

### Task 0: Diagnostic (obligatoire avant code)

**Files:**
- Read-only : `/admin`, `/admin/globals/site-settings`, `/admin/globals/seo-defaults`
- Shell : API + SQL

**Interfaces:**
- Produces: rapport court (3 lignes) : cause A/B/C/D/E confirmée

- [ ] **Step 1: Vérifier les données API**

```bash
curl -s http://localhost:3000/api/globals/site-settings | jq '{siteName, themeColor, enableContactForm}'
curl -s http://localhost:3000/api/globals/seo-defaults | jq '{defaultTitle, titleTemplate, robotsIndex}'
```

Expected: JSON avec valeurs (local) ou 401/404 si CMS off

- [ ] **Step 2: Vérifier schéma SQL (colonnes récentes)**

```bash
psql postgresql://postgres:postgres@127.0.0.1:5432/portfolio -c "\d site_settings" | rg "theme_color|maintenance_mode|legal_publisher"
psql postgresql://postgres:postgres@127.0.0.1:5432/portfolio -c "\d seo_defaults" | rg "title_template|noindex_site|enable_person_json_ld"
```

Expected: colonnes présentes

- [ ] **Step 3: Capture admin globals**

Ouvrir `/admin/globals/site-settings` → confirmer si :
- (i) aucun input du tout → CSS/render
- (ii) inputs visibles mais valeurs vides → seed
- (iii) seulement titres on dashboard → confusion UX (cas A)

- [ ] **Step 4: Noter la cause dans le commit message de Task 1**

---

### Task 1: Supprimer les doublons dashboard (config Payload 3)

**Files:**
- Create: `src/components/admin/AdminWelcomeWidget.tsx`
- Modify: `src/payload.config.ts`
- Delete: `src/components/admin/AdminDashboardHero.tsx`
- Delete: `src/components/admin/CmsSyncBanner.tsx`
- Modify: `src/app/(payload)/admin/importMap.js` (via `pnpm generate:importmap`)

**Interfaces:**
- Produces:
```tsx
// AdminWelcomeWidget.tsx — Server Component (WidgetServerProps)
export default async function AdminWelcomeWidget(props: WidgetServerProps): Promise<React.JSX.Element>
```
- Consumes: `props.req.payload.findGlobal({ slug: 'site-settings', depth: 0 })` pour afficher `siteName` + `tagline`

- [ ] **Step 1: Write the failing e2e test (dashboard sans doublon de liens)**

Créer `tests/e2e/admin-dashboard.e2e.spec.ts` :

```ts
import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin dashboard layout', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })
  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('une seule carte Paramètres du site sur le dashboard', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('http://localhost:3000/admin')
    await expect(page.getByRole('heading', { name: 'Paramètres du site' })).toHaveCount(1)
    await expect(page.locator('.portfolio-admin__welcome')).toHaveCount(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:e2e tests/e2e/admin-dashboard.e2e.spec.ts`
Expected: FAIL — `.portfolio-admin__welcome` absent ; count heading > 1 si hero + CollectionCards

- [ ] **Step 3: Créer AdminWelcomeWidget**

```tsx
import React from 'react'
import type { WidgetServerProps } from 'payload'

export default async function AdminWelcomeWidget({ req }: WidgetServerProps) {
  const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)
  const siteName = settings?.siteName || 'Portfolio'
  const tagline = settings?.tagline || ''

  return (
    <section className="portfolio-admin__welcome">
      <p className="portfolio-admin__welcome-eyebrow">Studio éditorial</p>
      <h2 className="portfolio-admin__welcome-title">{siteName}</h2>
      {tagline ? <p className="portfolio-admin__welcome-text">{tagline}</p> : null}
      <p className="portfolio-admin__welcome-hint">
        Modifiez le contenu via <strong>Configuration</strong> ci-dessous. Chaque enregistrement
        revalide le site public automatiquement.
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Mettre à jour payload.config.ts**

```ts
admin: {
  // ...
  dashboard: {
    widgets: [
      {
        slug: 'portfolio-welcome',
        Component: '/components/admin/AdminWelcomeWidget',
        minWidth: 'full',
        maxWidth: 'full',
      },
      {
        slug: 'collections',
        Component: '@payloadcms/next/rsc#CollectionCards',
        minWidth: 'full',
      },
    ],
    defaultLayout: [
      { widgetSlug: 'portfolio-welcome', width: 'full' },
      { widgetSlug: 'collections', width: 'full' },
    ],
  },
  components: {
    // ...
    beforeDashboard: ['/components/admin/TrustedDevicePanel'],
  },
}
```

- [ ] **Step 5: Supprimer AdminDashboardHero.tsx et CmsSyncBanner.tsx + retirer leurs imports du config**

- [ ] **Step 6: Run `pnpm generate:importmap`**

- [ ] **Step 7: Run e2e test**

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/payload.config.ts src/components/admin/AdminWelcomeWidget.tsx \
  tests/e2e/admin-dashboard.e2e.spec.ts src/app/(payload)/admin/importMap.js
git rm src/components/admin/AdminDashboardHero.tsx src/components/admin/CmsSyncBanner.tsx
git commit -m "fix(admin): supprimer doublons dashboard via widget Payload 3 unique"
```

---

### Task 2: Refactor CSS admin — zéro collision avec Payload

**Files:**
- Modify: `src/app/(payload)/custom.scss`
- Modify: `src/components/admin/TrustedDevicePanel.tsx`

**Interfaces:**
- Consumes: classes `.portfolio-admin__*` de Task 1
- Produces: styles welcome + security sans toucher `.card` natif

- [ ] **Step 1: Supprimer les blocs dangereux dans custom.scss**

Retirer entièrement :
- §7 règles `.card`, `.dashboard .card` (lignes ~335–350)
- §16 `.admin-dashboard-hero*` (obsolète)
- §17 règles non scopées sur `.tabs-field__*` (sera irrelevant après Task 3)

- [ ] **Step 2: Ajouter styles namespacés**

```scss
/* -------------------------------------------------------------------------- */
/* Portfolio admin — composants custom UNIQUEMENT                                */
/* -------------------------------------------------------------------------- */

.portfolio-admin__welcome {
  margin-bottom: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: var(--style-radius-l);
  border: 1px solid var(--brand-border-subtle);
  background:
    radial-gradient(120% 140% at 100% 0%, rgb(255 133 10 / 0.14), transparent 55%),
    var(--brand-surface);
}

.portfolio-admin__welcome-eyebrow {
  margin: 0;
  color: var(--brand-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.portfolio-admin__welcome-title {
  margin: 0.35rem 0 0;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--brand-text);
}

.portfolio-admin__welcome-text {
  margin: 0.45rem 0 0;
  color: var(--brand-text-muted);
  font-size: 0.9rem;
}

.portfolio-admin__welcome-hint {
  margin: 0.65rem 0 0;
  color: var(--brand-text-muted);
  font-size: 0.82rem;
  line-height: 1.45;
}

.portfolio-admin__security {
  margin-bottom: 1rem;
  padding: 0.9rem 1.1rem;
  border-radius: var(--style-radius-m);
  border: 1px solid var(--brand-border-subtle);
  background: var(--brand-surface-2);
}

@media (max-width: 768px) {
  .portfolio-admin__welcome,
  .portfolio-admin__security {
    margin-inline: 0;
    border-radius: var(--style-radius-m);
  }

  .doc-controls__wrapper,
  .form-submit {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding-block: 0.75rem;
    background: linear-gradient(to top, var(--brand-bg) 72%, transparent);
  }

  .btn {
    min-height: 44px;
  }
}
```

- [ ] **Step 3: TrustedDevicePanel — remplacer className**

```tsx
// Remplacer className="cms-sync-banner" par className="portfolio-admin__security"
// Remplacer cms-sync-banner__title → portfolio-admin__security-title (etc.)
```

- [ ] **Step 4: Vérification visuelle mobile 390px + desktop**

Run: `pnpm dev` → `/admin`, `/admin/globals/site-settings`

- [ ] **Step 5: Commit**

```bash
git add src/app/(payload)/custom.scss src/components/admin/TrustedDevicePanel.tsx
git commit -m "fix(admin): CSS namespacé sans collision Card Payload"
```

---

### Task 3: Globals — collapsible au lieu de tabs

**Files:**
- Modify: `src/globals/SiteSettings.ts`
- Modify: `src/globals/SEODefaults.ts`
- Modify: `tests/int/payload-schema.int.spec.ts`
- Modify: `tests/int/cv-schema.int.spec.ts`
- Run: `pnpm generate:types`

**Interfaces:**
- Produces: champs identiques, structure `type: 'collapsible'` avec `label` + `fields`
- Consumes: tableaux `identityFields`, `contactFields`, etc. existants

- [ ] **Step 1: Write failing e2e globals test**

Créer `tests/e2e/admin-globals.e2e.spec.ts` :

```ts
import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin globals forms', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })
  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('site-settings affiche siteName et email', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('http://localhost:3000/admin/globals/site-settings')
    await expect(page.locator('input[name="siteName"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="themeColor"]')).toBeVisible()
  })

  test('seo-defaults affiche defaultTitle et titleTemplate', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('http://localhost:3000/admin/globals/seo-defaults')
    await expect(page.locator('input[name="defaultTitle"]')).toBeVisible()
    await expect(page.locator('input[name="titleTemplate"]')).toBeVisible()
  })
})
```

- [ ] **Step 2: Run test (baseline — peut déjà passer ou échouer selon env)**

- [ ] **Step 3: Remplacer tabs par collapsible dans SiteSettings.ts**

```ts
fields: [
  { type: 'collapsible', label: 'Identité', admin: { initCollapsed: false }, fields: identityFields },
  { type: 'collapsible', label: 'Contact', admin: { initCollapsed: true }, fields: contactFields },
  { type: 'collapsible', label: 'Contenu', admin: { initCollapsed: true }, fields: contentFields },
  { type: 'collapsible', label: 'CV', admin: { initCollapsed: true }, fields: cvFields },
  { type: 'collapsible', label: 'Légal', admin: { initCollapsed: true }, fields: legalFields },
  { type: 'collapsible', label: 'Avancé', admin: { initCollapsed: true }, fields: advancedFields },
],
```

- [ ] **Step 4: Idem SEODefaults.ts (5 collapsibles : Général, Open Graph, Twitter, Indexation, JSON-LD)**

- [ ] **Step 5: Mettre à jour helper `fieldNames` pour parcourir `collapsible`**

```ts
if (field.type === 'collapsible' && field.fields) {
  names.push(...fieldNames(field.fields as typeof fields))
}
```

- [ ] **Step 6: `pnpm generate:types && pnpm test:int`**

Expected: PASS

- [ ] **Step 7: Run e2e globals**

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/globals/SiteSettings.ts src/globals/SEODefaults.ts src/payload-types.ts tests/
git commit -m "fix(admin): globals en collapsibles pour formulaires fiables mobile-first"
```

---

### Task 4: Seed complet des nouveaux champs

**Files:**
- Modify: `scripts/seed-portfolio.ts`

**Interfaces:**
- Consumes: `portfolioFallback.siteSettings` + `portfolioFallback.seoDefaults` (tous champs ajoutés en v0.17.0)

- [ ] **Step 1: Write failing int test (optionnel mais recommandé)**

Ajouter dans `tests/int/payload-collections.int.spec.ts` :

```ts
it('seo-defaults contient titleTemplate après seed shape', async () => {
  const seo = await payload.findGlobal({ slug: 'seo-defaults', depth: 0 })
  expect(seo).toHaveProperty('titleTemplate')
  expect(seo).toHaveProperty('robotsIndex')
})
```

- [ ] **Step 2: Étendre updateGlobal site-settings dans seed-portfolio.ts**

Ajouter au bloc `data:` :

```ts
themeColor: siteSettings.themeColor,
contactPageSubtitle: siteSettings.contactPageSubtitle,
enableContactForm: siteSettings.enableContactForm,
legalPublisher: siteSettings.legalPublisher,
legalDirector: siteSettings.legalDirector,
legalHostingProvider: siteSettings.legalHostingProvider,
footerExtraLine: siteSettings.footerExtraLine,
maintenanceMode: siteSettings.maintenanceMode,
maintenanceMessage: siteSettings.maintenanceMessage,
```

- [ ] **Step 3: Étendre updateGlobal seo-defaults**

```ts
await payload.updateGlobal({
  slug: 'seo-defaults',
  data: {
    defaultTitle: seoDefaults.defaultTitle,
    defaultDescription: seoDefaults.defaultDescription,
    titleTemplate: seoDefaults.titleTemplate,
    keywords: seoDefaults.keywords,
    ogLocale: seoDefaults.ogLocale,
    ogSiteName: seoDefaults.ogSiteName,
    twitterCard: seoDefaults.twitterCard,
    twitterSite: seoDefaults.twitterSite,
    twitterCreator: seoDefaults.twitterCreator,
    noindexSite: seoDefaults.noindexSite,
    robotsIndex: seoDefaults.robotsIndex,
    robotsFollow: seoDefaults.robotsFollow,
    googleSiteVerification: seoDefaults.googleSiteVerification,
    canonicalBaseUrl: seoDefaults.canonicalBaseUrl,
    enablePersonJsonLd: seoDefaults.enablePersonJsonLd,
    enableWebsiteJsonLd: seoDefaults.enableWebsiteJsonLd,
    schemaAuthorName: seoDefaults.schemaAuthorName,
  },
})
```

- [ ] **Step 4: Run seed local**

```bash
pnpm seed:portfolio
```

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-portfolio.ts tests/int/payload-collections.int.spec.ts
git commit -m "fix(seed): peupler tous les champs site-settings et seo-defaults"
```

---

### Task 5: Gate finale + version

**Files:**
- Modify: `src/lib/site-version.ts`

- [ ] **Step 1: Bump version**

```ts
export const SITE_VERSION = '0.17.1'
```

- [ ] **Step 2: Run gate**

```bash
pnpm verify
```

Expected: lint OK, typecheck OK, 78+ tests PASS, build OK

- [ ] **Step 3: Commit + push branche**

```bash
git add src/lib/site-version.ts
git commit -m "chore: bump SITE_VERSION 0.17.1 — refonte admin Payload"
git push -u origin cursor/fix-payload-dashboard-ecc9
```

- [ ] **Step 4: PR vers main (draft)**

Titre : `fix(admin): refonte dashboard Payload — doublons & globals`

---

## Self-Review (checklist plan)

| Exigence utilisateur | Task |
|---|---|
| Doublons containers dashboard | Task 1 + Task 2 |
| Globals / SEO sans paramètres visibles | Task 0 diagnostic + Task 3 collapsible + Task 4 seed |
| Refonte complète design dashboard | Task 1 widget + Task 2 CSS |
| Mobile-first responsive | Task 2 media queries + Task 3 collapsible |
| Production requise ? | Documenté : **non** (Global Constraints) |
| Pas de placeholders | Code complet fourni par step |
| Types cohérents | `WidgetServerProps`, `fieldNames` helper mis à jour |

**Écarts spec initiale (v0.17.0) :** on **abandonne tabs** au profit de collapsible — décision technique pour fiabilité UI. Les champs SEO/site restent identiques côté front (`seo-metadata.ts` inchangé).

---

## Exécution

Plan enregistré dans `docs/superpowers/plans/2026-07-24-payload-dashboard-refonte.md`.

**Deux options d’exécution :**

**1. Subagent-Driven (recommandé)** — un subagent frais par task, revue entre chaque task

**2. Inline Execution** — enchaîner les tasks dans cette session avec checkpoints

**Quelle approche ?**
