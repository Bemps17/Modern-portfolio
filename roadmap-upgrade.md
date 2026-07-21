# Audit & Roadmap-Upgrade — Modern Portfolio

> Audit technique complet (UI/UX/QoL, SEO, sécurité, design, qualité du code, perf/a11y) et
> feuille de route d'amélioration priorisée.
>
> **Stack auditée :** Next.js 16.2 (App Router) · React 19 · Payload CMS 3.86 · Postgres (Neon) · Tailwind v4 · Framer Motion · Vercel
> **Périmètre :** dépôt à l'état `main` — code applicatif (`src/`), config (`next.config.ts`, `vercel.json`, `middleware.ts`), contenu CMS (`src/collections`, `src/globals`).
> **Méthode :** lecture du code + `pnpm lint` + `pnpm typecheck` (les deux passent au vert), inspection des assets `public/` et des usages `next/image`.

---

## 1. Résumé exécutif

Le projet est **solide et bien structuré** : architecture CMS-first propre, mode démo sans base de données, séparation Server/Client Components, tokens CSS centralisés, tests d'intégration présents, `lint` + `typecheck` verts. La documentation interne (`AGENTS.md`, `docs/`) est au-dessus de la moyenne.

En revanche, **un bug critique bloque tout le front public** (voir 🔴 C1) et plusieurs chantiers d'accessibilité, de sécurité (CSP, rate-limit) et de SEO restent ouverts — plusieurs sont d'ailleurs déjà repérés comme cibles `🎯` dans `docs/DEVELOPMENT.md` mais non traités.

### Scoring par domaine

| Domaine | Note | Synthèse |
|---|:---:|---|
| Architecture / Code | 🟢 8/10 | Découpage clair, typé, testé ; quelques `as` non sûrs et duplications. |
| UI / UX / QoL | 🟡 6/10 | Riche visuellement, mais navigation clavier incomplète (skip link, focus trap). |
| Accessibilité | 🟠 5/10 | Bases présentes (reduced-motion, focus-visible) ; manques structurants. |
| SEO | 🟢 7/10 | Metadata + JSON-LD + sitemap OK ; canonicals et OG images à consolider. |
| Sécurité | 🟠 5/10 | Headers présents mais CSP permissive ; rate-limit non fiable en serverless. |
| Design system | 🟢 8/10 | Tokens cohérents, dark-first ; contraste `--muted` à vérifier. |
| Performance | 🟡 6/10 | ISR + `next/image` en place ; front cassé donc non mesurable (Lighthouse). |

> Les notes reflètent l'état du code, pas le potentiel : la majorité des points sont des correctifs ciblés, pas des refontes.

---

## 2. Constats détaillés

### 🔴 Bloquants (P0)

**C1 — `next/image` refuse les images locales → front public en HTTP 500.**
`next.config.ts` déclare `images.localPatterns` restreint à `/api/media/file/**` uniquement. Or plusieurs composants servent des images locales via `next/image` :
- `src/components/layout/BrandLogo.tsx` → `/brand/favicon.png`
- `src/components/sections/Hero.tsx` (x2) → `/images/bertrand-portrait.jpg`
- `src/app/(frontend)/a-propos/page.tsx` → `/images/bertrand-portrait.jpg`

Ces fichiers existent bien dans `public/` mais leurs chemins ne matchent aucun `localPattern` → Next 16 rejette l'optimisation et les pages `/`, `/projets`, `/a-propos`, `/contact` cassent. Ce point est déjà documenté dans `AGENTS.md` (« Known pre-existing bug ») mais **non corrigé**.
**Fix :** ajouter `{ pathname: '/brand/**' }` et `{ pathname: '/images/**' }` à `localPatterns`. Effort : 1 ligne de config, impact maximal.

---

### 🟠 Sécurité

**S1 — CSP permissive.** `next.config.ts` autorise `script-src 'unsafe-inline' 'unsafe-eval'`. `'unsafe-eval'` ouvre la porte à l'exécution de code arbitraire ; il est marqué `🎯` dans `docs/DEVELOPMENT.md` mais toujours présent. Cible : supprimer `unsafe-eval`, remplacer `unsafe-inline` par des nonces (le JSON-LD passe par `dangerouslySetInnerHTML` → nonce nécessaire).

**S2 — Rate-limit non fiable en production.** `src/middleware.ts` stocke les compteurs dans une `Map` en mémoire. Sur Vercel (multi-instances, lambdas éphémères), l'état n'est pas partagé → la limite est contournable et non déterministe. Cible : store partagé (Upstash Redis / Vercel KV) ou `@vercel/firewall`.

