# Payload Phase 3 — E2, G2, F4, H4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement task-by-task.

**Goal:** Stack→Skills sync, widget raccourcis admin, accusé réception contact auto, validation Zod blueprint Lablog.

**Architecture:** Logique pure testée (`stack-skill-sync`, `lablog-blueprint-schema`) ; hooks Payload `afterChange` pour sync skills ; globals site-settings pour F4 ; widget admin RSC.

**Tech Stack:** Payload 3.86, Zod 4, Vitest, Resend

## Global Constraints

- CMS-first, Local API front, mode démo intact
- `pnpm verify` avant merge
- Branches : `cursor/<description>-ecc9`
- TDD : test fail → impl → pass
- `pnpm generate:types` après schéma
- Bump `SITE_VERSION` livraison notable → **0.24.0** en fin de phase

---

### Task 1: Stack → Skills sync (E2)

**Files:**
- Create: `src/lib/stack-skill-sync.ts`
- Create: `tests/int/stack-skill-sync.int.spec.ts`
- Modify: `src/collections/Projects.ts` (afterChange hook)
- Modify: `vitest.config.mts`

**Interfaces:**
- Produces:
  - `STACK_SKILL_MAP: Record<string, { name: string; category: 'frontend' | 'backend' | 'outils' | 'design' }>`
  - `skillsToEnsureFromStack(stack: string[]): Array<{ name: string; category: string }>`
  - `syncProjectStackToSkills(payload, stack: string[]): Promise<{ created: number }>`

- [ ] **Step 1: Failing test**

```typescript
import { skillsToEnsureFromStack } from '@/lib/stack-skill-sync'

it('mappe nextjs vers Next.js frontend', () => {
  const skills = skillsToEnsureFromStack(['nextjs'])
  expect(skills).toEqual([{ name: 'Next.js', category: 'frontend' }])
})

it('ignore les slugs inconnus', () => {
  expect(skillsToEnsureFromStack(['unknown'])).toEqual([])
})
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement map + sync helper**

Use same labels as `ProjectDetailView` STACK_LABELS. Categories:
- frontend: nextjs, react, typescript, tailwind, framer-motion
- backend: nodejs, postgres, payload, neon
- outils: vercel

`syncProjectStackToSkills`: find skills by name, create missing with overrideAccess.

- [ ] **Step 4: Hook Projects afterChange** (after existing revalidate, only if stack present)

- [ ] **Step 5: Commit** `feat(cms): sync stack projets vers collection skills (E2)`

---

### Task 2: Widget raccourcis admin (G2)

**Files:**
- Create: `src/components/admin/AdminShortcutsWidget.tsx`
- Modify: `src/payload.config.ts` (dashboard widget + layout)
- Modify: `src/app/(payload)/custom.scss` (styles boutons)

**Interfaces:**
- Produces widget with links:
  - Nouveau projet → `/admin/collections/projects/create`
  - Nouvel article → `/admin/collections/journal-posts/create`
  - Site settings → `/admin/globals/site-settings`
  - Inbox → `/admin/collections/form-submissions`

- [ ] **Step 1: Create widget (no test needed for pure links — smoke via payload-schema if desired)**

- [ ] **Step 2: Register in dashboard between stats and collections**

- [ ] **Step 3: Commit** `feat(admin): widget raccourcis éditoriaux (G2)`

---

### Task 3: Accusé réception contact (F4)

**Files:**
- Modify: `src/globals/SiteSettings.ts` (contact tab fields)
- Modify: `src/lib/form-submission-notify.ts`
- Create: `tests/int/contact-auto-reply.int.spec.ts`
- Modify: `src/collections/FormSubmissions.ts` hook if needed

**Interfaces:**
- Consumes: `contactAutoReplyEnabled`, `contactAutoReplySubject`, `contactAutoReplyBody` from env/globals passed to notify
- Produces: `buildContactAutoReplyEmail(input)` + send to submitter in hook when enabled

Default body supports `{{name}}` placeholder.

- [ ] **Step 1: Failing test for buildContactAutoReplyEmail**

- [ ] **Step 2–4: Implement + wire hook**

- [ ] **Step 5: Commit** `feat(contact): accusé réception auto configurable (F4)`

---

### Task 4: Validation Zod blueprint Lablog (H4)

**Files:**
- Create: `src/lib/lablog-blueprint-schema.ts`
- Modify: `src/lib/lablog-article-blueprint.ts` (validate before apply)
- Create: `tests/int/lablog-blueprint-schema.int.spec.ts`

**Interfaces:**
- Produces: `lablogBlueprintSchema` (Zod), `validateLablogBlueprint(json): { ok: true, data } | { ok: false, error: string }`

Minimal schema: `{ title?: string, excerpt?: string, category?: string, blocks?: array }`

- [ ] **Step 1: Failing test — invalid blueprint rejected**

- [ ] **Step 2–4: Schema + integrate in applyLablogBlueprint (skip apply if invalid, keep existing content)**

- [ ] **Step 5: Commit + SITE_VERSION 0.24.0 + pnpm verify**

```bash
git commit -m "feat(lablog): validation Zod blueprint JSON admin (H4)"
```

---

## Self-review

| Requirement | Task |
|---|---|
| E2 | 1 |
| G2 | 2 |
| F4 | 3 |
| H4 | 4 |
