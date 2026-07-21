# Roadmap upgrade — Modern Portfolio

> Audit transversal du site (UI/UX · QoL · SEO · sécurité · design · code) — **v0.5.1** · juillet 2026  
> Contexte : Next.js 16 + Payload 3 + Neon + Vercel · mode démo + prod CMS

---

## Synthèse exécutive

| Zone | Note | Verdict |
|---|---|---|
| **Fonctionnel / prod** | 🔴 | **Bloquant** : toutes les pages publiques renvoient HTTP 500 (logo `next/image`) |
| **Architecture code** | 🟢 | Solide : CMS-first, Local API, Server Components, tokens, verify gate |
| **Design system** | 🟢 | Cohérent, documenté (`DESIGN.md`), dark-first glassmorphism |
| **SEO technique** | 🟡 | Bonnes bases (metadata, sitemap, JSON-LD) — incomplet + site injoignable |
| **Accessibilité / UX** | 🟡 | Bases OK (labels, reduced motion) — lacunes navigation clavier |
| **Sécurité** | 🟡 | Headers + access Payload OK — rate-limit et anti-spam à renforcer |
| **Tests / CI** | 🟠 | Vitest partiel, E2E minimal, pas de pipeline GitHub Actions |

**Priorité immédiate** : corriger le crash front (P0), puis sécuriser le contact et compléter l’accessibilité avant toute nouvelle feature.

---

## Méthodologie

- Lecture statique du code (`src/`, config, collections, middleware)
- Confrontation avec `docs/DEVELOPMENT.md`, `docs/DESIGN.md`, plan produit U1–U8
- Test runtime local : `pnpm dev` + `curl` → confirmation HTTP 500 sur `/`
- `pnpm verify` : échec sur `api.int.spec.ts` sans `PAYLOAD_SECRET` (autres suites OK)

---

## 1. UI / UX / QoL

### ✅ Points forts

- Navigation dual **Sidebar desktop / BottomTabBar mobile** — `aria-current`, labels explicites
- **Command palette** (⌘K) pour power users
- **BootSequence** skippable + `sessionStorage` + `prefers-reduced-motion`
- Effets riches (**mesh, glow, curseur custom**) limités à `(pointer: fine)` + reduced motion
- Formulaire contact : labels, `autoComplete`, feedback **toast** (Sonner)
- Filtres stack sur `/projets`, preview hover, masonry, navigation prev/next sur détail projet
- Easter egg logo (5 clics) — touche personality sans bloquer l’usage

### 🔴 Bloquants

| ID | Problème | Impact | Fichiers |
|---|---|---|---|
| UX-P0-01 | HTTP 500 sur **toutes** les pages publiques | Site inutilisable | `BrandLogo.tsx`, `next.config.ts` |
| UX-P0-01a | Même bug pour `/brand/favicon.png` dans metadata layout | Favicon cassé en prod strict | `layout.tsx`, `next.config.ts` |

**Cause** : `next/image` sur `/brand/favicon.png` alors que `images.localPatterns` n’autorise que `/api/media/file/**`.

**Fix** : ajouter `{ pathname: '/brand/**' }` et `{ pathname: '/images/**' }` (portrait statique) — ou migrer vers `<img>` / champ CMS `avatar`.

### 🟡 Améliorations QoL (priorité haute)

| ID | Problème | Recommandation |
|---|---|---|
| UX-01 | Pas de **skip link** → `#main` | Lien visually-hidden en tête de `<body>` |
| UX-02 | `<main>` sans `id="main"` | Ajouter dans `layout.tsx` |
| UX-03 | **Command palette** sans rôle dialog ni focus trap | `role="dialog"`, `aria-modal`, piégeage Tab, retour focus au trigger |
| UX-04 | Bouton ⌘K **masqué sur mobile** | Raccourci ou FAB search accessible |
| UX-05 | **Touch targets** tab bar ~36px (`py-2` + texte 11px) | Viser ≥ 44px (DEVELOPMENT.md 🎯) |
| UX-06 | Variante **primary** du `Button` sans `focus-visible:ring` | Aligner sur ghost/glass |
| UX-07 | **Curseur custom** masque le curseur natif | Option « effets réduits » ou respect `prefers-reduced-motion` pour curseur |
| UX-08 | `Header.tsx` **jamais monté** (code mort) | Supprimer ou réintégrer si besoin desktop textuel |
| UX-09 | Portrait **hardcodé** `/images/bertrand-portrait.jpg` | Utiliser `SiteSettings.avatar` (champ déjà présent) |
| UX-10 | **Copy éditorial en dur** sur `/` et `/a-propos` | Violation CMS-first (R1) — globals ou champs dédiés |
| UX-11 | Eyebrow **« Work »** (EN) sur page FR `/projets` | Uniformiser FR ou i18n explicite |
| UX-12 | Contact : pas de **try/catch** sur Payload/Resend | Message d’erreur utilisateur + log serveur |
| UX-13 | Pas d’état **loading skeleton** sur pages lentes | Suspense boundaries sur grilles projets |

