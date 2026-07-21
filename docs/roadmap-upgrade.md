# Audit & Roadmap Upgrade — Modern Portfolio

> Audit du site au 2026-07-21 · Stack : Next.js 16 + Payload 3 + Neon + Vercel · Version affichée : `0.5.1`  
> Document vivant. Ne remplace pas `docs/plans/` (référence produit U1–U8) ni `docs/brainstorms/`.

---

## Synthèse exécutive

Le portfolio est **solide sur l’architecture CMS** (Local API, mode démo, ISR, access control published) et **cohérent visuelle­ment** (dark-first, tokens, typo Syne / DM Sans / Space Grotesk). Les bases SEO, headers sécurité et gate `pnpm verify` sont en place.

Les écarts majeurs à traiter en priorité :

| Priorité | Écart | Impact |
|---|---|---|
| P0 | `images.localPatterns` n’autorise pas `/brand/**` ni `/images/**` → **HTTP 500** sur toutes les pages publiques | Site inaccessible en prod/dev |
| P0 | Rate-limit contact sur `/api/contact` alors que le formulaire est une **Server Action** | Anti-abus ineffectif |
| P0 | `form-submissions` : `create: () => true` + Media `read: () => true` sans garde-fous REST | Spam / abus API |
| P1 | Copy marketing encore en dur (`a-propos`, titres de sections home) | Violation CMS-first |
| P1 | A11y incomplète (skip link, `#main`, focus trap Cmd+K, touch targets) | UX / conformité |
| P2 | SEO : pas de `title.template`, pas de `canonical`, JSON-LD détail projet pointe parfois vers `liveUrl` | Discoverabilité |
| P2 | CSP avec `'unsafe-eval'` / `'unsafe-inline'` | Surface XSS |
| P3 | Blog, i18n, mode clair, Lighthouse ≥ 95 formalisé | Évolutions produit |

**Verdict global :** ~7/10 architecture · ~6/10 UX-a11y · ~6.5/10 SEO · ~5.5/10 sécurité runtime · ~7.5/10 design system · ~7/10 qualité code.

---

## 1. Audit UI / UX / QoL

### Points forts

- Navigation claire : Sidebar desktop 72px + BottomTabBar mobile 4 onglets.
- Hero brand-first (`EditorialTitle` = nom du site), CTA doubles, portrait desktop full-bleed (clip-path).
- Motion maîtrisé : `prefers-reduced-motion`, effets fun limités au desktop (`FunEffects`), BootSequence skippable + sessionStorage.
- Command palette (Cmd+K) utile pour power users.
- Feedback contact via Sonner ; états `pending` sur le submit.
- Design system documenté (`docs/DESIGN.md`) + tokens CSS + `pnpm check:tokens`.

### Lacunes UI / UX

| ID | Constat | Fichiers | Gravité |
|---|---|---|---|
| UX-01 | Pas de **skip link** ni `<main id="main">` (déjà 🎯 dans DEVELOPMENT) | `layout.tsx` | Haute |
| UX-02 | **CommandPalette** : pas de focus trap, pas de flèches clavier, bouton Cmd+K sans `aria-expanded` | `CommandPalette.tsx` | Haute |
| UX-03 | Touch targets BottomTabBar ~ py-2 + text 11px — risque < 44px | `BottomTabBar.tsx` | Moyenne |
| UX-04 | Bouton `primary` : le `focus-visible` est sur le shell interne peu visible ; PrimaryLink sans ring | `Button.tsx` | Moyenne |
| UX-05 | Hero mobile : portrait **sous** le texte (pas full-bleed) — rupture de composition vs desktop | `Hero.tsx` | Moyenne |
| UX-06 | Copy hardcodée en UI (« En chiffres », « Travaillons ensemble », bio à-propos) | `page.tsx`, `a-propos` | Moyenne |
| UX-07 | Header sticky desktop existe mais **non monté** dans le layout (Sidebar seule) — code mort / confusion | `Header.tsx` | Basse |
| UX-08 | Liens sociaux Sidebar : `h-9 w-9` < 44px | `Sidebar.tsx` | Basse |
| UX-09 | Formulaire contact : pas d’`aria-invalid` / messages inline liés aux champs (toast seul) | `ContactForm.tsx` | Moyenne |
| UX-10 | Pas de page 404 / error boundary frontend custom documentée | `app/(frontend)` | Basse |
| UX-11 | BootSequence ~900ms max — OK, mais flash contenu possible avant hydration | `BootSequence.tsx` | Basse |

