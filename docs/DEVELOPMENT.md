# Guide de développement — Modern Portfolio

> Document de référence pour encadrer le développement, les revues et les contributions sur ce repo.  
> Il fusionne les bonnes pratiques **design**, **qualité** et **sécurité**, adaptées à la stack réelle du projet (Next.js 16 + Payload 3 + Neon + Vercel).

**Documents liés :**
- Produit & scope : `docs/brainstorms/2026-07-20-modern-portfolio-roadmap.md`
- Plan d’implémentation : `docs/plans/2026-07-20-001-feat-modern-portfolio-cms-plan.md`
- Setup & déploiement : `README.md`

---

## 1. Principes directeurs

| # | Principe | Application concrète |
|---|---|---|
| P1 | **CMS-first** | Aucun contenu éditorial en dur dans le front. Tout passe par Payload (collections/globals) via `src/lib/content.ts`. |
| P2 | **Scope minimal** | Un changement = un objectif. Pas de refactor hors périmètre de la tâche. |
| P3 | **Dark-first** | Palette orange/noir définie dans `src/app/(frontend)/styles.css`. Pas de mode clair sans décision produit explicite. |
| P4 | **Mobile-first** | Bottom tab bar `< lg`, sidebar desktop `≥ lg`. Tester à 390px avant merge. |
| P5 | **Secrets hors repo** | Jamais de clé API, URI DB ou mot de passe dans le code ou les commits. |
| P6 | **Vérifiable** | Chaque livraison doit passer la checklist §8 avant merge. |

---

## 2. Stack & arborescence

```
src/
├── app/
│   ├── (frontend)/          # Pages publiques (/, /projets, /contact…)
│   └── (payload)/           # Admin + API Payload
├── collections/             # Schémas CMS
├── components/
│   ├── layout/              # Sidebar, Footer, BottomTabBar…
│   ├── motion/              # Animations (Framer Motion)
│   ├── sections/            # Blocs de page (Hero, ProjectGrid…)
│   └── ui/                  # Primitives (Button, Badge, GlassCard…)
├── data/                    # Fallback démo uniquement (portfolio-fallback.ts)
├── globals/                 # SiteSettings, SEODefaults
└── lib/                     # content.ts, payload.ts, utils, json-ld…
```

**Règles :**
- Server Components par défaut. `'use client'` uniquement si interactivité, hooks ou Framer Motion.
- Données front : **Local API** Payload (`getPayload`) — pas d’appels HTTP internes vers `/api/projects`.
- Types Payload : régénérer après modification de schéma (`pnpm generate:types`).

---

## 3. Design & UX

### 3.1 Tokens CSS (source de vérité)

Fichier : `src/app/(frontend)/styles.css` (`:root`).

| Token | Usage |
|---|---|
| `--background` | Fond principal (`#0a0a0a`) |
| `--background-elevated` | Surfaces surélevées |
| `--foreground` | Texte principal |
| `--muted` | Texte secondaire, labels |
| `--accent` | CTA, liens actifs, highlights (`#ff6b1a`) |
| `--accent-secondary` | Dégradés, accents profonds |
| `--accent-soft` | Texte accentué lisible |
| `--accent-glow` | Halos, ombres colorées |
| `--glass` / `--border` | Cartes glassmorphism |

**À faire :**
- Utiliser `var(--…)` ou classes Tailwind mappées (`text-[var(--muted)]`).
- Nouveau token → l’ajouter dans `:root` **et** documenter dans ce fichier (§3.1).
- Vérifier les tokens orphelins : `rg "var\\(--" src` — chaque token doit exister dans `styles.css`.

**À ne pas faire :**
- Couleurs hex en dur dans les composants (sauf exceptions documentées).
- Ajouter shadcn, MUI, Chakra ou autre lib UI lourde.
- Changer `--accent` sans validation produit (identité orange/noir).

### 3.2 Composants UI

| Primitive | Fichier | Usage |
|---|---|---|
| `Button` | `components/ui/Button.tsx` | CTA primaire / ghost / glass |
| `Badge` | `components/ui/Badge.tsx` | Tags stack, filtres |
| `GlassCard` | `components/ui/GlassCard.tsx` | Cartes, formulaires |
| `SectionTitle` | `components/ui/SectionTitle.tsx` | Titres de section |
| `Container` | `components/ui/Container.tsx` | Wrapper max-width |

