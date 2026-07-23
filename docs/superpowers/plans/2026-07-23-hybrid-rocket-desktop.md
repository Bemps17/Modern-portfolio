# Fusée hybride desktop — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer la fusée desktop par un visuel hybride rétro-technique original, propre, avec lancement lent et fumée.

**Architecture:** Refonte du SVG dans `StarshipCutaway.tsx` : silhouette symétrique, damier orange/ivoire, modules alignés. Séquence de lancement plus lente (compte à rebours, fumée, décollage). Mobile/tablette inchangés (diaporama).

**Tech Stack:** Next.js 16, React, Framer Motion, Tailwind CSS, TypeScript.

## Global Constraints

- Couleurs : `--accent` (#ff6b1a), `--accent-soft` (#ffc266), ivoire `#f8f4ef`
- Fusée et bouton Lancer uniquement `xl+` (≥ 1280px)
- `prefers-reduced-motion` : pas d'animation, redirection immédiate
- `SITE_VERSION` bumpé à 0.11.0
- Pas de reproduction d'un visuel existant (Tintin/Starship) — design original

---

### Task 1: Refonte du SVG fusée hybride

**Files:**
- Modify: `src/components/sections/StarshipCutaway.tsx` (fonction `StarshipSvg`)
- Modify: `src/lib/project-cutaway.ts` (libellés `blueprintTag`)

**Interfaces:**
- Produces: `StarshipSvg({ activeStage, isLaunching, onSelect })` inchangé

- [ ] **Step 1: Mettre à jour les libellés blueprintTag**

Dans `src/lib/project-cutaway.ts`, remplacer les `blueprintTag` par : `OGIVE / BRIEF`, `ÉTAGE 1 / UX`, `ÉTAGE 2 / UI`, `MOTEURS / CODE`, `BASE / SHIP`.

- [ ] **Step 2: Refondre la fonction StarshipSvg**

Remplacer tout le corps de `StarshipSvg` par un SVG `viewBox="0 0 240 560"` :
- Ogive arrondie (path courbe) en haut, y 20→90
- Corps cylindrique rectiligne x 90→150, y 90→440
- 4 ailerons trapézoïdaux en bas (2 gauche, 2 droite)
- Base moteur y 440→500 avec 3 buses
- Hublots alignés horizontalement à y~140 (3 cercles espacés régulièrement)
- Joints horizontaux à y 200, 280, 360
- Damier orange/ivoire 4×2 cases sur la zone y 90→170 (haut du corps)
- Damier orange/ivoire sur les ailerons
- Pas d'annotations texte décoratives
- `RocketSlice` conserve sa logique de spread

- [ ] **Step 3: Ajuster SLICE_BOUNDS**

```ts
const SLICE_BOUNDS = [
  { y: 20, h: 70 },   // ogive
  { y: 90, h: 80 },   // étage 1 (hublots + damier)
  { y: 170, h: 90 },  // étage 2
  { y: 260, h: 90 },  // moteurs
  { y: 350, h: 160 }, // base + ailerons
] as const
```

- [ ] **Step 4: Réduire LAYER_SPREAD à 18**

Espacement modéré pour garder une silhouette lisible.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/StarshipCutaway.tsx src/lib/project-cutaway.ts
git commit -m "feat(home): refonte SVG fusée hybride rétro-technique"
```

---

### Task 2: Séquence de lancement lente avec fumée

**Files:**
- Modify: `src/components/sections/StarshipCutaway.tsx` (`handleLaunch`, JSX desktop)

**Interfaces:**
- Produces: séquence visuelle 2.8s avant redirection

- [ ] **Step 1: Ajouter un état countdown**

```ts
const [countdown, setCountdown] = useState<number | null>(null)
```

- [ ] **Step 2: Refondre handleLaunch**

```ts
const handleLaunch = useCallback(() => {
  if (isLaunching) return
  if (reduceMotion) { router.push('/contact'); return }

  setCountdown(3)
  const tick = window.setInterval(() => {
    setCountdown((c) => {
      if (c === null || c <= 1) {
        window.clearInterval(tick)
        setIsLaunching(true)
        window.setTimeout(() => router.push('/contact'), 1800)
        return null
      }
      return c - 1
    })
  }, 700)
}, [isLaunching, reduceMotion, router])
```

- [ ] **Step 3: Afficher le compte à rebours**

Dans le bloc desktop, ajouter au-dessus de la fusée :
```tsx
<AnimatePresence>
  {countdown !== null ? (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="absolute left-1/2 top-8 z-20 -translate-x-1/2 font-[family-name:var(--font-syne)] text-6xl font-bold text-[var(--accent-soft)]"
      exit={{ opacity: 0, scale: 1.4 }}
      initial={{ opacity: 0, scale: 0.6 }}
      key={countdown}
    >
      {countdown}
    </motion.div>
  ) : null}
</AnimatePresence>
```

- [ ] **Step 4: Épaissir la fumée au lancement**

Remplacer le bloc `isLaunching` existant par une fumée plus large et progressive :
```tsx
<motion.div
  animate={{ opacity: [0, 0.9, 1, 0.8], scaleY: [0.3, 0.9, 1.4, 1.8], scaleX: [0.6, 1, 1.3, 1.6] }}
  className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-32 w-32 -translate-x-1/2 rounded-full bg-gradient-to-t from-white/80 via-[var(--accent-soft)]/60 to-transparent blur-2xl"
  initial={{ opacity: 0 }}
  transition={{ duration: 1.8, ease: 'easeOut' }}
/>
```

- [ ] **Step 5: Tremblement discret**

Sur le `motion.div` de la fusée, ajouter pendant le lancement :
```ts
animate={isLaunching ? { y: [-2, 2, -2, 0, -32], opacity: [1, 1, 0.9, 0.7, 0] } : { y: 0, opacity: 1 }}
transition={isLaunching ? { duration: 1.8, ease: 'easeIn' } : { duration: 0.3 }}
```

- [ ] **Step 6: Typecheck et build**

Run: `pnpm typecheck && pnpm build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/StarshipCutaway.tsx
git commit -m "feat(home): lancement lent avec compte à rebours et fumée"
```

---

### Task 3: Nettoyage du panneau desktop et version

**Files:**
- Modify: `src/components/sections/StarshipCutaway.tsx` (JSX desktop)
- Modify: `src/lib/site-version.ts`

- [ ] **Step 1: Alléger le panneau desktop**

Supprimer le fond pointillé blueprint et les annotations `STARSHIP CUTAWAY / SCALE / REV`. Remplacer par un fond sobre `bg-[var(--background-elevated)]` avec une bordure `--border`.

- [ ] **Step 2: Bumper la version**

```ts
export const SITE_VERSION = '0.11.0'
```

- [ ] **Step 3: Vérifier build**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: Commit et push**

```bash
git add src/components/sections/StarshipCutaway.tsx src/lib/site-version.ts
git commit -m "feat(home): panneau desktop sobre + version 0.11.0"
git push origin main
```

---

### Task 4: Test visuel desktop et mobile

- [ ] **Step 1: Démarrer le dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Tester desktop xl (1280px+)**

Vérifier : silhouette propre, hublots alignés, damier orange/ivoire, clic sur étapes, séparation modérée, lancement lent avec compte à rebours + fumée + redirection `/contact`.

- [ ] **Step 3: Tester mobile 375px et tablette 1024px**

Vérifier : diaporama seule, aucune fusée, aucun bouton Lancer.

- [ ] **Step 4: Tester prefers-reduced-motion**

Activer reduced motion, cliquer Lancer → redirection immédiate vers `/contact`.

- [ ] **Step 5: Capturer artifacts**

Screenshot desktop fusée + screenshot mobile diaporama.
