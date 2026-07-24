---
title: "fix: Hero responsive layout and text/image overlap"
date: 2026-07-24
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
deepened: false
---

# fix: Hero responsive layout and text/image overlap

## Goal Capsule

**Objective.** Fix the Hero header on `/` so the editorial title no longer gets clipped by the portrait image, and the text and image feel intertwined rather than split into two rigid columns.

**Stop when.** Hero displays harmoniously on mobile, tablet, laptop, and desktop; the title is fully readable; the image is integrated via gradient/mask effects; `pnpm verify` passes; `SITE_VERSION` bumped.

---

## Product Contract

### Requirements

- R1. The full name `Bertrand Fouquet` is readable on all viewports without clipping.
- R2. The portrait image is less dominant on desktop and blends with the text using gradients or masks.
- R3. The text and image must feel “intertwined” — no sharp vertical cut-off.
- R4. Mobile keeps the current portrait-below-text pattern but improved spacing.
- R5. No new heavy UI libraries; only Tailwind CSS and existing primitives.

### Scope Boundaries

- In scope: `src/components/sections/Hero.tsx`, `src/components/ui/EditorialTitle.tsx` (optional responsive override), `SITE_VERSION` bump.
- Out of scope: changing the portrait asset, changing the sidebar, changing other pages.

---

## Planning Contract

### Key Technical Decisions

- KTD1. Replace the rigid `42%/58%` split with a single flexible container where the portrait sits as a full-height background layer on the right and the text column uses a readable surface with a left-to-right gradient mask.
- KTD2. Reduce the editorial title size on `lg` viewports where the image is present; keep the large bleed style on `xl` where there is enough room.
- KTD3. Use a CSS `clip-path` / `mask-image` on the portrait side so it fades into the text column rather than a hard diagonal.
- KTD4. Add `lg:pl-[72px]` offset to the hero content so it clears the fixed sidebar.

### Alternative Approaches Considered

| Approach | Why not |
|---|---|
| Keep 42/58 split and only shrink title | Still leaves a hard cut and cramped text. |
| Move image below text on all non-mobile | Loses the visual impact the user wants. |
| Use a two-column grid with overlap | More complex; background-layer approach is simpler and gives the same intertwined effect. |

---

## Implementation Units

### U1. Refactor Hero layout for intertwined text + portrait

**Goal:** Make the hero text readable and the portrait integrated via gradient/mask.

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Optional: `src/components/ui/EditorialTitle.tsx` (add responsive class override prop)

**Approach:**
- Wrap the whole hero in a relative container with a full-bleed background image layer on the right (portrait) that fades to transparent on the left.
- Make the text column `lg:w-[55%] xl:w-[50%]` with a readable surface and a strong left-to-right gradient overlay.
- Add `lg:pl-[72px]` to the content wrapper to account for the fixed sidebar.
- Change the mobile portrait block to a more contained aspect ratio and add a top fade.
- Keep the existing animations and accessibility attributes.

**Test scenarios:**
- Viewport 375px: title fits, portrait below text, no horizontal scroll.
- Viewport 768px: title fits, portrait may still be below or as background depending on chosen breakpoint.
- Viewport 1024px: title not clipped, text overlays the fading edge of the portrait.
- Viewport 1440px: airy layout, image integrated, title large but readable.

**Verification:** Manual browser inspection at 375, 768, 1024, 1440px; no clipped text; `pnpm verify` green.

---

### U2. Bump SITE_VERSION and verify

**Goal:** Mark the UI fix and pass the PR gate.

**Files:**
- Modify: `src/lib/site-version.ts` (0.14.2 → 0.14.3)

**Verification:** `pnpm verify` passes.
