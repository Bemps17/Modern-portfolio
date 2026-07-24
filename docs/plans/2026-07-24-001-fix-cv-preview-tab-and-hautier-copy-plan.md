---
title: "fix: CV preview new tab and Hautier copy"
date: 2026-07-24
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
deepened: false
---

# fix: CV preview new tab and Hautier copy

## Goal Capsule

**Objective.** Make « Visualiser » show the CV reliably (new browser tab with inline PDF), and correct the Sonotra/PAPREC experience so « Groupe Hautier » appears only on the charged-de-projet mission at Transports Hautier.

**Authority.** This plan; repo rules in `AGENTS.md` / `docs/DEVELOPMENT.md` (CMS-first, demo mode, Local API).

**Stop when.** Preview opens a usable PDF in a new tab; share/download unchanged; fallback (+ seeded CMS when re-seeded) shows Sonotra/PAPREC without Groupe Hautier branding; `SITE_VERSION` bumped; verify green.

---

## Product Contract

### Summary

Fix broken in-modal PDF preview by opening the existing preview URL in a new tab, and correct one experience copy error that flows into both the about page and the generated CV.

### Requirements

- R1. « Visualiser » opens the CV PDF in a new browser tab at `/api/cv?preview=1` (inline disposition already implemented).
- R2. The broken preview modal/iframe path is removed so users are not left with an empty, non-scrollable dialog.
- R3. Share and Download actions keep current behavior (share modal + attachment download).
- R4. Experience « Agent de planning & Assistant d’exploitation » uses company **Sonotra / PAPREC La Rochelle** only — no « Groupe Hautier » in company or description.
- R5. Experience « Chargé de projet informatique embarquée » at **Transports Hautier** keeps its Hautier affiliation (Groupe/Transports Hautier context stays there only).
- R6. Demo mode stays valid: content change lives in `portfolio-fallback` (seed syncs from it).

### Actors

- A1. Visitor on `/a-propos` using CV actions.
- A2. Recruiter opening the shared/preview PDF URL.
- A3. Site owner editing experiences in Payload (optional re-seed after fallback change).

### Key Flows

- F1. Visualiser → new tab → browser native PDF viewer scrolls and displays the page.
- F2. Partager / Télécharger unchanged.
- F3. About timeline + generated CV both reflect corrected Sonotra/PAPREC company copy.

### Acceptance Examples

- AE1. Click Visualiser: a new tab opens; PDF is visible and scrollable (or zoomable via the browser viewer). No empty preview modal.
- AE2. About page and `/api/cv` text show Sonotra/PAPREC without « Groupe Hautier »; Transports Hautier entry still present for charged-de-projet.
- AE3. Download still forces attachment; preview URL still uses `Content-Disposition: inline`.

### Scope Boundaries

**In scope**

- `CvActions` Visualiser behavior and removal of preview modal UI.
- Copy fix on the fused Sonotra/PAPREC experience in fallback (and seed when run).
- Version bump for the ship.

**Out of scope**

- Fullscreen modal redesign as primary preview (rejected in favor of new tab).
- Rework of PDF layout, share channels, or CSP/header policy for iframe embedding.
- Splitting Sonotra and PAPREC into two experience documents.
- Changing Transports Hautier charged-de-projet copy beyond leaving it as the Hautier mission.

### Deferred to Follow-Up Work

- If production Neon already has the old company string and seed is not re-run, a one-off admin edit or seed on that environment.

---

## Planning Contract

### Assumptions

- Blank/non-scrollable modal is primarily an embedding UX failure (PDF in iframe inside `overflow-hidden` / constrained modal), not a broken `/api/cv` route — the route already returns PDF with `preview=1` → inline.
- Same-origin framing is allowed (`X-Frame-Options: SAMEORIGIN`, `frame-ancestors 'self'`), so CSP is not the primary fix target once we abandon iframe preview.
- Seed script `scripts/seed-portfolio.ts` syncs experiences from `portfolio-fallback`; updating fallback is the source of truth for demo and for environments that re-seed.
- Production CMS may lag until seed/admin update — document in verification notes, do not block the code change.

