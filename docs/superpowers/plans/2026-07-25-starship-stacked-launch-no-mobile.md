# Fusée — Étages collés au lancement & suppression mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Au lancement desktop, les étages de la fusée restent collés (silhouette complète visible) pendant countdown/ignition/liftoff ; supprimer toute la variante mobile (mini-fusée + panneau méthode mobile).

**Architecture:** Introduire un mode `stacked` sur `StarshipSvg` distinct de l'ancien `isLaunching` (qui éparpillait les tranches). Pendant la séquence de lancement, forcer `spread = 0`, masquer la ligne pointillée centrale, et laisser le portal déplacer la fusée entière. Retirer `MobileMethodPanel`, `MiniRocket` et rendre `StarshipCutaway` visible uniquement en `xl+`.

**Tech Stack:** Next.js 16, React 19, Framer Motion, Vitest, TypeScript, Tailwind CSS v4 tokens.

## Global Constraints

- Palette : `--accent` `#ff6b1a`, `--accent-soft` `#ffc266`, `--accent-glow`, ivoire `#f8f4ef`, `--background` `#0a0a0a`
- Section fusée + bouton Lancer : **desktop `xl+` uniquement** (≥ 1280px) — rien en dessous
- `useReducedMotion()` : redirect immédiat `/contact` inchangé
- Pas de lib UI lourde ; lucide-react OK
- CMS-first : pas de copy marketing en dur dans les pages
- `SITE_VERSION` bump → **0.18.2**
- Branche : `cursor/starship-aesthetic-ecc9`
- Gate : `pnpm verify`

## File Structure

| File | Responsibility |
|---|---|
| `src/components/sections/starship/StarshipSvg.tsx` | Prop `stacked` : étages collés, pas d'éparpillement ; masquer ligne pointillée |
| `src/components/sections/starship/StarshipLiftoffPortal.tsx` | Passer `stacked` au lieu de `isLaunching` |
| `src/components/sections/StarshipCutaway.tsx` | Collapse étages dès countdown ; retirer mobile ; desktop-only |
| `src/components/sections/starship/MiniRocket.tsx` | **Supprimer** |
| `tests/int/starship-svg.int.spec.ts` | Tests unitaires rendu `stacked` |
| `src/lib/site-version.ts` | Bump 0.18.2 |

---

### Task 1: Mode `stacked` sur StarshipSvg + tests

**Files:**
- Modify: `src/components/sections/starship/StarshipSvg.tsx`
- Create: `tests/int/starship-svg.int.spec.ts`
- Test: `tests/int/starship-svg.int.spec.ts`

**Interfaces:**
- Produces: `StarshipSvg({ activeStage, isLaunching, isIgniting, stacked, onSelect })`
- `stacked: boolean` — quand `true`, tous les `RocketSlice` ont `y: 0` (spread forcé à 0), `opacity: 1`, pas de rotation ; la ligne pointillée centrale est absente du DOM

- [ ] **Step 1: Write failing test**

```typescript
// tests/int/starship-svg.int.spec.ts
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { StarshipSvg } from '@/components/sections/starship/StarshipSvg'

describe('StarshipSvg stacked mode', () => {
  it('hides dashed spine line when stacked', () => {
    const { container } = render(
      <StarshipSvg activeStage={2} isIgniting={false} isLaunching={false} stacked onSelect={() => undefined} />,
    )
    const dashedLine = container.querySelector('line[stroke-dasharray]')
    expect(dashedLine).toBeNull()
  })

  it('shows dashed spine line when not stacked', () => {
    const { container } = render(
      <StarshipSvg activeStage={2} isIgniting={false} isLaunching={false} stacked={false} onSelect={() => undefined} />,
    )
    const dashedLine = container.querySelector('line[stroke-dasharray]')
    expect(dashedLine).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/int/starship-svg.int.spec.ts`
Expected: FAIL — `stacked` prop does not exist

- [ ] **Step 3: Implement stacked mode**

Changes in `StarshipSvg.tsx`:

1. Add `stacked?: boolean` to `StarshipSvgProps` and `RocketSliceProps` (default `false`).

2. In `RocketSlice`, replace spread logic:

```typescript
const spread = stacked ? 0 : activeStage >= index ? index * LAYER_SPREAD : 0
```

3. Replace `isLaunching` animate branch — when `stacked`, use same as idle (y: spread, opacity: 1):

```typescript
animate={
  stacked
    ? { y: 0, scale: 1, opacity: 1, rotate: 0 }
    : isLaunching
      ? { y: -620 - index * 36, opacity: 0, rotate: index % 2 === 0 ? -5 : 5 }
      : isIgniting
        ? { y: spread - 2, scale: 0.985, opacity: 1 }
        : { y: spread, scale: 1, opacity: 1, rotate: 0 }
}
```

