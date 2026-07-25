# Fusée — Esthétique & animation de lancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrichir visuellement la fusée interactive (accueil, section `StarshipCutaway`) et la séquence de lancement desktop : pad blueprint, profondeur SVG, idle float, countdown premium, flamme multicouche, overlay mission avant redirect — plus mini-fusée mobile.

**Architecture:** Découper `StarshipCutaway.tsx` en sous-modules (`starship/`) : hook `useLaunchSequence` testable, composants `LaunchPad`, `LaunchEffects`, `StarshipSvg`, `MiniRocket`. Styles namespacés `.starship-*` dans `styles.css`. Framer Motion pour animations ; `prefers-reduced-motion` → redirect immédiat inchangé.

**Tech Stack:** Next.js 16, React 19, Framer Motion, Tailwind CSS v4 tokens, Vitest, TypeScript.

## Global Constraints

- Palette : `--accent` `#ff6b1a`, `--accent-soft` `#ffc266`, `--accent-glow`, ivoire `#f8f4ef`, `--background` `#0a0a0a`
- Fusée desktop + bouton Lancer : viewport `xl+` (≥ 1280px) uniquement
- Mobile : mini-fusée SVG + barre d'étapes existante (pas de lancement mobile)
- `useReducedMotion()` : pas d'animation, `router.push('/contact')` direct
- Pas de lib UI lourde ; lucide-react OK
- `SITE_VERSION` bump → **0.18.0** à la fin
- Branche : `cursor/starship-aesthetic-ecc9`
- Gate : `pnpm verify`

## File Structure

| File | Responsibility |
|---|---|
| `src/components/sections/starship/useLaunchSequence.ts` | État countdown → ignition → liftoff → mission → redirect |
| `src/components/sections/starship/LaunchPad.tsx` | Grille blueprint + ombre pad + conteneur fusée |
| `src/components/sections/starship/LaunchEffects.tsx` | Countdown ring, fumée, flamme multicouche, flash |
| `src/components/sections/starship/StarshipSvg.tsx` | SVG fusée (gradients, glow, numéros étage) |
| `src/components/sections/starship/MiniRocket.tsx` | Silhouette mobile 5 étages |
| `src/components/sections/starship/constants.ts` | Couleurs SVG, SLICE_BOUNDS, timings |
| `src/components/sections/StarshipCutaway.tsx` | Orchestration, export public |
| `src/app/(frontend)/styles.css` | `.starship-*` |
| `tests/int/starship-launch.int.spec.ts` | Tests hook |

---

### Task 1: Hook `useLaunchSequence` + tests

**Files:**
- Create: `src/components/sections/starship/useLaunchSequence.ts`
- Create: `src/components/sections/starship/constants.ts`
- Create: `tests/int/starship-launch.int.spec.ts`
- Test: `tests/int/starship-launch.int.spec.ts`

**Interfaces:**
- Produces: `useLaunchSequence({ onComplete, reduceMotion })` → `{ phase, countdown, isLaunching, isIgniting, isMission, handleLaunch, launchDisabled }`
- `LaunchPhase` = `'idle' | 'countdown' | 'ignition' | 'liftoff' | 'mission'`

- [ ] **Step 1: Write constants**

```typescript
// src/components/sections/starship/constants.ts
export const COUNTDOWN_TICK_MS = 900
export const IGNITION_MS = 500
export const LIFTOFF_MS = 2200
export const MISSION_MS = 450
export const COUNTDOWN_START = 3

export type LaunchPhase = 'idle' | 'countdown' | 'ignition' | 'liftoff' | 'mission'
```

- [ ] **Step 2: Write failing tests**