Icônes : **lucide-react** uniquement. Pas de lib d’icônes supplémentaire.

### 3.3 Touch targets & responsive

- Actions principales (boutons, liens nav) : **hauteur minimale 44px** sur mobile.
- Grilles projets : masonry sur `/projets`, featured sur `/`.
- Filtres stack : masqués par défaut, ouverts via CTA « Filtrer par stack » (`ProjectGrid`).

### 3.4 Motion & effets « fun »

- Respecter `prefers-reduced-motion` (déjà dans `styles.css` + `CustomCursor`).
- Mesh / glow / parallax : **desktop uniquement** (`pointer: fine`) — voir `FunEffects.tsx`.
- Pas d’animation qui bloque le contenu (éviter `opacity: 0` par défaut sur des sections critiques).

### 3.5 Checklist visuelle (avant merge UI)

- [ ] Dark theme sur la page modifiée
- [ ] Viewport 390px (iPhone) — pas de débordement horizontal
- [ ] Contraste lisible texte body / `--muted` sur fond `--background`
- [ ] `focus-visible` visible sur éléments interactifs
- [ ] Screenshots avant/après dans la PR si changement visuel notable

---

## 4. Accessibilité

### Obligatoire

| Item | Statut cible | Implémentation |
|---|---|---|
| Skip link | À maintenir | Premier focusable : lien « Aller au contenu » → `#main` |
| Landmark `<main id="main">` | À maintenir | Dans `(frontend)/layout.tsx` |
| Labels formulaires | ✅ | `ContactForm` : `htmlFor` + `id` sur chaque champ |
| Honeypot spam | ✅ | Champ `website` caché (`aria-hidden`) |
| `aria-current="page"` | ✅ | `BottomTabBar`, `Sidebar` |
| `aria-label` sur nav | ✅ | Nav mobile / desktop |
| Reduced motion | ✅ | CSS global + guards Framer |

### Modales & palettes (CommandPalette, filtres)

- **Escape** ferme le panneau.
- À l’ouverture : focus sur le premier champ interactif.
- Tab reste dans le panneau tant qu’il est ouvert (focus trap).
- À la fermeture : restaurer le focus sur le déclencheur.

### Tests a11y (cible)

```bash
# À ajouter quand tests/a11y.spec.ts existera
pnpm test:a11y
```

En attendant : vérification manuelle clavier (Tab, Enter, Escape) sur chaque page touchée.

---

## 5. Qualité & tests

### 5.1 Scripts

| Commande | Rôle |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm test:int` | Vitest (composants, schémas, utils) |
| `pnpm test:e2e` | Playwright (parcours admin + front) |
| `pnpm build` | Gate production (obligatoire avant push) |
| `pnpm generate:types` | Après changement de collections/globals |

**Gate recommandée** (à lancer avant chaque PR) :

```bash
pnpm lint && pnpm test:int && pnpm build
```

Optionnel en local si DB configurée : `pnpm test:e2e`.

### 5.2 Ce qu’on teste

| Zone | Fichier(s) | Priorité |
|---|---|---|
| Schéma contact | `tests/int/contactSchema.int.spec.ts` | P0 |
| Composants UI | `tests/int/ProjectCard.int.spec.tsx`, `BottomTabBar.int.spec.tsx` | P1 |
| Slugify / utils | `tests/int/slugify.int.spec.ts` | P1 |
| Parcours E2E | `tests/e2e/frontend.e2e.spec.ts` | P1 — **maintenir à jour** |
| Admin smoke | `tests/e2e/admin.e2e.spec.ts` | P2 |

### 5.3 Server Actions & mutations

Fichier type : `src/app/(frontend)/contact/actions.ts`.

**Pattern obligatoire :**
1. Valider avec Zod (`contactSchema`) côté serveur.
2. Honeypot silencieux si rempli.
3. `try/catch` autour des appels externes (Payload, Resend).
4. Retourner un état `{ ok, message }` — jamais d’échec silencieux.
5. Le client affiche le retour via toast (`sonner`) ou `aria-live`.

```ts
// ✅ Bon
try {
  await payload.create({ ... })
} catch {
  return { ok: false, message: 'Envoi impossible. Réessayez plus tard.' }
}