4. Conditionally render dashed line only when `!stacked`:

```tsx
{!stacked ? (
  <line strokeDasharray="4 3" ... />
) : null}
```

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run tests/int/starship-svg.int.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/starship/StarshipSvg.tsx tests/int/starship-svg.int.spec.ts
git commit -m "feat(starship): mode stacked — étages collés au lancement"
```

---

### Task 2: Câblage séquence lancement (portal + countdown collapse)

**Files:**
- Modify: `src/components/sections/starship/StarshipLiftoffPortal.tsx`
- Modify: `src/components/sections/StarshipCutaway.tsx`

**Interfaces:**
- Consumes: `StarshipSvg` prop `stacked: boolean`
- Produces: `isStacked = phase !== 'idle'` passé à StarshipSvg embedded et portal

- [ ] **Step 1: StarshipLiftoffPortal — stacked au lieu de isLaunching**

```tsx
<StarshipSvg
  activeStage={activeStage}
  isIgniting={false}
  isLaunching={false}
  stacked
  onSelect={() => undefined}
/>
```

- [ ] **Step 2: StarshipCutaway — stacked dès countdown**

Add near phase checks:

```typescript
const isStacked = phase !== 'idle'
```

Pass to embedded StarshipSvg:

```tsx
<StarshipSvg
  activeStage={activeStage}
  isIgniting={isIgniting}
  isLaunching={false}
  stacked={isStacked}
  onSelect={selectStage}
/>
```

- [ ] **Step 3: Run verify subset**

Run: `pnpm vitest run tests/int/starship-svg.int.spec.ts tests/int/starship-launch.int.spec.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/starship/StarshipLiftoffPortal.tsx src/components/sections/StarshipCutaway.tsx
git commit -m "feat(starship): collapse étages dès countdown et liftoff portal stacked"
```

---

### Task 3: Suppression variante mobile

**Files:**
- Delete: `src/components/sections/starship/MiniRocket.tsx`
- Modify: `src/components/sections/StarshipCutaway.tsx`
- Modify: `docs/superpowers/plans/2026-07-25-starship-aesthetic-launch.md` (note en tête : mobile retiré — optionnel une ligne)

**Interfaces:**
- Produces: `StarshipCutaway` sans `MobileMethodPanel`, `MobileStepProgress`, `MOBILE_STEP_SHORT_LABELS` ; wrapper desktop `hidden xl:block` sur toute la section

- [ ] **Step 1: Remove mobile imports and components**

Delete from `StarshipCutaway.tsx`:
- import `MiniRocket`
- `MOBILE_STEP_SHORT_LABELS`
- `MobileStepProgress` function
- `MobileMethodPanel` function
- JSX `<MobileMethodPanel ... />`
- Unused imports: `ReadableSurface`, `Rocket` (if only used in mobile), `ChevronLeft`, `ChevronRight` (if only mobile)

- [ ] **Step 2: Desktop-only wrapper**

Change root return to wrap entire section:

```tsx
return (
  <Container as="section" className="hidden py-12 sm:py-16 lg:py-20 xl:block">
    ...
  </Container>
)
```

Remove redundant `hidden xl:block` on inner desktop panel div (now whole section is xl-only).

- [ ] **Step 3: Delete MiniRocket file**

```bash
rm src/components/sections/starship/MiniRocket.tsx
```

- [ ] **Step 4: Grep for MiniRocket references**

Run: `rg MiniRocket src/`
Expected: no matches

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections/StarshipCutaway.tsx src/components/sections/starship/
git commit -m "refactor(starship): suppression variante mobile (desktop xl+ uniquement)"
```

---

### Task 4: Verify, bump version, push

**Files:**
- Modify: `src/lib/site-version.ts`

- [ ] **Step 1: Bump version**

```typescript
export const SITE_VERSION = '0.18.2'
```

- [ ] **Step 2: Full verify**

Run: `pnpm verify`
Expected: PASS (all tests including new starship-svg tests)

- [ ] **Step 3: Commit and push**

```bash
git add src/lib/site-version.ts
git commit -m "chore: bump SITE_VERSION to 0.18.2"
git push -u origin cursor/starship-aesthetic-ecc9
```

---

## Self-Review

| Spec requirement | Task |
|---|---|
| Étages collés au lancement | Task 1 + 2 (`stacked` prop) |
| Voir la fusée décoller (pas juste pointillés) | Task 1 (hide line + no scatter) + Task 2 (portal stacked) |
| Supprimer version mobile | Task 3 |
| Desktop xl+ only | Task 3 |
| verify + version bump | Task 4 |

No placeholders detected.

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-07-25-starship-stacked-launch-no-mobile.md`.

**Subagent-Driven execution requested by user.**
