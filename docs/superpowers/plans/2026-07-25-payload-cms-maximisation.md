# Payload CMS — Maximisation du portfolio

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement items from this backlog task-by-task.

**Goal:** Inventaire complet des capacités Payload, limites, et opportunités d’amélioration pour le portfolio — priorisées par impact éditorial vs effort.

**Architecture:** Payload 3 reste la source de vérité éditoriale ; le front consomme via Local API (`content.ts`). Chaque extension suit : schéma → content layer → revalidate → tests → fallback si requis.

**Tech Stack:** Payload 3.86, Postgres/Neon, Lexical, Vercel Blob, Next.js 16, Resend (optionnel)

## Global Constraints

- CMS-first : pas de copy en dur dans les pages
- Local API uniquement côté front public
- Ne pas casser le mode démo (`isPayloadConfigured`)
- `pnpm verify` avant merge
- Branches agent : `cursor/<description>-ecc9`
- Bump `SITE_VERSION` par livraison notable

---

## Tier 1 — Impact élevé, effort modéré

### Epic A : Preview & workflow éditorial

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| A1 | **Live Preview** (`admin.livePreview`) | Voir les changements en temps réel dans l’admin | M |
| A2 | **Versions / drafts** sur `projects` + `journal-posts` | Brouillons, historique, rollback | M |
| A3 | **Autosave** brouillons | Ne pas perdre un article long | S |
| A4 | **Scheduled publish** (`publishedAt` + job/cron) | Programmer un article Lablog | M |

### Epic B : SEO & partage

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| B1 | Plugin **`@payloadcms/plugin-seo`** | Meta title/description/OG par document | M |
| B2 | **SEO overrides** par projet/article | Contrôle fin du partage LinkedIn | S |
| B3 | **Canonical URL** + **noIndex** par page | Pages staging / brouillons | S |
| B4 | **JSON-LD** (Person, Article, Project) depuis CMS | Rich results Google | M |

### Epic C : Médias & Lablog

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| C1 | **Folders** collection Media | Organiser covers Lablog / projets | S |
| C2 | **Tags** collection + relation articles/projets | Filtrage `/carnet?tag=ia` | M |
| C3 | **Auteur** (relationship Users → JournalPosts) | Crédit rédaction | S |
| C4 | **Series** Lablog (array ou collection) | Parcours lecture thématique | M |
| C5 | **Reading time** (hook calcul depuis Lexical) | UX article | S |

---

## Tier 2 — Enrichissement éditorial

### Epic D : Contenu modulaire (Blocks)

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| D1 | **Blocks field** sur Projects | Sections : quote, gallery, code, CTA | L |
| D2 | **Blocks field** sur JournalPosts | Encarts, citations, embeds | L |
| D3 | **Page builder light** global Accueil | Réordonner sections sans deploy | L |
| D4 | **Callout blocks** (info, warning, tip) | DA Lablog cohérente | M |

### Epic E : Relations & navigation

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| E1 | **Projets liés** (relationship self) | « Voir aussi » sur fiche projet | S |
| E2 | **Stack → Skills** sync | Cohérence compétences / projets | M |
| E3 | **Featured Lablog** dans site-settings | Mettre en avant 3 articles accueil | S |
| E4 | **Menu/footer links** éditables (global) | Liens légaux / externe sans code | S |

### Epic F : Contact & inbox

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| F1 | **Email Resend** sur create `form-submissions` | Notification instantanée | S |
| F2 | **Statuts inbox** (nouveau, lu, répondu) | CRM minimal | S |
| F3 | **Honeypot + rate limit** renforcé | Anti-spam | S |
| F4 | **Réponse type** (global textarea) | Accusé réception auto | M |

---

## Tier 3 — Admin & DX

### Epic G : Interface admin

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| G1 | **Dashboard stats** widget (counts, derniers posts) | Vue d’ensemble | M |
| G2 | **Raccourcis** widget (nouveau projet, article) | Productivité | S |
| G3 | **Bulk edit** status (Payload natif list view) | Publier plusieurs brouillons | S |
| G4 | **Import/export** JSON collections | Backup contenu | M |
| G5 | **Rôles** (editor vs admin) field-level access | Délégation rédaction | M |

