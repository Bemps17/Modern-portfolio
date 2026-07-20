# ADR 001 — Local API Payload plutôt que REST HTTP

**Statut :** accepté  
**Date :** 2026-07-20

## Contexte

Le front Next.js et Payload partagent le même repo et le même processus de build. Payload expose aussi REST/GraphQL sur `/api/*`.

## Décision

Le front public utilise exclusivement la **Local API** (`getPayload()` via `src/lib/content.ts`). Aucun `fetch` interne vers `/api/projects`.

## Conséquences

- ✅ Pas de sérialisation réseau, perf optimale, typage direct
- ✅ ISR et Server Components natifs
- ⚠️ Le front ne peut pas être déployé séparément du CMS sans refactor
- REST/GraphQL restent disponibles pour intégrations externes futures