### Key Technical Decisions

- KTD1. Visualiser opens `/api/cv?preview=1` in a new tab (`target=_blank` / `window.open` with `noopener,noreferrer`) and drops the preview Modal + iframe. `(session-settled: user-directed — chosen over fullscreen modal: native PDF viewer in a new tab is reliable and matches the user’s preferred UX)`
- KTD2. Keep using the existing `preview=1` inline disposition; do not invent a separate HTML preview page.
- KTD3. Content edit only on the Sonotra/PAPREC experience: company → `Sonotra / PAPREC La Rochelle`; rewrite description to drop Groupe Hautier branding while keeping the two-mission (PAPREC planning + Sonotra exploitation) narrative.
- KTD4. Leave Transports Hautier experience as the sole Hautier-group mission for charged-de-projet.
- KTD5. Bump `SITE_VERSION` (patch or minor) for this notable UX + content ship.

### Product Contract preservation

Product Contract created in this bootstrap (no upstream brainstorm). Unchanged relative to user request.

### Alternative Approaches Considered

| Approach | Why not |
|---|---|
| Fullscreen modal + iframe/embed | User preferred new tab; iframe PDF paint/scroll remains fragile. |
| Fix iframe only (CSP / overflow / object tag) | Possible mitigation but weaker reliability than native tab viewer; conflicts with settled choice. |
| Separate HTML CV page | Extra surface; PDF is already the share/download artifact. |

---

## Implementation Units

### U1. Visualiser opens CV in a new tab

**Goal:** Replace broken modal preview with a reliable new-tab open of the inline PDF.

**Requirements:** R1, R2, R3, AE1, AE3

**Dependencies:** None

**Files:**

- Modify: `src/components/sections/CvActions.tsx`
- Test: `tests/int/cv-api.int.spec.ts` (keep/extend inline preview contract; no need for React component DOM suite unless the repo already patterns client tests — prefer API regression + smoke note)
- Optional smoke: manual on `/a-propos` if e2e not extended

**Approach:**

- Remove `previewOpen` state and the preview `Modal` (iframe block).
- On Visualiser click: open `/api/cv?preview=1` in a new tab; drop `aria-pressed` tied to modal open (or remove pressed state for Visualiser).
- Keep Share modal and Download as today.
- Prefer `window.open(url, '_blank', 'noopener,noreferrer')` or an `<a target="_blank" rel="noopener noreferrer">` styled as the existing button — either is fine if a11y label « Visualiser le CV » remains.

**Patterns to follow:** Existing download anchor pattern in the same file; share options already use `target="_blank"`.

**Execution note:** Prefer runtime smoke of Visualiser in the browser after the change; unit coverage stays on the API inline contract.

**Test scenarios:**

- Happy path: GET `/api/cv?preview=1` returns 200, `Content-Type: application/pdf`, `Content-Disposition` contains `inline`.
- Happy path: GET `/api/cv` (no preview) still uses `attachment`.
- Edge: Visualiser no longer mounts an iframe pointing at `/api/cv` (code review / grep).
- Integration: Opening preview URL in a top-level tab shows PDF (manual or Playwright if cheap).

**Verification:** Visualiser opens a new tab with a visible PDF; no empty preview dialog; share/download still work.

---

### U2. Correct Sonotra / PAPREC experience copy

**Goal:** Remove erroneous Groupe Hautier branding from the fused planning/exploitation mission.

**Requirements:** R4, R5, R6, AE2

**Dependencies:** None (can parallel U1)

**Files:**

- Modify: `src/data/portfolio-fallback.ts` (experience id 3 company + description)
- Note only: `scripts/seed-portfolio.ts` already syncs from fallback — no structural change unless a hard-coded string appears (it should not)
- Test: extend an existing content/CV mapping test **only if** one already asserts this company string; otherwise add a focused assertion in a small unit/int test that reads fallback experiences (or assert via `getCvDocumentData` / demo path that PDF/build data excludes « Groupe Hautier » for that role). Prefer `tests/int/cv-build-data.int.spec.ts` or a thin fallback content check if that stays lightweight.

