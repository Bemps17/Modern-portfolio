---
name: payload-cms-portfolio
description: Use when editing Payload CMS config, collections, globals, admin UI, hooks, or content layer for this Next.js portfolio — including questions about what Payload can do, its limits, or maximizing CMS usage on the public site.
disable-model-invocation: true
---

# Payload CMS — Portfolio Modern

## État actuel (baseline)

**Stack :** Payload 3.86 · Postgres (Neon) · Lexical · Vercel Blob (optionnel) · Next.js 16 App Router.

**Collections :** `users`, `media`, `projects`, `journal-posts`, `skills`, `experiences`, `qualifications`, `form-submissions`

**Globals :** `site-settings`, `seo-defaults`, `lablog-template`

**Front :** Local API via `src/lib/content.ts` — **jamais** `fetch('/api/...')` depuis les Server Components publics.

**Mode démo :** sans `DATABASE_URI` + `PAYLOAD_SECRET` → `portfolio-fallback.ts`.

## Règles non négociables (projet)

| Règle | Détail |
|---|---|
| CMS-first | Pas de copy marketing en dur dans les pages |
| Local API | `getPayloadClientSafe()` / helpers `content.ts` |
| Revalidation | Hooks `afterChange` → `revalidatePublicSite` |
| Admin JSON mobile | Champs JSON → `JsonTextareaField` (pas Monaco seul) |
| Types | `pnpm generate:types` après modif schéma |
| Gate | `pnpm verify` avant push |

## Ce que Payload fait sur CE site

| Zone | Rôle CMS |
|---|---|
| Accueil | Hero, disponibilité, approche, projets featured, skills marquee |
| Projets | CRUD, draft/published, preview admin, galerie, stack |
| À propos | Textes, skill groups, whyMe, expériences, qualifications |
| Lablog | Articles + galeries, blueprint JSON → Lexical, covers |
| Contact | Inbox `form-submissions`, toggle formulaire |
| CV | Champs site-settings → `/api/cv` PDF dynamique |
| SEO | Globals + metadata par page |
| Médias | Upload, sizes (thumbnail/card/hero), alt obligatoire |
| Admin | FR, dark, widgets custom, revalidate bouton, trusted devices |

## Capacités Payload 3 (plateforme)

### Déjà utilisées partiellement
- Collections + Globals, uploads, relations, arrays, select, hooks
- Access control (published vs auth)
- Auth admin (sessions, lockout, trusted devices)
- Lexical rich text, JSON fields, preview URLs
- Plugins : Vercel Blob, Postgres adapter, Sharp
- Admin customization (components, dashboard widgets, i18n FR)
- REST + GraphQL auto-générés (`/api/*`, `/api/graphql`)

### Disponibles mais NON activées sur ce projet
- **Versions / drafts** (`versions.drafts`, autosave, historique)
- **Live Preview** (iframe front dans l’admin)
- **Localization** (contenu multilingue)
- **Folders** (organisation médias)
- **Jobs / queues** (tâches planifiées natives Payload 3)
- **Email adapter** (Resend, Nodemailer — actuellement console)
- **SEO plugin officiel** (`@payloadcms/plugin-seo`)
- **Form builder plugin** (`@payloadcms/plugin-form-builder`)
- **Search plugin** (`@payloadcms/plugin-search`)
- **Nested docs** (hiérarchie parent/enfant)
- **Custom endpoints** sur collections/globals
- **Field-level access** granulaire
- **GraphQL custom queries**
- **Multi-tenant** (plusieurs sites, un Payload)
- **Stripe / ecommerce** (overkill ici)

## Limites à connaître

| Limite | Impact portfolio |
|---|---|
| Monaco JSON/Code | Bug mobile → utiliser `JsonTextareaField` |
| Pas de page builder visuel | Structure front = code React ; CMS = contenu |
| Serverless cold start | Admin + API sur Vercel = latence occasionnelle |
| Blob requis en prod serverless | Sans token → médias locaux (dev) ou 404 prod |
| `push: true` dev only | Prod Neon = migrations explicites si schéma change |
| Lexical ≠ Notion | Rich text structuré, pas de layout libre |
| Pas d’analytics natif | Stats visiteurs = outil externe (Plausible, etc.) |
| Auth = admin only | Pas de comptes visiteurs sans dev custom |
| Coût complexité | Chaque plugin/feature = maintenance + tests |

## Pattern d’extension (ordre recommandé)

1. **Champ ou global** — besoin éditorial identifié
2. **`content.ts`** — mapper vers type front
3. **Fallback démo** — seulement si nécessaire (éviter de toucher sans demande)
4. **Hook revalidate** — si page publique impactée
5. **`generate:types`** + test int si logique métier
6. **Doc** — `docs/how-to/cms.md` si workflow admin change

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `src/payload.config.ts` | Config racine |
| `src/collections/` | Schémas collections |
| `src/globals/` | Schémas globals |
| `src/lib/content.ts` | Couche front |
| `src/lib/revalidate.ts` | Cache Next |
| `src/components/admin/` | UI admin custom |
| `docs/how-to/cms.md` | Guide éditeur |

## Anti-patterns

- `fetch('/api/projects')` depuis le front public
- Hardcoder du texte éditorial dans `page.tsx`
- Champ `json` sans composant mobile-safe
- Oublier le fallback démo (`isPayloadConfigured`)
- Modifier `portfolio-fallback.ts` sans sync demandée
- Secrets dans le repo

## Quick reference — types de champs utiles

| Type | Cas d’usage portfolio |
|---|---|
| `richText` | Corps projet / article |
| `upload` | Images, PDF CV |
| `array` | Galeries, étapes, liens sociaux |
| `blocks` | Sections modulaires page (non utilisé — candidat accueil) |
| `json` + textarea admin | Blueprints IA, config structurée |
| `relationship` | Auteur article, tags, projets liés |
| `select` | Catégories, statuts, stack |
| `group` / `tabs` | Organiser gros globals |
| `ui` | Infos / séparateurs admin |

## Voir aussi

- Backlog détaillé : `docs/superpowers/plans/2026-07-25-payload-cms-maximisation.md`
- Guide éditeur : `docs/how-to/cms.md`
- Agents : `AGENTS.md`
