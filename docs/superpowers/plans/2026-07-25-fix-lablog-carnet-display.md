# Fix Lablog titre + contenu vide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Afficher « Le Lablog » (pas « Carnet ») et les 12 articles sur `/carnet` en prod Neon + Payload.

**Architecture:** Neon prod a `site_settings.journal_title = 'Carnet'` et `journal_posts` vide. Le front lit le CMS quand Payload est configuré — résultat : titre legacy + liste vide. Correctifs : migration libellés, seed Neon, fallback si CMS vide, defaults Sidebar alignés.

**Tech Stack:** Next.js 16, Payload 3, Neon Postgres, Vitest

## Global Constraints

- Branches : `cursor/<description>-ecc9`
- CMS-first avec fallback démo si CMS indisponible ou vide
- `pnpm verify` avant push
- Bump `SITE_VERSION` si livraison notable

---

### Task 1: Helpers journal + tests TDD

**Files:**
- Create: `src/lib/journal-content.ts`
- Create: `tests/int/journal-content-resolver.int.spec.ts`
- Modify: `src/lib/content.ts`

**Interfaces:**
- Produces: `resolvePublishedJournalPosts(cmsDocs, fallback)`, `resolveJournalCopy(cmsValue, fallback)`

- [ ] Test fallback quand CMS retourne `[]`
- [ ] Test migration libellé legacy `'Carnet'` → fallback `'Le Lablog'`
- [ ] Brancher dans `getPublishedJournalPosts` et `withEditorialFallback`

### Task 2: Seed site-settings + Neon

**Files:**
- Modify: `scripts/seed-lablog-articles.ts`
- Modify: `scripts/seed-portfolio.ts`
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] `seed:lablog` met à jour `journalNavLabel`, `journalTitle`, `journalEyebrow`, `journalSubtitle`
- [ ] `seed:portfolio` inclut les champs journal
- [ ] SQL Neon : corriger `site_settings` immédiat
- [ ] Exécuter `DATABASE_URI=<neon> pnpm seed:lablog`

### Task 3: Verify + commit + PR

- [ ] `pnpm verify`
- [ ] Bump `SITE_VERSION` → `0.20.1`
- [ ] Commit + push branche `cursor/fix-lablog-carnet-display-ecc9`
