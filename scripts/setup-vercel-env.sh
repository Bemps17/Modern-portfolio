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
  echo ""
  echo "Optionnel (connexion admin 1 clic depuis le footer) :"
  echo "  export ENABLE_ADMIN_TEST_LOGIN=true"
  echo "  export SEED_ADMIN_EMAIL='votre@email.com'"
  echo "  export SEED_ADMIN_PASSWORD='mot-de-passe-admin'"
  exit 1
fi

add_env() {
  local name="$1"
  local value="$2"
  local target="$3"
  printf '%s' "$value" | npx vercel env add "$name" "$target" --force --scope "$TEAM" --project "$PROJECT"
}

for TARGET in production preview; do
  echo "→ $TARGET"
  add_env DATABASE_URI "$DATABASE_URI" "$TARGET"
  add_env PAYLOAD_SECRET "$PAYLOAD_SECRET" "$TARGET"
  add_env NEXT_PUBLIC_SITE_URL "$NEXT_PUBLIC_SITE_URL" "$TARGET"

  if [[ -n "${ENABLE_ADMIN_TEST_LOGIN:-}" ]]; then
    add_env ENABLE_ADMIN_TEST_LOGIN "$ENABLE_ADMIN_TEST_LOGIN" "$TARGET"
  fi
  if [[ -n "${SEED_ADMIN_EMAIL:-}" ]]; then
    add_env SEED_ADMIN_EMAIL "$SEED_ADMIN_EMAIL" "$TARGET"
  fi
  if [[ -n "${SEED_ADMIN_PASSWORD:-}" ]]; then
    add_env SEED_ADMIN_PASSWORD "$SEED_ADMIN_PASSWORD" "$TARGET"
  fi
done

echo ""
echo "OK — redeploy Production sur Vercel, puis vérifier :"
echo "  ${NEXT_PUBLIC_SITE_URL}/payload-health"
echo "  (ok: true + hasSecret: true + hasDatabase: true)"
echo ""
echo "Connexion admin : icône maison dans le footer → connexion 1 clic si ENABLE_ADMIN_TEST_LOGIN=true"
