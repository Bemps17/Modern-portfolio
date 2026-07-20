#!/usr/bin/env bash
# Configure les variables Vercel pour activer Payload CMS en production.
# Prérequis : VERCEL_TOKEN (https://vercel.com/account/tokens) + Vercel CLI (npx vercel)
set -euo pipefail

PROJECT="${VERCEL_PROJECT:-modern-portfolio}"
TEAM="${VERCEL_TEAM:-bemps17s-projects}"

if [[ -z "${DATABASE_URI:-}" || -z "${PAYLOAD_SECRET:-}" || -z "${NEXT_PUBLIC_SITE_URL:-}" ]]; then
  echo "Variables requises : DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL"
  echo "Exemple :"
  echo "  export DATABASE_URI='postgresql://...-pooler.../neondb?sslmode=require'"
  echo "  export PAYLOAD_SECRET=\$(openssl rand -base64 32)"
  echo "  export NEXT_PUBLIC_SITE_URL='https://modern-portfolio-two-orcin.vercel.app'"
  exit 1
fi

for TARGET in production preview; do
  echo "→ $TARGET"
  printf '%s' "$DATABASE_URI" | npx vercel env add DATABASE_URI "$TARGET" --force --scope "$TEAM" --project "$PROJECT"
  printf '%s' "$PAYLOAD_SECRET" | npx vercel env add PAYLOAD_SECRET "$TARGET" --force --scope "$TEAM" --project "$PROJECT"
  printf '%s' "$NEXT_PUBLIC_SITE_URL" | npx vercel env add NEXT_PUBLIC_SITE_URL "$TARGET" --force --scope "$TEAM" --project "$PROJECT"
done

echo "OK — lance un redeploy sur Vercel pour appliquer."
