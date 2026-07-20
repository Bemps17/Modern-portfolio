# Instructions agents — Modern Portfolio

> Fichier court pour Cursor / agents cloud. Détails : `docs/DEVELOPMENT.md`.

## Projet

Portfolio CMS — **Next.js 16 + Payload 3 + Neon + Vercel**. Contenu éditorial via `/admin`, front en mode démo si env absents.

## Avant de coder

1. Lire `docs/DEVELOPMENT.md` (TL;DR + DoD)
2. Scope minimal — une PR = un objectif
3. Branches : `cursor/<description>-c30f`

## Commandes

```bash
pnpm dev                    # Dev local
pnpm verify                 # Gate PR (lint + typecheck + tests + build + tokens)
pnpm test:e2e               # Playwright (DB optionnelle)
pnpm generate:types         # Après modif collections/globals
pnpm seed:portfolio         # Seed Neon (DATABASE_URI + PAYLOAD_SECRET)
```

## Fichiers clés

| Zone | Chemin |
|---|---|
| Contenu front | `src/lib/content.ts` |
| Fallback démo | `src/data/portfolio-fallback.ts` |
| Tokens CSS | `src/app/(frontend)/styles.css` |
| Design system | `docs/DESIGN.md` |
| Collections | `src/collections/` |
| Version footer | `src/lib/site-version.ts` — incrémenter à chaque livraison |

## Règles non négociables

- **CMS-first** : pas de copy marketing en dur dans les pages
- **Local API** Payload — pas de `fetch('/api/projects')` depuis le front
- **Pas de secrets** dans le code ou les commits
- **Server Components** par défaut ; `'use client'` seulement si nécessaire
- Pas de lib UI lourde (shadcn, MUI…)
- Ne pas casser le **mode démo** (`isPayloadConfigured()`)

## Ne pas toucher sans raison

- `portfolio-fallback.ts` (sauf sync contenu demandé)
- `pnpm-lock.yaml` (sauf ajout dépendance justifiée)
- Plan produit : `docs/plans/` (référence, pas à réécrire)

## Checklist avant push

```bash
pnpm verify
```

- [ ] Scope limité à la tâche
- [ ] `SITE_VERSION` bumpé si livraison notable
- [ ] Pas de secret dans le diff

## Docs

- Guide dev : `docs/DEVELOPMENT.md`
- Design : `docs/DESIGN.md`
- How-to CMS : `docs/how-to/cms.md`
- Décisions : `docs/decisions/`
