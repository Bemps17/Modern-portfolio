# Tab bar mobile — icônes seules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supprimer les libellés texte de la BottomTabBar mobile (5 onglets) — icônes uniquement, avec `aria-label` pour l’accessibilité.

**Architecture:** Modifier `BottomTabBar.tsx` : retirer le `<span>{label}</span>`, ajouter `aria-label={label}` sur chaque `Link`, ajuster le layout (centrage icône, touch target ≥ 44px). Tests Vitest jsdom vérifient l’absence de texte visible et la présence des labels ARIA.

**Tech Stack:** React 19, Vitest, Testing Library, lucide-react, Framer Motion.

## Global Constraints

- Touch targets ≥ 44px (mobile)
- `aria-label` obligatoire sur chaque lien (remplace le texte visible)
- Pas de lib UI lourde
- Branche : `cursor/tabbar-icons-only-ecc9`
- `SITE_VERSION` bump → **0.19.3**
- Gate : `pnpm verify`

---

### Task 1: Tests TDD + implémentation BottomTabBar

**Files:**
- Modify: `tests/int/BottomTabBar.int.spec.tsx`
- Modify: `src/components/layout/BottomTabBar.tsx`
- Modify: `src/lib/site-version.ts`

**Interfaces:**
- Produces: `BottomTabBar({ journalNavLabel?: string })` — liens sans texte visible, `aria-label` = label

- [ ] **Step 1: Write failing tests**

```tsx
it('does not render visible tab labels', () => {
  render(<BottomTabBar journalNavLabel="Le Lablog" />)
  expect(screen.queryByText('Accueil')).toBeNull()
  expect(screen.queryByText('Le Lablog')).toBeNull()
})

it('exposes aria-label on each tab link', () => {
  render(<BottomTabBar journalNavLabel="Le Lablog" />)
  expect(screen.getByRole('link', { name: 'Accueil' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Le Lablog' })).toBeTruthy()
})
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `pnpm vitest run tests/int/BottomTabBar.int.spec.tsx --project jsdom-ui`

- [ ] **Step 3: Implement icons-only**

Remove label span, add aria-label, update classes for icon-only centering.

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit + verify**

Run: `pnpm verify`