```typescript
// tests/int/starship-launch.int.spec.ts
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLaunchSequence } from '@/components/sections/starship/useLaunchSequence'

describe('useLaunchSequence', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts countdown on handleLaunch', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useLaunchSequence({ onComplete, reduceMotion: false }))
    act(() => result.current.handleLaunch())
    expect(result.current.phase).toBe('countdown')
    expect(result.current.countdown).toBe(3)
  })

  it('reduceMotion calls onComplete immediately', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useLaunchSequence({ onComplete, reduceMotion: true }))
    act(() => result.current.handleLaunch())
    expect(onComplete).toHaveBeenCalledOnce()
    expect(result.current.phase).toBe('idle')
  })

  it('progresses countdown to ignition then liftoff', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useLaunchSequence({ onComplete, reduceMotion: false }))
    act(() => result.current.handleLaunch())
    act(() => vi.advanceTimersByTime(900 * 3))
    expect(result.current.phase).toBe('ignition')
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.phase).toBe('liftoff')
    act(() => vi.advanceTimersByTime(2200))
    expect(result.current.phase).toBe('mission')
    act(() => vi.advanceTimersByTime(450))
    expect(onComplete).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 3: Run test — expect FAIL**

Run: `pnpm exec vitest run tests/int/starship-launch.int.spec.ts`
Expected: FAIL module not found

- [ ] **Step 4: Implement hook**

```typescript
// src/components/sections/starship/useLaunchSequence.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  COUNTDOWN_START,
  COUNTDOWN_TICK_MS,
  IGNITION_MS,
  LIFTOFF_MS,
  MISSION_MS,
  type LaunchPhase,
} from './constants'

type UseLaunchSequenceOptions = {
  onComplete: () => void
  reduceMotion: boolean | null
}

export function useLaunchSequence({ onComplete, reduceMotion }: UseLaunchSequenceOptions) {
  const [phase, setPhase] = useState<LaunchPhase>('idle')
  const [countdown, setCountdown] = useState<number | null>(null)

  const handleLaunch = useCallback(() => {
    if (phase !== 'idle') return
    if (reduceMotion) {
      onComplete()
      return
    }
    setPhase('countdown')
    setCountdown(COUNTDOWN_START)
  }, [onComplete, phase, reduceMotion])

  useEffect(() => {
    if (phase !== 'countdown' || countdown === null) return
    const timer = window.setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1)
        return
      }
      setCountdown(null)
      setPhase('ignition')
    }, COUNTDOWN_TICK_MS)
    return () => window.clearTimeout(timer)
  }, [countdown, phase])

  useEffect(() => {
    if (phase !== 'ignition') return
    const timer = window.setTimeout(() => setPhase('liftoff'), IGNITION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'liftoff') return
    const timer = window.setTimeout(() => setPhase('mission'), LIFTOFF_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'mission') return
    const timer = window.setTimeout(() => {
      onComplete()
      setPhase('idle')
    }, MISSION_MS)
    return () => window.clearTimeout(timer)
  }, [onComplete, phase])

  return {
    phase,
    countdown,
    isLaunching: phase === 'liftoff',
    isIgniting: phase === 'ignition',
    isMission: phase === 'mission',
    handleLaunch,
    launchDisabled: phase !== 'idle',
  }
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `pnpm exec vitest run tests/int/starship-launch.int.spec.ts`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/starship/constants.ts src/components/sections/starship/useLaunchSequence.ts tests/int/starship-launch.int.spec.ts
git commit -m "feat(starship): hook useLaunchSequence avec phases countdown→mission"
```

---

### Task 2: Styles blueprint pad + namespace CSS

**Files:**
- Modify: `src/app/(frontend)/styles.css`
- Create: `src/components/sections/starship/LaunchPad.tsx`

**Interfaces:**
- Produces: `LaunchPad({ children, phase, className })`

- [ ] **Step 1: Add CSS block** (after `.experience-timeline` section)

```css
/* Starship — pad blueprint & effets */
.starship-pad {
  position: relative;
  isolation: isolate;
  padding: 1.75rem 1.25rem 2rem;
  border-radius: 1.25rem;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.04) 0%, transparent 42%),
    radial-gradient(ellipse 80% 55% at 50% 100%, var(--accent-glow), transparent 68%);
}

.starship-pad::before {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0.75rem;
  border-radius: 0.85rem;
  background-image:
    linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: radial-gradient(ellipse 85% 75% at 50% 45%, black 20%, transparent 78%);
  opacity: 0.85;
}

.starship-pad__shadow {
  pointer-events: none;
  position: absolute;
  bottom: 0.35rem;
  left: 50%;
  z-index: 0;
  width: 62%;
  height: 0.85rem;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgb(0 0 0 / 0.55);
  filter: blur(10px);
}