**Approach:**

- Company: `Sonotra / PAPREC La Rochelle` (drop `— Groupe Hautier`).
- Description: keep PAPREC agent de planning + Sonotra assistant d’exploitation; remove « (Groupe Hautier) » / ecosystem-Hautier phrasing.
- Do not edit Transports Hautier charged-de-projet entry except to ensure it remains the Hautier mission.

**Patterns to follow:** Existing experience objects in `portfolio-fallback.ts`; CMS-first — no hard-coded marketing copy in page components.

**Test scenarios:**

- Happy path: fallback experience for that title has company without `Groupe Hautier`.
- Happy path: description does not contain `Groupe Hautier`.
- Happy path: Transports Hautier charged-de-projet experience still present with company containing `Hautier`.
- Integration (demo): `getCvDocumentData` / rendered experiences list reflects the corrected company when Payload is not configured.

**Verification:** About timeline and generated CV show corrected company; Hautier remains only on charged-de-projet.

---

### U3. Version bump and verify gate

**Goal:** Mark the delivery and pass repo quality gates.

**Requirements:** ship checklist from `AGENTS.md`

**Dependencies:** U1, U2

**Files:**

- Modify: `src/lib/site-version.ts` (e.g. `0.14.0` → `0.14.1` or `0.15.0` — patch is enough for fix+copy)

**Approach:** Bump version; run `pnpm verify` (and precommit Payload suite if required by hooks).

**Test expectation:** none — version string only; covered by verify.

**Verification:** Footer shows new version; verify passes; no secrets in diff.

---

## Verification Contract

- Keep API tests for attachment vs `preview=1` inline in `tests/int/cv-api.int.spec.ts`.
- Add or extend a content assertion for the Sonotra/PAPREC company string (U2).
- Manual smoke: `/a-propos` → Visualiser → new tab PDF visible; Partager/Télécharger OK.
- Gate: `pnpm verify` before push.
- If targeting a live Neon with stale experience rows: run `pnpm seed:portfolio` or edit Experiences in `/admin` after deploy.

---

## Definition of Done

- [ ] U1: Visualiser opens new tab; preview modal/iframe gone; share/download intact.
- [ ] U2: Sonotra/PAPREC copy corrected; Transports Hautier charged-de-projet unchanged as Hautier mission.
- [ ] U3: `SITE_VERSION` bumped; `pnpm verify` green.
- [ ] AE1–AE3 satisfied.
- [ ] Scope limited; no secrets; demo mode unbroken.

---

## Risks & Dependencies

| Risk | Mitigation |
|---|---|
| Popup blockers on `window.open` from non-user-gesture | Use click handler directly (user gesture) or `<a target="_blank">`. |
| Stale Neon CMS copy after fallback fix | Document re-seed / admin edit; seed already maps fallback → experiences. |
| Browser still downloads instead of previewing | Already covered by `preview=1` inline tests; re-check headers if regression. |

---

## Sources & Research

- `src/components/sections/CvActions.tsx` — modal + iframe preview (`h-[70vh] overflow-hidden`).
- `src/components/ui/Modal.tsx` — dialog `overflow-hidden`, body scroll lock.
- `src/app/api/cv/route.ts` — `preview=1` → inline disposition.
- `next.config.ts` — `X-Frame-Options: SAMEORIGIN`, CSP `frame-ancestors 'self'` (iframe same-origin allowed; not sufficient for reliable PDF UX).
- `src/data/portfolio-fallback.ts` — erroneous `Sonotra / PAPREC … — Groupe Hautier`.
- `scripts/seed-portfolio.ts` — syncs experiences from fallback.
- Prior plans: `docs/superpowers/plans/2026-07-24-cv-actions-and-layout.md` (modal/iframe approach being superseded for Visualiser only).
