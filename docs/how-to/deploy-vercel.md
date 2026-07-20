# How-to — Déploiement Vercel

## Prérequis

- Repo GitHub connecté à Vercel
- Projet Neon `modern-portfolio` (ou intégration Marketplace)

## Variables obligatoires (Production + Preview)

| Variable | Exemple |
|---|---|
| `DATABASE_URI` | `postgresql://…-pooler…/neondb?sslmode=require` |
| `PAYLOAD_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://modern-portfolio-two-orcin.vercel.app` |

Optionnel : `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

## Script automatisé

```bash
export VERCEL_TOKEN=…
export DATABASE_URI=…
export PAYLOAD_SECRET=…
export NEXT_PUBLIC_SITE_URL=…
./scripts/setup-vercel-env.sh
```

## Après configuration

1. Redeploy sur Vercel (Deployments → Redeploy)
2. Vérifier `/admin` et login seed
3. Vérifier que le site charge le CMS (plus seulement le fallback)

## Rollback

Vercel → Deployments → déploiement précédent → **Promote to Production**.
