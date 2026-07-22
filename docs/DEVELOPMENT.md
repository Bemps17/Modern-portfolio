# Guide de développement

> Référence technique courte. Agents : `AGENTS.md` · Design : `docs/DESIGN.md` · Produit : `docs/plans/`

**Légende statuts :** ✅ implémenté · 🎯 cible · ⏸️ reporté / hors scope

---

## TL;DR

1. Contenu éditorial **uniquement via Payload** (`src/lib/content.ts`)
2. Server Components par défaut · tokens CSS · pas de lib UI lourde
3. Avant merge : `pnpm verify`
4. Une PR = un objectif · branche `cursor/<nom>-c30f`
5. Bump `SITE_VERSION` (`src/lib/site-version.ts`) si livraison notable

---

## Principes

| # | Principe | Statut |
|---|---|---|
| P1 | CMS-first — zéro copy marketing en dur dans les pages | ✅ |
| P2 | Scope minimal — pas de refactor hors tâche | ✅ |
| P3 | Dark-first — tokens `styles.css`, voir `docs/DESIGN.md` | ✅ |
| P4 | Mobile-first — tester 390px avant merge | ✅ |
| P5 | Secrets hors repo | ✅ |
| P6 | Règles vérifiables via `pnpm verify` | ✅ |

---

## Stack & layout

```
src/app/(frontend)/   # Pages publiques
src/app/(payload)/    # Admin + API Payload
src/collections/      # Schémas CMS
src/components/       # layout · motion · sections · ui
src/lib/content.ts    # Couche données (CMS ou fallback)
```

| Règle | Statut |
|---|---|
| Local API Payload (pas de fetch interne `/api/projects`) | ✅ [ADR 001](decisions/001-local-api-over-rest.md) |
| `pnpm generate:types` après modif schéma | ✅ |
| Mode démo sans env (`portfolio-fallback.ts`) | ✅ [ADR 002](decisions/002-demo-mode-without-env.md) |

---

## UI & accessibilité

Détails tokens/composants : **`docs/DESIGN.md`**

| Règle | Statut |
|---|---|
| Tokens `var(--…)` — pas de hex inline | ✅ |
| Touch targets ≥ 44px (mobile) | 🎯 |
| `focus-visible` sur interactifs | ✅ |
| `prefers-reduced-motion` | ✅ |
| Effets fun desktop only (`FunEffects`) | ✅ |
| Skip link → `#main` | 🎯 |
| `<main id="main">` | 🎯 |
| Focus trap modales (`CommandPalette`) | 🎯 |
| Tests a11y automatisés | 🎯 |

---

## Qualité & tests

```bash
pnpm verify          # lint + typecheck + test:int + check:tokens + build
pnpm test:payload    # Batterie Payload (schéma, CRUD, peuplement depth, content.ts)
pnpm test:precommit  # Gate git pre-commit (= test:payload)
pnpm test:e2e        # Playwright (optionnel local)
```

| Règle | Statut |
|---|---|
| Vitest sur schémas/composants critiques | ✅ |
| Batterie Payload (globals, collections, depth/populate, content) | ✅ |
| Hook git `pre-commit` → `pnpm test:precommit` (`.githooks/`) | ✅ |
| E2E frontend à jour (contenu réel, pas template Payload) | 🎯 |
| Script `pnpm verify` unifié | ✅ |
| `pnpm check:tokens` (tokens orphelins) | ✅ |

### Pre-commit (obligatoire)

Après `pnpm install`, `prepare` active `core.hooksPath=.githooks`. Chaque `git commit` lance la batterie Payload (`pnpm test:precommit`). Bypass exceptionnel uniquement : `git commit --no-verify` (à justifier en revue).

Les specs Payload nécessitent Postgres + `DATABASE_URI` + `PAYLOAD_SECRET` (voir `.env.local`).

### Server Actions (pattern contact)

1. Zod côté serveur · 2. Honeypot · 3. `try/catch` Payload/Resend · 4. `{ ok, message }` · 5. Toast client

| Étape | Statut |
|---|---|
| Validation Zod | ✅ |
| Honeypot | ✅ |
| try/catch erreurs externes | 🎯 |
| Feedback utilisateur (toast) | ✅ |

---

## Sécurité

| Règle | Statut |
|---|---|
| `.env` gitignoré, placeholders dans `.env.example` | ✅ |
| Access control Payload (published public) | ✅ |
| Rate-limit login/contact (`middleware.ts`) | ✅ |
| Headers sécurité + CSP (`next.config.ts`) | ✅ |
| CSP sans `unsafe-eval` | 🎯 |
| Pas de `dangerouslySetInnerHTML` sauf JSON-LD | ✅ |
| Scan secrets en CI | ⏸️ |

---

## SEO & perf

| Règle | Statut |
|---|---|
| `generateMetadata` pages publiques | ✅ |
| JSON-LD (`src/lib/json-ld.tsx`) | ✅ |
| `getSiteUrl()` pour sitemap/robots | ✅ |
| `next/image` + ISR (`revalidate = 3600`) | ✅ |
| Vercel Analytics + Speed Insights | ✅ |
| Lighthouse ≥ 95 | 🎯 |

---

## Git & PR

- Commits : [Conventional Commits](https://www.conventionalcommits.org/)
- PR : quoi / pourquoi / comment tester + screenshots si UI
- How-to déploiement : [`docs/how-to/deploy-vercel.md`](how-to/deploy-vercel.md)
- How-to CMS : [`docs/how-to/cms.md`](how-to/cms.md)

---

## Definition of Done (merge)

### Toujours

- [ ] `pnpm verify` vert
- [ ] Pas de secret dans le diff
- [ ] Scope = une tâche

### Si UI

- [ ] Tokens `docs/DESIGN.md` · mobile 390px · focus clavier · reduced motion

### Si CMS / schéma

- [ ] `generate:types` · access control · revalidation routes

### Si Server Action

- [ ] Zod serveur · erreurs visibles · honeypot intact

### Si livraison notable

- [ ] `SITE_VERSION` incrémenté

---

## Anti-patterns

| ❌ | ✅ |
|---|---|
| Copy en dur dans une page | CMS / global |
| `fetch('/api/projects')` | `getPublishedProjects()` |
| Lib UI lourde | `components/ui/` |
| Hex inline | `var(--accent)` |
| `opacity: 0` sur contenu critique | Animation translate seule |
| PR fourre-tout | Une PR = un objectif |

---

## Liens

| Doc | Rôle |
|---|---|
| [`AGENTS.md`](../AGENTS.md) | Instructions agents |
| [`docs/DESIGN.md`](DESIGN.md) | Tokens & composants |
| [`docs/how-to/`](how-to/) | Guides procéduraux |
| [`docs/decisions/`](decisions/) | ADR (pourquoi) |
| [`README.md`](../README.md) | Setup & roadmap |
| [`docs/plans/`](plans/) | Plan produit U1–U8 |

---

*v0.5.1 — document vivant. Nouvelle convention → ici ou `docs/DESIGN.md` / ADR si décision structurante.*
