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

1. Connecter le repo GitHub
2. Intégration Neon Marketplace (injecte `DATABASE_URI`)
3. Ajouter `PAYLOAD_SECRET`, Blob, Resend, `NEXT_PUBLIC_SITE_URL`
4. Deploy — Payload et le front partagent le même build

## Plan

Voir `docs/plans/2026-07-20-001-feat-modern-portfolio-cms-plan.md`.