**S3 — Endpoint de contact peu protégé.** `FormSubmissions.create` est ouvert (`() => true`, nécessaire) mais la seule barrière anti-spam côté serveur est le honeypot (`contactSchema.website`) + le rate-limit fragile (S2). Pas de CAPTCHA/turnstile, pas de limite de taille de payload explicite au-delà de Zod. Cible : Cloudflare Turnstile ou vérification serveur légère.

**S4 — `submitContact` sans `try/catch`.** `src/app/(frontend)/contact/actions.ts` appelle `payload.create` puis `resend.emails.send` sans capture d'erreur : une panne DB/Resend renvoie une erreur brute au lieu du `{ ok:false, message }` attendu. Déjà `🎯` dans la DoD Server Actions.

**S5 — Modèle d'autorisation « tout admin ».** `Users.access.admin/create` = `Boolean(user)` : tout utilisateur authentifié est admin et peut créer d'autres comptes. Acceptable pour un mono-utilisateur, mais à documenter/rôliser si ouverture future.

---

### 🟠 Accessibilité (a11y)

**A1 — Pas de skip link ni de cible `#main`.** `src/app/(frontend)/layout.tsx` rend `<main class=…>` sans `id`, et aucun lien « Aller au contenu » n'existe. Navigation clavier pénible. (`🎯` dans `docs/DEVELOPMENT.md`.)

**A2 — Focus trap absent sur les modales.** `CommandPalette` et l'overlay `MobileMenu`/palette ne piègent pas le focus ; `Escape` ferme mais le focus n'est pas restauré ni contenu. (`🎯`.)

**A3 — Curseur custom masque le curseur natif.** `CustomCursor` applique `cursor: none` sur `body/a/button` (pointer fine). Bien gardé par `useRichMotionEffects`, mais à valider sur trackpads/écrans tactiles hybrides.

**A4 — Aucun test a11y automatisé.** Pas d'`axe`/`@axe-core/playwright` dans `tests/`. (`🎯`.)

**A5 — Touch targets.** Objectif ≥ 44px annoncé `🎯` mais non vérifié : plusieurs cibles (`Sidebar` icônes 44px OK, mais liens sociaux 36px, bouton Cmd+K, `BottomTabBar`) à auditer sur mobile 390px.

---

### 🟡 SEO

**SEO1 — Canonicals manquants.** Aucune page ne déclare `alternates.canonical`. À ajouter dans les `generateMetadata` (accueil, projets, projet, à-propos, contact) pour éviter la duplication (ex. domaines `.vercel.app` + custom).

**SEO2 — OG image par défaut fragile.** L'OG globale dépend de `seoDefaults.ogImage` (CMS). En mode démo ou si non renseigné, aucune image sociale. Cible : OG image générée (`opengraph-image.tsx` / `next/og`) en fallback, notamment par projet.

**SEO3 — `metadataBase` OK mais robots bloque tout hors prod ?** `robots.ts` autorise `/` et bloque `/admin` + `/api` : correct. Vérifier qu'en preview Vercel on ne désindexe pas involontairement (pas de `noindex` conditionnel actuellement — les previews sont indexables).

**SEO4 — Manque de données structurées riches.** `creativeWorkJsonLd` par projet est minimal (name/description/url). Enrichir avec `image`, `author`, `datePublished`, et un `BreadcrumbList` sur les pages projet.

---

### 🟡 UI / UX / QoL

**U1 — Header desktop dupliqué avec Sidebar.** `Header.tsx` (sticky, `lg:block`) et `Sidebar.tsx` (`lg:flex`) coexistent : vérifier qu'il n'y a pas double navigation desktop / redondance visuelle.

**U2 — Pas d'état de chargement/vide explicite.** Les grilles projets et timelines n'affichent pas d'état « aucun projet » soigné hors palette de commande.

**U3 — Formulaire contact : feedback uniquement via toast.** Pas de message inline persistant ni de reset du formulaire après succès ; `noValidate` désactive la validation native sans toujours exposer les erreurs par champ (erreurs regroupées en un seul toast).

**U4 — Easter egg logo (5 clics).** Sympa, mais `BrandLogo` intercepte les clics de navigation : s'assurer que le `Link` reste fonctionnel au 1er clic (OK actuellement, mais fragile).

**U5 — 404 personnalisée.** Vérifier la présence d'une `not-found.tsx` front soignée (seule `(payload)/admin/.../not-found.tsx` repérée).

---

