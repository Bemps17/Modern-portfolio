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

## Cursor Cloud specific instructions

Single Next.js 16 app (App Router) that serves three things on **one port `3000`**:
the public portfolio (`/`), the Payload CMS admin (`/admin`), and the Payload REST/GraphQL API (`/api`).
Standard commands live in `README.md`, `docs/DEVELOPMENT.md`, and `package.json` scripts — this section only
captures the non-obvious startup caveats for this VM.

### Database (Postgres) — required for the CMS/admin, not for the public site
- Postgres 16 is installed in the VM snapshot but is **not started automatically**. Start it each session:
  `sudo pg_ctlcluster 16 main start`
- A local DB `portfolio` (user `postgres` / password `postgres`) already exists in the snapshot.
- The app reads env from **`.env.local`** (gitignored). If it is missing, recreate it:
  ```
  DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5432/portfolio
  PAYLOAD_SECRET=<any long random string, e.g. `openssl rand -base64 32`>
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- The Payload Postgres adapter runs with `push: true` in dev, so the schema is auto-created/synced on first
  connect — no manual migration step. `pnpm test:int`'s `api.int.spec.ts` also needs this DB running.

### Demo mode vs full mode
- Without `PAYLOAD_SECRET` **and** `DATABASE_URI`, the app runs in **demo mode**: the public site + build work
  using `src/data/portfolio-fallback.ts`; `/admin`, the contact form, and content editing are disabled
  (see `src/lib/payload-env.ts`, `src/lib/content.ts`).

### Payload import map (admin rich-text)
- The committed `src/app/(payload)/admin/importMap.js` is stale (missing the Lexical rich-text components), which
  makes required rich-text fields (e.g. a Project's `Content`) fail to render in `/admin`. The update script runs
  `pnpm generate:importmap` (no DB needed) to regenerate it. Expect this file to show as modified in the working
  tree — that is the regenerated (correct) version; do not treat it as your change.

### Known pre-existing bug (blocks the public frontend)
- Every public page (`/`, `/projets`, `/a-propos`, `/contact`) currently returns **HTTP 500** because
  `src/components/layout/Header.tsx` renders `<Image src="/brand/favicon.png">` but `next.config.ts`
  `images.localPatterns` only allows `/api/media/file/**`. `/admin` and `/api` are unaffected.
  Fix (app-code change, out of scope for env setup): add `{ pathname: '/brand/**' }` to `images.localPatterns`
  (or use a plain `<img>` for the local logo).

### Media & email in local dev
- No `BLOB_READ_WRITE_TOKEN` → media uploads are stored on the local disk (Vercel Blob plugin stays off).
- No `RESEND_API_KEY` → Payload logs emails to the console instead of sending; the contact form still validates.
