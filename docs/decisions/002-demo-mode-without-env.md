# ADR 002 — Mode démo sans variables d'environnement

**Statut :** accepté  
**Date :** 2026-07-20

## Contexte

Le déploiement Vercel initial échouait sans `PAYLOAD_SECRET` / `DATABASE_URI`. Besoin de prévisualiser le design avant configuration Neon.

## Décision

Si `isPayloadConfigured()` est faux, `src/lib/content.ts` sert `portfolio-fallback.ts`. Build et pages publiques fonctionnent ; `/admin` et contact prod nécessitent les env.

## Conséquences

- ✅ Preview Vercel immédiate, onboarding simplifié
- ✅ `pnpm build` passe en CI sans secrets
- ⚠️ Double source de vérité temporaire (fallback vs CMS) — le CMS prend le relais dès que les env sont configurées
- Ne pas ajouter de contenu éditorial en dur dans les pages : le fallback reste dans `src/data/` uniquement