### QoL éditeur / ops

- Import map Lexical admin parfois stale → rich-text cassé (déjà noté AGENTS.md).
- Seed + `generate:types` documentés ; preview projet via `getSiteUrl()` OK.
- Pas de preview draft publique (Payload preview URL existe, auth draft absente).

---

## 2. Audit Design

### Points forts

- Identité claire : orange/noir, glass, règle 60-30-10.
- Typo expressive (Syne display) — pas de stack Inter/system par défaut.
- Surfaces glass + mesh/glow desktop sans surcharger le contenu critique.
- Composants primitives stables (`Button`, `GlassCard`, `SectionTitle`, `EditorialTitle`).

### Lacunes design

| ID | Constat | Gravité |
|---|---|---|
| DS-01 | Portrait hardcodé `/images/bertrand-portrait.jpg` — pas piloté CMS (Media / SiteSettings) | Haute |
| DS-02 | Hero desktop = split panel ; mobile = card inset — deux langages visuels | Moyenne |
| DS-03 | StatsStrip + marquee : risque de « dashboard feel » sur le premier scroll (hors hero strict) | Basse |
| DS-04 | Contraste `--muted` (#8a8580) sur `#0a0a0a` : borderline WCAG AA pour petits textes | Moyenne |
| DS-05 | Pas de mode clair (volontaire) — à documenter comme décision produit si demandé | Info |
| DS-06 | Glow / glass nombreux : surveiller fatigue visuelle et perf GPU mobile | Basse |

---

## 3. Audit SEO

### Points forts

- `generateMetadata` sur pages clés + OG/Twitter.
- `sitemap.ts` (statique + projets) + `robots.ts` (disallow `/admin`, `/api`).
- JSON-LD Person / WebSite / CreativeWork / ItemList.
- `metadataBase` via `getSiteUrl()`, ISR `revalidate = 3600`, Analytics + Speed Insights.
- `alt` obligatoire sur Media.

### Lacunes SEO

| ID | Constat | Gravité |
|---|---|---|
| SEO-01 | Pas de `title.template` (`%s \| SiteName`) → titres incohérents (« À propos » seul) | Moyenne |
| SEO-02 | Pas de `alternates.canonical` | Moyenne |
| SEO-03 | JSON-LD projet : `url: project.liveUrl` au lieu de l’URL canonique du site | Haute |
| SEO-04 | OG image absente si pas de média SEODefaults (fallback manquant) | Moyenne |
| SEO-05 | Sitemap sans `lastModified` | Basse |
| SEO-06 | Pas de `manifest.webmanifest` / PWA légère (optionnel) | Basse |
| SEO-07 | Portrait & images locales non listées dans `images.localPatterns` → casse le rendu (et donc le crawl) | Critique |
| SEO-08 | Lighthouse ≥ 95 non mesuré en CI | Moyenne |
| SEO-09 | Pas de breadcrumb JSON-LD sur `/projets/[slug]` | Basse |

---

## 4. Audit Sécurité

### Points forts

- Secrets hors repo (`.env.example` placeholders).
- Access Users strict (pas d’inscription publique) + lockout Payload (`maxLoginAttempts`).
- Projects : lecture publique filtrée `published`.
- Headers : `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, CSP de base.
- Contact : Zod + honeypot.
- `dangerouslySetInnerHTML` limité au JSON-LD.

### Lacunes sécurité

| ID | Constat | Gravité |
|---|---|---|
| SEC-01 | Middleware rate-limit sur `/api/contact` **mais** submit = Server Action (`contact/actions.ts`) → **bypass** | Critique |
| SEC-02 | Rate-limit en mémoire (`Map`) : inefficace en multi-instance Vercel | Haute |
| SEC-03 | `form-submissions.create: () => true` → spam via REST `/api/form-submissions` | Haute |
| SEC-04 | `submitContact` : pas de `try/catch` Resend/Payload → 500 opaque, partial writes possibles | Haute |
| SEC-05 | CSP : `'unsafe-eval'` + `'unsafe-inline'` (🎯 DEVELOPMENT) | Haute |
| SEC-06 | Media : `read: () => true` ; create/update/delete non explicites — durcir et limiter MIME déjà partiel | Moyenne |
| SEC-07 | Pas de `Strict-Transport-Security` (souvent géré Vercel, à confirmer) | Basse |
| SEC-08 | Pas de scan secrets CI (⏸️) | Moyenne |
| SEC-09 | Honeypot seul — pas de Turnstile/hCaptcha optionnel | Moyenne |
| SEC-10 | GraphQL playground route présente — s’assurer désactivée en prod | Moyenne |

---

## 5. Audit Qualité du code

### Points forts

- Architecture claire : `content.ts` unique, mode démo (`isPayloadConfigured`), ADR documentés.
- Server Components par défaut ; client limité motion/forms/nav.
- Gate unifiée `pnpm verify` (lint, tsc, vitest, tokens, build).
- Tests unitaires ciblés (schema contact, ProjectCard, BottomTabBar, slugify, media).
- Hooks `revalidatePath` après change collections/globals.
- Scope discipliné (pas de lib UI lourde).

### Lacunes qualité

| ID | Constat | Gravité |
|---|---|---|
| CODE-01 | Bug image Next : `BrandLogo` + Hero/About utilisent `/brand/**` et `/images/**` hors `localPatterns` | Critique |
| CODE-02 | Copy CMS-first violée (paragraphe bio hardcodé, labels sections) | Haute |
| CODE-03 | `Header.tsx` inutilisé dans le layout | Basse |
| CODE-04 | E2E Playwright minimal (2 smoke) — pas à jour contenu réel / a11y | Moyenne |
| CODE-05 | Pas de tests a11y automatisés (`tests/a11y.spec.ts` 🎯) | Moyenne |
| CODE-06 | Duplication NAV links (Sidebar, BottomTabBar, Header, CommandPalette) | Basse |
| CODE-07 | `contactSchema` honeypot : `max(0)` vs check `website` truthy — OK mais documenter | Info |
| CODE-08 | Import map Payload régénéré hors commit → drift admin | Moyenne |
| CODE-09 | remotePatterns images liés à des hosts Vercel de projets — à synchroniser avec le CMS | Basse |

---

## 6. Roadmap priorisée

Légende effort : **S** (petit, 1 PR) · **M** (quelques PR) · **L** (plusieurs livraisons).  
Une PR = un objectif (règle projet).

### Phase 0 — Stabilisation (bloquant)

| # | Livrable | Effort | Critères de done |
|---|---|---|---|
| 0.1 | Autoriser `/brand/**` et `/images/**` dans `images.localPatterns` (ou `<img>` logo) | S | Pages publiques HTTP 200 |
| 0.2 | Rate-limit Server Action contact (token bucket / Upstash / IP via headers dans l’action) + aligner matcher middleware | M | 429 après N submits ; REST aussi protégé |
| 0.3 | Restreindre `form-submissions` create (Server Action only / secret / auth custom) | S | POST anonyme REST rejeté |
| 0.4 | `try/catch` + messages user-safe sur `submitContact` | S | Pas de 500 non géré ; toast erreur |

### Phase 1 — Fondations a11y & CMS-first

| # | Livrable | Effort | Critères de done |
|---|---|---|---|
| 1.1 | Skip link + `<main id="main">` | S | Tab 1er focus = skip ; jump OK |
| 1.2 | Focus trap + navigation clavier CommandPalette | M | Escape, flèches, focus restored |
| 1.3 | Touch targets ≥ 44px (tab bar, sociaux) | S | Mesure 390px |
| 1.4 | Migrer copy hardcodée vers SiteSettings / global « HomeSections » | M | Zéro paragraphe marketing en dur |
| 1.5 | Portrait & brand image via Media (SiteSettings) | M | Changement sans redeploy |
| 1.6 | Focus ring cohérent sur Button primary | S | Visible clavier |

### Phase 2 — SEO & perf

| # | Livrable | Effort | Critères de done |
|---|---|---|---|
| 2.1 | `metadata.title.template` + canonicals | S | Titres homogènes |
| 2.2 | JSON-LD CreativeWork → URL page site ; BreadcrumbList | S | Rich results valides |
| 2.3 | OG fallback (image défaut brand) | S | OG toujours présent |
| 2.4 | `lastModified` sitemap | S | Sitemap enrichi |
| 2.5 | Audit Lighthouse (lab) + budget CI optionnel | M | Scores documentés ≥ 95 cible |
| 2.6 | Réduire JS motion mobile (déjà partiel) — audit bundle | M | LCP / TBT améliorés |

### Phase 3 — Sécurité renforcée

| # | Livrable | Effort | Critères de done |
|---|---|---|---|
| 3.1 | CSP sans `unsafe-eval` (nonces / strict-dynamic si possible) | L | Headers durcis ; admin Payload OK |
| 3.2 | Rate-limit distribué (Upstash Redis ou Vercel KV) | M | Multi-instance |
| 3.3 | Option Turnstile sur contact | M | Bots bloqués |
| 3.4 | Scan secrets CI + revue access Media write | S | Pipeline vert |
| 3.5 | Confirmer GraphQL playground off en prod | S | Route 404/401 prod |

### Phase 4 — Qualité & DX

| # | Livrable | Effort | Critères de done |
|---|---|---|---|
| 4.1 | E2E frontend à jour (nav, projet, contact honeypot) | M | `pnpm test:e2e` stable |
| 4.2 | `tests/a11y.spec.ts` (axe-core) pages publiques | M | 0 violation critique |
| 4.3 | Constantes NAV partagées | S | Une source de vérité |
| 4.4 | Commit `importMap` régénéré ou script postinstall | S | Admin rich-text OK fresh clone |
| 4.5 | Error / not-found UI brandée | S | Parcours erreur soigné |
| 4.6 | Supprimer ou réintégrer `Header.tsx` | S | Pas de code mort |

### Phase 5 — Produit (hors MVP actuel)

| # | Livrable | Notes |
|---|---|---|
| 5.1 | Blog / articles (Payload collection) | Reporté brainstorm §20 |
| 5.2 | Preview draft authentifiée | Édition confort |
| 5.3 | i18n FR/EN | Hors scope v1 |
| 5.4 | Mode clair | Décision produit explicite requise |
| 5.5 | Newsletter | Reporté |
| 5.6 | Filtres projets plus riches / tags CMS | QoL portfolio |

---

## 7. Séquençage recommandé (PRs)

```text
PR-A  fix(images): localPatterns brand + images          ← Phase 0.1
PR-B  fix(security): contact rate-limit + try/catch      ← 0.2–0.4
PR-C  feat(a11y): skip-link main + palette trap          ← 1.1–1.2
PR-D  refactor(cms): home/about copy + portrait Media    ← 1.4–1.5
PR-E  feat(seo): title template canonicals json-ld       ← 2.1–2.4
PR-F  chore(tests): e2e + a11y axe                       ← 4.1–4.2
PR-G  security(csp): tighten CSP (après mesure)          ← 3.1
```

Bump `SITE_VERSION` à chaque livraison notable (semver patch/minor).

---

## 8. Métriques de succès

| Métrique | Cible |
|---|---|
| Pages publiques | 200, Lighthouse Perf/A11y/Best/SEO ≥ 95 |
| Contact | Zod + honeypot + rate-limit effectif + 0 500 non catch |
| CMS-first | 0 copy marketing dans `app/(frontend)/**/*.tsx` (hors labels UI techniques) |
| A11y | Skip link, focus visible, axe 0 critical |
| Sécurité | CSP sans eval ; create form-submissions non public ; secrets scannés |
| Qualité | `pnpm verify` + e2e smoke vert en CI |

---

## 9. Hors scope explicite (inchangé)

- Multi-langue, e-commerce, auth visiteurs
- Remplacement de Payload / migration CMS
- Refonte visuelle totale (conserver dark-first orange/noir)
- Réécriture de `docs/plans/` — ce document est une **roadmap d’upgrade post-MVP**

---

## 10. Références

| Doc | Rôle |
|---|---|
| `docs/DEVELOPMENT.md` | DoD, cibles 🎯 déjà listées |
| `docs/DESIGN.md` | Tokens & composants |
| `docs/plans/2026-07-20-001-feat-modern-portfolio-cms-plan.md` | Plan MVP |
| `docs/brainstorms/2026-07-20-modern-portfolio-roadmap.md` | Vision produit |
| `AGENTS.md` | Contraintes agents + bugs connus env |

---

*Audit réalisé sur le codebase `main` (sans exécution Lighthouse live). Mettre à jour ce fichier après chaque phase cochée.*