### 🟢 Design system

**D1 — Contraste `--muted` (#8a8580 sur #0a0a0a).** Ratio ≈ 4.9:1 — OK pour texte normal (AA) mais limite pour petites tailles / texte secondaire massivement utilisé. Vérifier les usages en `text-xs`/`text-[10px]`.

**D2 — Tokens bien centralisés.** `styles.css` + `check:tokens` : très bon. Continuer à interdire les hex inline (règle déjà en place).

---

### 🟢 Qualité du code

**Q1 — Casts `as` non sûrs récurrents.** Ex. `seo.ogImage as Media`, `project.cover as Media`, `.filter(Boolean) as string[]`. Remplacer par des type guards (`isMedia(x)`) pour éviter les erreurs runtime si la relation n'est pas peuplée.

**Q2 — Duplication logique média.** La conversion `cover/ogImage → Media | null` est répétée dans plusieurs pages. Factoriser dans `src/lib/` (ex. `resolveMediaUrl()`).

**Q3 — Tests e2e non représentatifs.** `docs/DEVELOPMENT.md` note les e2e comme `🎯` (« contenu réel, pas template Payload »). Les specs `tests/e2e/frontend.e2e.spec.ts` sont à aligner sur le contenu réel + à faire tourner en CI.

**Q4 — Pas de CI visible.** Aucun workflow `.github/` détecté : `pnpm verify` n'est pas automatisé sur PR. Scan de secrets marqué `⏸️`.

**Q5 — `getPayloadClient` mise en cache module-level.** OK en serverless, mais attention au cache d'erreurs : `getPayloadClientSafe` avale les erreurs silencieusement (`catch {}`) → un incident DB devient invisible (bascule silencieuse en fallback). Ajouter un log serveur.

---

## 3. Roadmap-Upgrade priorisée

Priorités : **P0** = bloquant / sécurité critique · **P1** = fort impact, effort modéré · **P2** = qualité/robustesse · **P3** = polish. L'« effort » décrit l'ampleur technique, pas un délai.

### P0 — Débloquer le front (à faire en premier)

| ID | Action | Fichiers | Effort |
|---|---|---|---|
| C1 | Ajouter `/brand/**` et `/images/**` à `images.localPatterns` | `next.config.ts` | Trivial (1 config) |
| — | Vérifier `pnpm build` + rendu des 4 pages publiques après fix | — | Faible |

### P1 — Sécurité & accessibilité à fort impact

| ID | Action | Fichiers | Effort |
|---|---|---|---|
| S1 | Durcir la CSP : retirer `unsafe-eval`, passer aux nonces (JSON-LD inclus) | `next.config.ts`, `src/lib/json-ld.tsx`, `middleware.ts` | Moyen |
| S2 | Rate-limit persistant (Vercel KV / Upstash) au lieu de la `Map` mémoire | `src/middleware.ts` | Moyen |
| S4 | Envelopper `submitContact` dans un `try/catch` renvoyant `{ ok:false }` | `contact/actions.ts` | Faible |
| A1 | Skip link + `<main id="main">` | `layout.tsx`, `styles.css` | Faible |
| A2 | Focus trap + restauration du focus sur `CommandPalette` | `CommandPalette.tsx` | Moyen |

### P2 — SEO, robustesse, CI

| ID | Action | Fichiers | Effort |
|---|---|---|---|
| SEO1 | Ajouter `alternates.canonical` sur toutes les pages | `**/generateMetadata` | Faible |
| SEO2 | OG image de fallback via `opengraph-image` (`next/og`) | `src/app/**/opengraph-image.tsx` | Moyen |
| SEO4 | Enrichir JSON-LD projet (`image`, `datePublished`, `BreadcrumbList`) | `json-ld.tsx`, `projets/[slug]/page.tsx` | Faible |
| S3 | Anti-spam contact (Turnstile) | `ContactForm.tsx`, `actions.ts` | Moyen |
| Q1/Q2 | Type guards média + helper `resolveMediaUrl()` | `src/lib/` + pages | Moyen |
| Q4 | Workflow CI GitHub : `pnpm verify` + scan secrets sur PR | `.github/workflows/` | Faible |
| A4 | Tests a11y automatisés (`@axe-core/playwright`) | `tests/e2e/` | Moyen |

### P3 — Polish UI/UX & perf

| ID | Action | Fichiers | Effort |
|---|---|---|---|
| A5/D1 | Audit touch targets ≥ 44px + contraste `--muted` sur petits textes | composants layout/ui | Faible |
| U2/U3 | États vides soignés + feedback inline + reset formulaire | sections | Faible |
| U5 | `not-found.tsx` front personnalisée | `src/app/(frontend)/not-found.tsx` | Faible |
| Q5 | Log serveur quand `getPayloadClientSafe` bascule en fallback | `src/lib/payload.ts` | Trivial |
| — | Mesurer Lighthouse ≥ 95 (objectif `docs/DEVELOPMENT.md`) une fois C1 corrigé | — | Faible |

---

## 4. Séquencement recommandé

1. **P0 (C1)** — un correctif d'une ligne qui restaure tout le front ; à shipper immédiatement dans sa propre PR.
2. **P1 sécurité (S1, S2, S4)** puis **P1 a11y (A1, A2)** — chaque item en PR isolée (règle « une PR = un objectif » d'`AGENTS.md`).
3. **P2** — regrouper par thème (SEO, robustesse code, CI) mais garder des PR ciblées.
4. **P3** — polish continu, à mesurer via Lighthouse après P0/P1.

À chaque livraison notable : bumper `SITE_VERSION` (`src/lib/site-version.ts`, actuellement `0.5.1`) et passer `pnpm verify` au vert, conformément à la Definition of Done.

---

## 5. Points positifs à préserver

- **CMS-first strict** : zéro copy marketing en dur, Local API Payload (pas de `fetch` interne). ADR documentés.
- **Mode démo sans env** (`isPayloadConfigured()`) : build et site public fonctionnent hors base de données.
- **Tokens CSS + `check:tokens`** : design system discipliné, dark-first.
- **`prefers-reduced-motion`** géré globalement + effets « fun » desktop-only conditionnés.
- **Base de tests** (`vitest` intégration) + `lint`/`typecheck` verts + doc interne riche.

---

## 6. Bilan de remédiation — suivi (v0.6.0)

Première vague de correctifs appliquée sur la branche `cursor/audit-remediation-c7c1`.
Légende : ✅ fait · ⏸️ reporté (infra/clé externe requise) · 🎯 planifié.

### ✅ Livrés

| ID | Correctif | Preuve |
|---|---|---|
| C1 | `images.localPatterns` autorise `/brand/**` et `/images/**` | `next.config.ts` — front public de nouveau rendu |
| S4 | `submitContact` : `try/catch` DB + email, renvoie `{ ok:false }` propre | `contact/actions.ts` |
| A1 | Skip link « Aller au contenu » + `<main id="main">` | `layout.tsx` |
| A2 | Focus trap `Tab`/`Shift+Tab` + restauration du focus + `role="dialog"` | `CommandPalette.tsx` |
| SEO1 | `alternates.canonical` sur accueil, projets, projet, à-propos, contact | pages `generateMetadata` |
| SEO4 | JSON-LD projet enrichi (`image`, `datePublished`, `author`) + `BreadcrumbList` | `json-ld.tsx`, `projets/[slug]/page.tsx` |
| Q1/Q2 | Helper typé `isMedia()` / `resolveMediaUrl()` remplaçant les casts `as Media` | `src/lib/media.ts` + pages/composants |
| Q5 | Log serveur quand Payload bascule en contenu de démo | `src/lib/payload.ts` |
| U5 | Page 404 front personnalisée | `src/app/(frontend)/not-found.tsx` |
| — | Bump `SITE_VERSION` → `0.6.0` | `src/lib/site-version.ts` |

### ⏸️ Reportés (nécessitent provisioning / décision)

| ID | Raison du report |
|---|---|
| S1 (CSP `unsafe-eval`/nonces) | Impacte `/admin` Payload — nécessite tests dédiés + nonces sur le JSON-LD ; à isoler dans sa propre PR. |
| S2 (rate-limit persistant) | Nécessite un store partagé (Vercel KV / Upstash) à provisionner. |
| S3 (anti-spam Turnstile) | Nécessite des clés Cloudflare Turnstile. |
| SEO2 (OG image fallback `next/og`) | 🎯 réalisable, prévu dans une vague suivante. |
| Q4 (CI GitHub `pnpm verify`) | 🎯 ajout d'un workflow prévu (non vérifiable dans cet environnement). |
| A4 (tests a11y `axe`) | 🎯 nécessite navigateurs Playwright + serveur en CI. |
| A5/D1 (touch targets / contraste) | 🎯 audit visuel restant. |

---

*Document d'audit — généré à partir de l'état `main`, mis à jour avec le bilan de remédiation. Toutes les références de fichiers sont vérifiables dans le dépôt.*