### 🟢 Nice-to-have (post-stabilisation)

- Live Preview Payload (drafts)
- Téléchargement CV (`SiteSettings.cv` — champ existant, non branché front)
- Filtres projets persistés en URL (`?stack=nextjs`)
- Mode « reduced effects » toggle (localStorage)
- Page 404 custom brandée

---

## 2. SEO

### ✅ En place

- `generateMetadata` sur toutes les pages publiques
- `metadataBase` via `getSiteUrl()`
- `sitemap.ts` dynamique (projets inclus)
- `robots.ts` (disallow `/admin`, `/api`)
- JSON-LD : `Person`, `WebSite`, `CreativeWork`, `ItemList`
- OG/Twitter sur home + projets détail
- ISR `revalidate = 3600` + hooks `revalidatePath`
- `@vercel/analytics` + `@vercel/speed-insights`
- Global **SEO Defaults** éditable (title, description, ogImage)

### 🟡 Lacunes

| ID | Problème | Recommandation | Priorité |
|---|---|---|---|
| SEO-01 | Site en 500 → **aucun crawl utile** | Fix P0 | P0 |
| SEO-02 | Pas d’URL **canonical** par page | `alternates: { canonical }` dans metadata | P1 |
| SEO-03 | Pas de **title template** (`%s — Site`) | Éviter titres redondants / courts | P2 |
| SEO-04 | JSON-LD projet utilise `liveUrl` au lieu de l’URL page portfolio | `url: ${siteUrl}/projets/${slug}` | P2 |
| SEO-05 | Pas de **BreadcrumbList** sur détail projet | Schéma fil d’Ariane | P3 |
| SEO-06 | `/a-propos`, `/contact` : OG image absente | Fallback `seo.ogImage` | P2 |
| SEO-07 | **Lighthouse ≥ 95** non vérifié (README ⏳) | Audit CI ou manuel post-fix P0 | P1 |
| SEO-08 | Portrait / images locales hors CMS | Alt OK mais pas éditable — impact fraîcheur contenu | P2 |
| SEO-09 | Pas de `lastModified` dans sitemap | Enrichir depuis `updatedAt` Payload | P3 |

### 🔵 Hors scope MVP (documenté)

- Multi-langue / `hreflang`
- Blog + RSS
- Indexation selective (noindex brouillons — déjà filtrés côté API)

---

## 3. Sécurité

### ✅ En place