### Epic H : IA & génération

| # | Amélioration | Bénéfice | Effort |
|---|---|---|---|
| H1 | **Endpoint** `POST /api/lablog/generate` | Générer article depuis blueprint + hints | L |
| H2 | **Bouton admin** « Générer depuis blueprint » | UX rédacteur | M |
| H3 | **Seed assisté** depuis admin | Réinitialiser démo Neon | M |
| H4 | **Validation Zod** côté admin (feedback live) | Moins d’erreurs JSON | S |

---

## Tier 4 — Capacités Payload « nice to have »

| # | Feature Payload | Usage possible sur le site | Utilité réelle |
|---|---|---|---|
| T1 | **Localization** | Site EN + FR | Faible sauf cible internationale |
| T2 | **GraphQL** public | Headless pour app mobile | Faible |
| T3 | **Search plugin** | Recherche full-text Lablog | Moyenne si >30 articles |
| T4 | **Form builder plugin** | Formulaires dynamiques (sondage, newsletter) | Moyenne |
| T5 | **Nested docs** | Catégories hiérarchiques Lablog | Faible |
| T6 | **Multi-tenant** | Plusieurs portfolios | Nulle ici |
| T7 | **Stripe plugin** | Vente templates / services | Nulle sauf pivot |
| T8 | **Redirects plugin** | Gérer 301 après rename slug | Moyenne |
| T9 | **Import CSV** | Migrer expériences LinkedIn | Ponctuel |
| T10 | **Audit log** (custom hook) | Qui a publié quoi | Faible solo |
| T11 | **Webhooks sortants** | Notifier Discord/Slack à la publication | Fun / veille |
| T12 | **Custom auth** (OAuth GitHub) | Login admin sans mot de passe | Confort |
| T13 | **Cron jobs Payload** | Sync GitHub → Projects auto | Déjà script `sync-github-projects` |
| T14 | **Trash / soft delete** | Récupérer un projet supprimé | Confort |
| T15 | **Content locking** | Éviter édition simultanée | Faible solo |

---

## Tier 5 — Limites structurelles (ne pas « fixer » avec Payload seul)

| Besoin | Pourquoi Payload ne suffit pas seul | Alternative |
|---|---|---|
| Analytics visiteurs | Pas de tracking natif | Plausible, Vercel Analytics |
| Commentaires blog | Pas de feature commentaires | Giscus, Disqus, ou collection custom |
| Newsletter | Pas d’envoi massif natif | Resend audiences, Buttondown |
| A/B testing contenu | Pas de split natif | Vercel Flags, PostHog |
| Page builder Figma-like | Lexical ≠ layout drag-drop | Garder React + CMS contenu |
| E-commerce | Hors scope portfolio | Stripe Checkout custom |
| Real-time collab | Pas de CRDT natif | Liveblocks (overkill) |

---

## Déjà bien exploité (ne pas refaire)

- Globals denses (`site-settings` très complet)
- Revalidation automatique + bouton manuel
- Preview URL admin par document
- Access published/draft
- Trusted devices admin
- Blueprint JSON Lablog + template global
- CV dynamique alimenté CMS
- Galeries Lablog (grid + slideshow)
- Image sizes + alt obligatoire
- Mode démo robuste

---

## Roadmap suggérée (ordre d’exécution)

1. **A2 + A1** — drafts + live preview (workflow)
2. **B1** — plugin SEO
3. **F1** — emails contact Resend
4. **C2 + C5** — tags + reading time Lablog
5. **D4** — callout blocks Lablog
6. **G1** — dashboard stats

Chaque epic = une PR (`cursor/<epic>-ecc9`).

---

## Métriques de succès

- 100 % du copy public éditable sans redeploy structure
- Temps publication article < 5 min (admin → live)
- Zero régression mode démo (`pnpm verify`)
- Admin utilisable sur mobile (pas de Monaco bloqué)
