# Modern Portfolio

Portfolio personnel CMS-driven — **Next.js 16 + Payload CMS 3 + Neon Postgres + Vercel**.

## Stack

- Next.js App Router + React 19 + TypeScript
- Payload CMS 3 (admin à `/admin`)
- Neon Postgres (pooled)
- Tailwind CSS v4 + Framer Motion
- Vercel Blob (médias, optionnel en local)
- Resend (emails contact)

## Setup local

```bash
pnpm install
cp .env.example .env.local
# Renseigner DATABASE_URI (Neon pooled) + PAYLOAD_SECRET
pnpm dev
```

Ouvrir :
- Site : http://localhost:3000
- Admin : http://localhost:3000/admin (créer le premier utilisateur)

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URI` | Neon Postgres pooled connection string |
| `PAYLOAD_SECRET` | Secret aléatoire long |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (active le plugin storage) |
| `RESEND_API_KEY` | Clé Resend pour le formulaire contact |
| `CONTACT_TO_EMAIL` | Destinataire des messages |
| `CONTACT_FROM_EMAIL` | Expéditeur Resend |

## Scripts

```bash
pnpm dev
pnpm build
pnpm test:int
pnpm generate:types
pnpm generate:importmap
```

## Contenu CMS

Collections : Projects, Skills, Experiences, Media, Users, Form Submissions  
Globals : Site Settings, SEO Defaults

Le front utilise la **Local API** Payload (`getPayload`) — aucun contenu éditorial hardcodé.

## Déploiement Vercel

Le projet doit utiliser le preset **Next.js** (forcé via `vercel.json`).

### Variables d'environnement obligatoires

Dans **Project Settings → Environment Variables** (Production + Preview) :

| Variable | Exemple |
|---|---|
| `DATABASE_URI` | Neon pooled `postgresql://...-pooler.../neondb?sslmode=require` |
| `PAYLOAD_SECRET` | Chaîne aléatoire longue (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | `https://ton-domaine.vercel.app` |

Optionnel : `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

Sans `PAYLOAD_SECRET` / `DATABASE_URI`, le build et le site public fonctionnent en **mode démo** : contenu importé depuis le portfolio actuel (`projet-refonte-portfolio-persov1-0.vercel.app`). L’admin et le formulaire contact nécessitent les variables.

1. Connecter le repo GitHub
2. Intégration Neon Marketplace (ou coller `DATABASE_URI` manuellement)
3. Ajouter `PAYLOAD_SECRET` + `NEXT_PUBLIC_SITE_URL`
4. Redeploy

## Roadmap MVP (état)

| Zone | Statut |
|---|---|
| U1–U8 fondations, pages, SEO, tests | ✅ |
| Mode démo Vercel (sans env) | ✅ |
| Layout studio + effets fun | ✅ |
| Neon seedé + script `pnpm seed:portfolio` | ✅ |
| SEO : JSON-LD, OG/Twitter, sitemap | ✅ v0.5.0 |
| Monitoring : Vercel Analytics + Speed Insights | ✅ v0.5.0 |
| Admin preview bouton sur projets | ✅ v0.5.0 |
| Variables Vercel prod (`/admin` CMS) | 🔶 À configurer manuellement |
| Resend contact prod | 🔶 Optionnel |
| Lighthouse ≥ 95 | ⏳ À auditer |
| Domaine custom | ⏳ |
| Live Preview admin (drafts Payload) | ⏳ Post-MVP |

## Plan

- **Guide de développement & bonnes pratiques :** `docs/DEVELOPMENT.md`
- Plan d’implémentation : `docs/plans/2026-07-20-001-feat-modern-portfolio-cms-plan.md`