// ❌ Mauvais — exception non gérée, l’utilisateur ne voit rien
await payload.create({ ... })
```

### 5.4 Dette technique

- Supprimer le code mort **après** vérification `rg` (zéro import).
- Ne pas introduire Jest en plus de Vitest.
- E2E : assertions alignées sur le contenu CMS/fallback actuel, pas sur le template Payload vierge.

---

## 6. Sécurité

### 6.1 Secrets & configuration

| Règle | Détail |
|---|---|
| Jamais committer `.env`, `.env.local` | Déjà dans `.gitignore` |
| Placeholders uniquement dans `.env.example` | Pas de vraies clés |
| Prod : variables Vercel | `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL` minimum |
| Script setup | `scripts/setup-vercel-env.sh` (nécessite `VERCEL_TOKEN`) |

### 6.2 Modèle d’accès

| Surface | Lecture | Écriture |
|---|---|---|
| Contenu publié (projects, skills…) | Public (`status: published`) | Admin authentifié |
| Form submissions | Admin uniquement | Public (formulaire contact) |
| `/admin` | Authentifié | Authentifié |
| Media | Public si publié | Admin |

**Ne pas** exposer de route API custom d’écriture sans auth, sauf besoin produit documenté.

### 6.3 Middleware & rate-limit

Fichier : `src/middleware.ts`

| Route | Limite |
|---|---|
| `POST /api/users/login` | 10 req/min/IP |
| `POST /api/contact` | 8 req/min/IP |

Toute modification du middleware → relancer `pnpm build` + smoke login/contact.

### 6.4 Headers HTTP

Configurés dans `next.config.ts` :

- `X-Frame-Options: SAMEORIGIN` (preview admin)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restrictive
- CSP : `default-src 'self'` — **`unsafe-eval` à retirer** dès que le build Next 16 le permet (documenter si impossible)

### 6.5 Checklist sécurité (avant merge)

- [ ] Aucun secret dans le diff (`git diff` + review)
- [ ] Pas de `create: () => true` ajouté sans justification
- [ ] Inputs utilisateur validés côté serveur (Zod)
- [ ] Pas de `dangerouslySetInnerHTML` sauf JSON-LD (`src/lib/json-ld.tsx`)

---

## 7. CMS & contenu

### Collections

| Slug | Rôle |
|---|---|
| `projects` | Projets portfolio (slug, cover, stack, featured, status) |
| `skills` | Compétences |
| `experiences` | Parcours pro |
| `media` | Uploads (Vercel Blob si token présent) |
| `form-submissions` | Inbox contact |
| `users` | Admins Payload |

### Globals

- `site-settings` : nom, tagline, email, réseaux, intro à propos
- `seo-defaults` : titre/description/OG par défaut

### Règles éditoriales

- Publier = `status: published` sur Projects.
- `afterChange` → revalidation (`src/lib/revalidate.ts`) : `/`, `/projets`, `/projets/[slug]`, `/a-propos`.
- Preview admin : bouton sur Projects → `/projets/[slug]`.
- Seed : `pnpm seed:portfolio` (nécessite `DATABASE_URI` + `PAYLOAD_SECRET`).

### Mode démo

Sans variables Payload, `src/lib/content.ts` bascule sur `portfolio-fallback.ts`. Le build Vercel **doit** passer sans secrets — ne pas casser `isPayloadConfigured()`.

---

## 8. SEO & performance

- Metadata : `generateMetadata` sur chaque page publique.
- JSON-LD : helpers dans `src/lib/json-ld.tsx`.
- URL canonique : `getSiteUrl()` (`src/lib/site-url.ts`).
- Images : `next/image` + domaines dans `next.config.ts`.
- ISR : `revalidate = 3600` sur les pages publiques.
- Monitoring prod : Vercel Analytics + Speed Insights (layout front).
- Cible Lighthouse ≥ 95 — auditer home + page projet avant de déclarer MVP terminé.

---

## 9. Git, branches & PR

### Branches

- `main` : production
- Features : `cursor/<description>-c30f`

### Commits

Format [Conventional Commits](https://www.conventionalcommits.org/) en français ou anglais :

```
feat(sections): ajouter filtre projets via CTA
fix(contact): gérer erreur Resend côté serveur
chore: bump version footer v0.5.1
```

### PR

- Titre clair, description avec **quoi / pourquoi / comment tester**.
- Screenshots si changement visuel.
- Lier à la tâche roadmap si applicable.
- CI Vercel doit être verte.

### Versioning

Incrémenter `SITE_VERSION` dans `src/lib/site-version.ts` à chaque livraison notable (affiché dans le footer).

---

## 10. Checklist avant merge

### Tout changement

- [ ] `pnpm lint` vert
- [ ] `pnpm test:int` vert
- [ ] `pnpm build` vert
- [ ] Pas de secret dans le diff
- [ ] Scope limité à la tâche

### Changement UI

- [ ] Tokens CSS respectés (§3)
- [ ] Mobile 390px OK
- [ ] Focus clavier visible
- [ ] `prefers-reduced-motion` respecté

### Changement CMS / API

- [ ] Types régénérés si schéma modifié
- [ ] Access control vérifié
- [ ] Revalidation des bonnes routes

### Changement formulaire / action serveur

- [ ] Validation Zod serveur
- [ ] Erreurs remontées à l’utilisateur
- [ ] Honeypot intact

### Déploiement

- [ ] Variables Vercel documentées si nouvelles
- [ ] Mode démo toujours fonctionnel sans env

---

## 11. Anti-patterns (ne pas faire)

| ❌ Anti-pattern | ✅ Alternative |
|---|---|
| Texte marketing en dur dans une page | Champ CMS ou global |
| `fetch('/api/projects')` depuis le front | `getPublishedProjects()` via Local API |
| Nouvelle lib UI complète | Étendre `components/ui/` |
| Couleur hex inline | Token `var(--accent)` |
| `opacity: 0` par défaut sur contenu critique | Animation translate/scale seule |
| Commit de `.env.local` | `.env.example` + doc |
| E2E qui teste le template Payload vierge | Assertions sur contenu fallback/CMS |
| `unsafe-eval` CSP sans justification documentée | Tester retrait, documenter si requis |
| PR fourre-tout (UI + CMS + refactor) | Une PR = un objectif |

---

## 12. Roadmap & priorités ouvertes

| Priorité | Tâche | Référence |
|---|---|---|
| P0 | Configurer variables Vercel prod | `README.md`, `scripts/setup-vercel-env.sh` |
| P1 | Skip link + `id="main"` | §4 |
| P1 | Touch targets ≥ 44px (Button, BottomTabBar) | §3.3 |
| P1 | Focus trap CommandPalette | §4 |
| P1 | Corriger E2E frontend obsolète | §5.2 |
| P1 | try/catch Server Action contact | §5.3 |
| P2 | `tests/a11y.spec.ts` | §4 |
| P2 | Retirer `unsafe-eval` CSP | §6.4 |
| P2 | Audit Lighthouse ≥ 95 | §8 |
| P3 | Live Preview admin (drafts Payload) | Post-MVP |
| P3 | Resend prod + domaine custom | Optionnel |

---

## 13. Références rapides

```bash
# Dev
pnpm dev

# Vérification complète
pnpm lint && pnpm test:int && pnpm build

# Après modif schéma Payload
pnpm generate:types && pnpm generate:importmap

# Seed Neon
pnpm seed:portfolio

# Env Vercel (local, avec token)
./scripts/setup-vercel-env.sh
```

**URLs locales :**
- Site : http://localhost:3000
- Admin : http://localhost:3000/admin

**Prod :** https://modern-portfolio-two-orcin.vercel.app

---

*Dernière mise à jour : v0.5.0 — ce document évolue avec le projet. Toute nouvelle convention doit être ajoutée ici plutôt que dispersée dans des playbooks externes.*