- `.env` gitignoré + `.env.example` sans secrets
- Access control Payload : projets `published` publics, users/submissions admin-only
- Users : `maxLoginAttempts`, `lockTime`, pas d’inscription publique
- Headers : `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, **CSP**
- Honeypot contact (`website` field)
- Validation **Zod** serveur
- JSON-LD seul usage de `dangerouslySetInnerHTML`

### 🟡 Risques / dettes

| ID | Problème | Sévérité | Recommandation |
|---|---|---|---|
| SEC-01 | Rate-limit middleware sur **`/api/contact`** — le contact passe par **Server Action**, pas cette route | Moyen | Rate-limit via middleware sur Server Actions ou `@upstash/ratelimit` dans `submitContact` |
| SEC-02 | Rate-limit **in-memory** (`Map`) | Moyen | Inefficace en serverless multi-instance → Redis/Upstash/Vercel KV |
| SEC-03 | `FormSubmissions` : `create: () => true` | Moyen | Spam massif possible — honeypot + rate-limit + quota |
| SEC-04 | CSP : `'unsafe-inline'` + **`'unsafe-eval'`** | Moyen | Durcir progressivement ; nonce/hash scripts si faisable |
| SEC-05 | Pas de **HSTS** explicite | Faible | `Strict-Transport-Security` en prod (Vercel) |
| SEC-06 | Pas de **Turnstile / hCaptcha** | Faible | Post-MVP si spam réel (plan produit) |
| SEC-07 | Scan secrets CI **⏸️ reporté** | Faible | `gitleaks` ou GitHub secret scanning |
| SEC-08 | `PAYLOAD_SECRET \|\| ''` dans config | Faible | Fail fast si secret absent en prod |
| SEC-09 | GraphQL playground exposé `/api/graphql-playground` | Info | Restreindre en prod si non utilisé |

### Contact — flux actuel

```
Client → Server Action submitContact → Zod → honeypot → Payload create → Resend (opt.)
```

Le middleware actuel ne protège **pas** ce flux.

---

## 4. Design

### ✅ Points forts

- Tokens centralisés `styles.css` + check `pnpm check:tokens`
- Règle 60-30-10 respectée (dark + accent orange)
- Composants primitifs cohérents (`Button`, `GlassCard`, `Badge`, `SectionTitle`, `EditorialTitle`)
- Typographie triple (Syne / DM Sans / Space Grotesk) via `next/font`
- Glassmorphism, gradients accent, scrollbar custom
- Motion progressive : desktop only pour effets lourds

### 🟡 Écarts design / produit

| ID | Écart | Action |
|---|---|---|
| DES-01 | Portrait et favicon **hors CMS** alors que `avatar` existe | Brancher CMS + fallback démo |
| DES-02 | Copy longue `/a-propos` en dur (2 paragraphes dont 1 CMS + 1 hardcodé) | Champ `aboutBody` richText global |
| DES-03 | Sections home (« En chiffres », CTA final) en dur | Global `HomeSections` ou champs SiteSettings |
| DES-04 | `Header` vs `Sidebar` — spec AE3 mentionnait header desktop | Décision : garder sidebar (OK) + nettoyer dead code |
| DES-05 | Contraste `--muted` (#8a8580) sur fond #0a0a0a | Audit WCAG AA formel (🎯 `tests/a11y.spec.ts`) |
| DES-06 | `FadeInWhenVisible` : `initial opacity: 1` (OK contenu visible) | Bon pattern — documenter comme référence |

---

## 5. Qualité du code

### ✅ Points forts

- Séparation claire : `content.ts` · collections · composants · lib
- TypeScript strict + types Payload générés
- ADR documentés (Local API, mode démo)
- `pnpm verify` = lint + typecheck + tests + tokens + build
- Revalidation ciblée post-publish
- Mode démo robuste (`portfolio-fallback.ts`)

### 🟡 Dettes techniques

| ID | Dette | Impact | Action |
|---|---|---|---|
| CODE-01 | **HTTP 500** front | Critique | Fix `localPatterns` |
| CODE-02 | `api.int.spec.ts` **fail** sans env local | CI fragile | Skip conditionnel ou env test CI |
| CODE-03 | E2E : **2 tests** smoke only | Régressions non détectées | Scénarios contact, navigation, 404, admin login |
| CODE-04 | Pas de **GitHub Actions** | Pas de gate automatique PR | Workflow `pnpm verify` |
| CODE-05 | `STACK_LABELS` **dupliqué** | Maintenance | Extraire `lib/stack-labels.ts` |
| CODE-06 | `Header.tsx` unused | Bruit | Supprimer |
| CODE-07 | `importMap.js` stale (rich-text admin) | Admin UX | `pnpm generate:importmap` en postinstall ou doc |
| CODE-08 | Pas de tests a11y automatisés | Régression a11y | `@axe-core/playwright` |
| CODE-09 | `submitContact` sans try/catch | UX erreur 500 opaque | Pattern DEVELOPMENT.md 🎯 |
| CODE-10 | Globals `read: () => true` | Exposition email/settings | Acceptable portfolio ; documenter |

### Métriques actuelles (local)

| Commande | Résultat |
|---|---|
| `pnpm lint` | ✅ |
| `pnpm typecheck` | ✅ |
| `pnpm test:int` | ⚠️ 11 pass, 1 suite fail (Payload secret) |
| `pnpm check:tokens` | ✅ |
| `pnpm build` | Non exécuté (bloqué par test:int) |
| Pages publiques HTTP | 🔴 500 |

---

## 6. Roadmap priorisée

Légende : **P0** bloquant · **P1** avant prod sereine · **P2** qualité · **P3** polish · **P4** évolutions

### Phase 0 — Hotfix prod (P0) · 1 PR

| # | Tâche | Effort | DoD |
|---|---|---|---|
| 0.1 | Fix `images.localPatterns` (`/brand/**`, `/images/**`) | S | `/`, `/projets`, `/a-propos`, `/contact` → 200 |
| 0.2 | Smoke E2E : homepage + navigation | S | `pnpm test:e2e` vert |
| 0.3 | Bump `SITE_VERSION` → 0.5.2 | XS | Footer à jour |

### Phase 1 — Stabilisation & accessibilité (P1) · 2–3 PR

| # | Tâche | Effort | DoD |
|---|---|---|---|
| 1.1 | Skip link + `<main id="main">` | S | Tab depuis load → skip → contenu |
| 1.2 | Focus trap + ARIA command palette | M | Escape ferme, Tab cyclique |
| 1.3 | Touch targets tab bar ≥ 44px | S | Audit mobile 390px |
| 1.4 | Focus ring bouton primary | XS | Clavier visible |
| 1.5 | try/catch `submitContact` + messages erreur | S | Resend down → toast erreur |
| 1.6 | Rate-limit contact **Server Action** (Upstash ou in-action IP) | M | 429 après N envois |
| 1.7 | CI GitHub Actions `pnpm verify` | M | PR gate |
| 1.8 | Fix `api.int.spec.ts` (env CI ou skip) | S | verify vert sans DB locale |

### Phase 2 — CMS-first complet (P1–P2) · 2 PR

| # | Tâche | Effort | DoD |
|---|---|---|---|
| 2.1 | Brancher `SiteSettings.avatar` dans Hero + À propos | M | Image éditable admin |
| 2.2 | Global ou champs pour copy home (stats, CTA) | M | Zéro copy marketing en dur |
| 2.3 | Champ `aboutBody` (richText) remplace paragraphe hardcodé | M | `/a-propos` 100 % CMS |
| 2.4 | Brancher `SiteSettings.cv` (lien téléchargement) | S | PDF depuis admin |
| 2.5 | Supprimer `Header.tsx` ou documenter | XS | Pas de dead code |

### Phase 3 — SEO & performance (P2) · 1–2 PR

| # | Tâche | Effort | DoD |
|---|---|---|---|
| 3.1 | Canonical URLs toutes pages | S | metadata alternates |
| 3.2 | Title template + OG fallback pages secondaires | S | Partage social cohérent |
| 3.3 | Corriger JSON-LD projet (URL page) | XS | Rich results valides |
| 3.4 | Audit Lighthouse (mobile + desktop) | M | Score ≥ 95 ou plan d’action |
| 3.5 | `lastModified` sitemap projets | S | Sitemap enrichi |

### Phase 4 — Sécurité durcie (P2) · 1 PR

| # | Tâche | Effort | DoD |
|---|---|---|---|
| 4.1 | Rate-limit distribué (Upstash/Vercel KV) login + contact | M | Multi-instance OK |
| 4.2 | CSP : retirer `unsafe-eval` si possible | M | Admin + front OK |
| 4.3 | HSTS header prod | XS | securityheaders.com A |
| 4.4 | Fail fast `PAYLOAD_SECRET` prod | XS | Build/deploy refuse misconfig |
| 4.5 | (Optionnel) Cloudflare Turnstile si spam | M | Feature flag env |

### Phase 5 — Tests & QoL (P2–P3) · 2 PR

| # | Tâche | Effort | DoD |
|---|---|---|---|
| 5.1 | E2E : formulaire contact (mock Resend) | M | Happy path + validation |
| 5.2 | Tests a11y axe Playwright | M | 0 violations critiques |
| 5.3 | Extraire `STACK_LABELS` partagé | XS | DRY |
| 5.4 | Filtres projets en query string | M | URL partageable |
| 5.5 | Page 404 custom | S | Navigation retour |
| 5.6 | BreadcrumbList JSON-LD | S | Détail projet |

### Phase 6 — Évolutions post-MVP (P4) · backlog

| # | Feature | Réf. plan |
|---|---|---|
| 6.1 | Live Preview Payload (drafts) | README ⏳ |
| 6.2 | Domaine custom + prod env Vercel | README 🔶 |
| 6.3 | Blog (`Posts`) + RSS | Plan — deferred |
| 6.4 | Multi-langue | Plan — deferred |
| 6.5 | Mode clair | Plan — deferred |
| 6.6 | Newsletter / stats vues | Plan — deferred |
| 6.7 | Scan secrets CI (gitleaks) | DEVELOPMENT.md ⏸️ |

---

## 7. Matrice effort / impact

```
Impact ↑
  │  P0 localPatterns     P1 skip link + contact err
  │  P1 rate-limit SA      P2 CMS avatar/copy
  │  P2 canonical SEO      P3 breadcrumbs
  └──────────────────────────────────→ Effort
        faible                    moyen
```

**Ordre recommandé** : Phase 0 → 1.5–1.6 → 1.1–1.4 → 2.1–2.3 → 3.1–3.4 → reste.

---

## 8. Definition of Done — release « prod ready »

- [ ] Toutes pages publiques HTTP 200 (demo + CMS)
- [ ] `pnpm verify` vert en CI
- [ ] Lighthouse mobile ≥ 90 (cible 95)
- [ ] Skip link + focus clavier OK
- [ ] Contact : validation, honeypot, rate-limit, erreurs gracieuses
- [ ] 100 % copy éditorial via Payload (R1)
- [ ] Canonical + OG sur toutes pages
- [ ] Variables Vercel prod configurées (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`)
- [ ] `SITE_VERSION` bumpé

---

## 9. Références

| Doc | Rôle |
|---|---|
| `docs/DEVELOPMENT.md` | DoD, statuts 🎯 |
| `docs/DESIGN.md` | Tokens & composants |
| `docs/plans/2026-07-20-001-feat-modern-portfolio-cms-plan.md` | Contrat produit R1–R11 |
| `AGENTS.md` | Bug connu localPatterns |
| `README.md` | Roadmap MVP état |

---

*Généré par audit cloud agent — à mettre à jour après chaque phase livrée.*
