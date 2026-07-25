# Lablog — Vérification & correctifs finaux Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les régressions restantes après seed Neon — covers 404 en prod Vercel et fallback slug manquant.

**Architecture:** Les covers CMS (`/api/media/file/`) ne sont pas disponibles sur Vercel sans Blob ni disque persistant. Les WebP statiques dans `public/carnet/` sont versionnés — le front résout la cover Lablog par slug avant l’URL CMS. `getJournalPostBySlug` fallback si CMS ne trouve pas le post.

**Tech Stack:** Next.js 16, Payload 3, Vitest, Neon Postgres

## Global Constraints

- Branches : `cursor/<description>-ecc9`
- CMS-first : contenu depuis Payload ; covers Lablog via assets statiques commités
- `pnpm verify` avant push
- Bump `SITE_VERSION` si livraison notable

---

### Task 1: resolveJournalCoverUrl (TDD)

**Files:**
- Create: `src/lib/journal-cover.ts`
- Create: `tests/int/journal-cover.int.spec.ts`
- Modify: `vitest.config.mts`

- [ ] Test : slug Lablog → `/carnet/{slug}-cover.webp`
- [ ] Test : slug inconnu → URL CMS
- [ ] Implémenter helper

### Task 2: Brancher le helper UI + content fallback slug

**Files:**
- Modify: `src/components/sections/JournalPostCard.tsx`
- Modify: `src/components/sections/JournalPostDetailView.tsx`
- Modify: `src/lib/journal-gallery.ts`
- Modify: `src/app/(frontend)/carnet/[slug]/page.tsx`
- Modify: `src/lib/content.ts` — `getJournalPostBySlug` fallback
- Modify: `src/lib/journal-content.ts` — `resolveJournalPostBySlug`

### Task 3: Seed idempotent médias + verify + commit

**Files:**
- Modify: `scripts/seed-lablog-articles.ts`
- Modify: `src/lib/site-version.ts`

- [ ] Réutiliser média existant par filename de base
- [ ] `pnpm verify`
- [ ] Commit + push
