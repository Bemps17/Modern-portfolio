# How-to — Déploiement Vercel

## Prérequis

- Repo GitHub connecté à Vercel
- Projet Neon `modern-portfolio` (connection string **pooler**)

## Variables obligatoires

Cocher **Production** et **Preview** pour chaque variable (Settings → Environment Variables).

| Variable | Exemple |
|---|---|
| `DATABASE_URI` | `postgresql://…-pooler…/neondb?sslmode=require` |
| `PAYLOAD_SECRET` | `openssl rand -base64 32` (≥ 32 caractères) |
| `NEXT_PUBLIC_SITE_URL` | `https://modern-portfolio-two-orcin.vercel.app` |

Optionnel : `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

## Connexion admin simple (1 clic)

Ajouter aussi sur **Production** :

| Variable | Valeur |
|---|---|
| `ENABLE_ADMIN_TEST_LOGIN` | `true` |
| `SEED_ADMIN_EMAIL` | email admin Payload |
| `SEED_ADMIN_PASSWORD` | mot de passe admin |

L’icône **maison** du footer ouvre alors `/api/admin/test-login` → cookie → `/admin`.

Sans ces variables, le footer mène à `/admin/login` (formulaire Payload classique).

## Script automatisé

```bash
export VERCEL_TOKEN=…
export DATABASE_URI=…
export PAYLOAD_SECRET=…
export NEXT_PUBLIC_SITE_URL=…
export ENABLE_ADMIN_TEST_LOGIN=true
export SEED_ADMIN_EMAIL=…
export SEED_ADMIN_PASSWORD=…
./scripts/setup-vercel-env.sh
```

## Vérification après redeploy

1. Ouvrir `/payload-health` — attendu : `{ "ok": true, "payload": { "hasSecret": true, "hasDatabase": true } }`
2. Si `hasSecret: false` → `PAYLOAD_SECRET` absent au runtime (mauvais environnement ou redeploy manquant)
3. Cliquer l’icône footer → backoffice Payload

## Erreur fréquente

`ERROR 3884830141` / `missing secret key` = `PAYLOAD_SECRET` non défini sur **Production** (souvent configuré en Preview seulement).

## Rollback

Vercel → Deployments → déploiement précédent → **Promote to Production**.