.starship-pad--shake {
  animation: starship-pad-shake 0.18s ease-in-out infinite;
}

@keyframes starship-pad-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.starship-countdown-ring {
  position: absolute;
  left: 50%;
  top: 0.5rem;
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.starship-countdown-ring__pulse {
  position: absolute;
  inset: -0.75rem;
  border-radius: 999px;
  border: 2px solid color-mix(in srgb, var(--accent-soft) 55%, transparent);
  animation: starship-ring-pulse 0.9s ease-out infinite;
}

@keyframes starship-ring-pulse {
  0% { transform: scale(0.85); opacity: 0.9; }
  100% { transform: scale(1.35); opacity: 0; }
}

.starship-mission-overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
  background: rgb(10 10 14 / 0.72);
  backdrop-filter: blur(6px);
}
```

- [ ] **Step 2: Create LaunchPad.tsx**

```tsx
'use client'

import { cn } from '@/lib/utils'
import type { LaunchPhase } from './constants'

type LaunchPadProps = {
  children: React.ReactNode
  phase: LaunchPhase
  className?: string
}

export function LaunchPad({ children, phase, className }: LaunchPadProps) {
  const shaking = phase === 'countdown' || phase === 'ignition'

  return (
    <div className={cn('starship-pad', shaking && 'starship-pad--shake', className)}>
      <span aria-hidden className="starship-pad__shadow" />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/styles.css src/components/sections/starship/LaunchPad.tsx
git commit -m "feat(starship): pad blueprint CSS et composant LaunchPad"
```

---

### Task 3: Refonte SVG — profondeur, glow, numéros

**Files:**
- Create: `src/components/sections/starship/StarshipSvg.tsx`
- Move logic from: `src/components/sections/StarshipCutaway.tsx` (RocketSlice, StarshipSvg)

**Interfaces:**
- Produces: `StarshipSvg({ activeStage, isLaunching, isIgniting, onSelect })`

- [ ] **Step 1: Move StarshipSvg + RocketSlice to new file**

Add SVG `<defs>` with gradients:

```tsx
<defs>
  <linearGradient id="starship-body-fill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="rgb(255 107 26 / 0.22)" />
    <stop offset="100%" stopColor="rgb(153 27 27 / 0.08)" />
  </linearGradient>
  <filter id="starship-active-glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="4" result="blur" />
    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
</defs>
```

- Active slice rect uses `filter="url(#starship-active-glow)"` when active
- Add stage numbers `01`–`05` at x=168, y centered per SLICE_BOUNDS
- `isIgniting` prop: brief `scale(0.98)` on motion.g via parent wrapper

- [ ] **Step 2: Idle float** — in StarshipCutaway wrap StarshipSvg:

```tsx
<motion.div
  animate={
    phase === 'liftoff' ? { y: [0, -48], opacity: [1, 0], filter: ['blur(0px)', 'blur(2px)'] }
    : phase === 'countdown' || phase === 'ignition' ? { y: [-1.5, 1.5, -1.5] }
    : { y: [0, -3, 0] }
  }
  transition={
    phase === 'idle'
      ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
      : phase === 'countdown' || phase === 'ignition'
        ? { duration: 0.18, repeat: Infinity, ease: 'easeInOut' }
        : { duration: 2.2, ease: 'easeIn' }
  }
>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/starship/StarshipSvg.tsx
git commit -m "feat(starship): SVG profondeur, glow étage actif, numéros blueprint"
```

---

### Task 4: LaunchEffects — countdown, flamme, fumée, flash

**Files:**
- Create: `src/components/sections/starship/LaunchEffects.tsx`

**Interfaces:**
- Consumes: `phase`, `countdown` from hook
- Produces: `LaunchEffects({ phase, countdown })`

- [ ] **Step 1: Implement LaunchEffects**

Components inside:
- `CountdownOverlay` — ring pulse + Syne 6xl number + label `T−{n}`
- `IgnitionFlash` — full-area orange flash `opacity 0→0.35→0` 500ms when phase===ignition
- `ExhaustPlume` — 3 layered motion.div (white core 20×80, orange 36×120, smoke 56×160 blur)
- `SmokeParticles` — 4 small circles animating up during countdown

- [ ] **Step 2: Wire in StarshipCutaway desktop column**

Replace inline AnimatePresence blocks with `<LaunchEffects phase={phase} countdown={countdown} />`

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/starship/LaunchEffects.tsx src/components/sections/StarshipCutaway.tsx
git commit -m "feat(starship): effets lancement — countdown ring, ignition, flamme multicouche"
```

---

### Task 5: Mission overlay + intégration hook

**Files:**
- Modify: `src/components/sections/StarshipCutaway.tsx`

- [ ] **Step 1: Replace local state with useLaunchSequence**

```tsx
const router = useRouter()
const reduceMotion = useReducedMotion()
const { phase, countdown, handleLaunch, launchDisabled, isLaunching, isIgniting, isMission } =
  useLaunchSequence({
    reduceMotion,
    onComplete: () => router.push('/contact'),
  })
```

Remove old `useState`/`useEffect` for countdown/liftoff.

- [ ] **Step 2: Mission overlay JSX**

```tsx
<AnimatePresence>
  {isMission ? (
    <motion.div
      animate={{ opacity: 1 }}
      className="starship-mission-overlay"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <div className="text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--accent-soft)] uppercase">
          Mission
        </p>
        <p className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--foreground)]">
          Cap sur le contact
        </p>
      </div>
    </motion.div>
  ) : null}
</AnimatePresence>
```

- [ ] **Step 3: Camera follow on pad** — wrap LaunchPad:

```tsx
<motion.div animate={phase === 'liftoff' ? { y: -24 } : { y: 0 }} transition={{ duration: 2.2, ease: 'easeIn' }}>
  <LaunchPad phase={phase}>...</LaunchPad>
</motion.div>
```

- [ ] **Step 4: RocketSlice liftoff rotation** — in StarshipSvg when isLaunching, add `rotate: index % 2 === 0 ? -4 : 4` to animate

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/StarshipCutaway.tsx
git commit -m "feat(starship): overlay mission + hook intégré + camera follow"
```

---

### Task 6: Mini-fusée mobile

**Files:**
- Create: `src/components/sections/starship/MiniRocket.tsx`
- Modify: `MobileMethodPanel` in `StarshipCutaway.tsx`

- [ ] **Step 1: MiniRocket component**

SVG viewBox `0 0 48 200`, 5 segments stacked, active segment fill `var(--accent)` opacity 0.35, stroke accent when active.

```tsx
export function MiniRocket({ activeStage }: { activeStage: number }) {
  const segments = [36, 36, 40, 40, 48] // heights
  // map with y offsets, highlight activeStage
}
```

- [ ] **Step 2: Insert above MobileStepProgress**

```tsx
<div className="flex justify-center pb-4">
  <MiniRocket activeStage={activeStage} />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/starship/MiniRocket.tsx src/components/sections/StarshipCutaway.tsx
git commit -m "feat(starship): mini-fusée mobile avec étage actif surligné"
```

---

### Task 7: Gate finale + version

**Files:**
- Modify: `src/lib/site-version.ts` → `0.18.0`

- [ ] **Step 1: Run verify**

Run: `pnpm verify`
Expected: PASS

- [ ] **Step 2: Commit + push**

```bash
git add src/lib/site-version.ts
git commit -m "chore: bump SITE_VERSION → 0.18.0"
git push -u origin cursor/starship-aesthetic-ecc9
```

---

## Self-Review Checklist

| Spec | Task |
|---|---|
| Pad blueprint + ombre | Task 2 |
| Gradients + glow SVG | Task 3 |
| Idle float | Task 3 |
| Countdown ring + vibration | Task 2, 4 |
| Ignition flash + compression | Task 4, 5 |
| Flamme multicouche | Task 4 |
| Camera follow liftoff | Task 5 |
| Mission overlay before redirect | Task 1, 5 |
| Mini fusée mobile | Task 6 |
| reduced-motion | Task 1 |
| SITE_VERSION 0.18.0 | Task 7 |

## Execution Handoff

Plan saved. Use **subagent-driven-development** — one implementer subagent per task, review between tasks.
