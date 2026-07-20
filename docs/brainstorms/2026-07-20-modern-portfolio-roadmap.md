# Portfolio Moderne — Roadmap Complète (Next.js + Payload CMS + Neon + Vercel)

> Document de référence pour vibe-coding avec agents Cursor. Chaque section est pensée comme un bloc de travail indépendant que tu peux copier-coller en prompt à un agent.

---

## 00 - Vision du projet

**Objectif** : un portfolio personnel, piloté à 100% depuis un backoffice (Payload CMS), sans jamais toucher au code pour changer un texte, une image ou ajouter un projet.

**Principes directeurs :**
- Le front (Next.js) ne contient **aucun contenu en dur** — tout vient de la base de données via Payload.
- Design dark-first, glassmorphism, typographies Space Grotesk / Syne / DM Sans, navigation mobile en bottom tab bar.
- Perf et SEO natifs (SSG/ISR, pas de JS inutile).
- Architecture mono-repo simple à maintenir seul, mais scalable si tu ajoutes un blog, une boutique, etc.

**Livrable final :**
- Site public : `tondomaine.com`
- Backoffice : `tondomaine.com/admin` (Payload embarqué dans Next.js, pas de service séparé)
- 1 seule base Postgres (Neon), 1 seul déploiement Vercel

---

## 01 - Cahier des charges

**Fonctionnel :**
- Page d'accueil (hero, à propos résumé, projets à la une, CTA contact)
- Page Portfolio (liste filtrable de projets)
- Page projet détaillée (galerie, stack, description, liens)
- Page À propos (bio, parcours, compétences)
- Page Blog (optionnel, activable plus tard)
- Formulaire de contact fonctionnel (email + stockage en base)
- Backoffice complet pour gérer : projets, compétences, expériences, médias, paramètres globaux (SEO, réseaux sociaux, coordonnées)

**Non-fonctionnel :**
- Lighthouse ≥ 95 sur toutes les métriques
- Responsive mobile-first, testé de 320px à 4K
- Temps de chargement < 1.5s (LCP)
- Accessible (contrastes, navigation clavier, alt texts obligatoires en back)
- Éditable sans redéploiement (contenu dynamique via CMS + revalidation)

**Hors périmètre v1 :** multi-langue, e-commerce, authentification visiteurs.

---

## 02 - Stack technique

| Brique | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG/ISR natif, Server Components, intégration Payload officielle |
| UI | React 19 + TypeScript | standard, typé de bout en bout |
| Styling | Tailwind CSS v4 | cohérent avec ton design system existant |
| Animations | Framer Motion (motion/react) | transitions fluides, glassmorphism animé |
| CMS | Payload CMS 3.x | s'installe **dans** Next.js (pas de service séparé), admin UI générée automatiquement, TypeScript natif |
| Base de données | Neon (Postgres serverless) | scale-to-zero, branches DB pour preview Vercel |
| ORM | Drizzle (via l'adapter Postgres de Payload) | généré automatiquement par Payload, pas besoin de l'écrire à la main |
| Hébergement | Vercel | déploiement natif Next.js, Neon officiellement intégré via Vercel Marketplace |
| Stockage médias | Vercel Blob ou Cloudflare R2 (via plugin Payload) | pas de fichiers en local, compatible serverless |
| Emails (formulaire contact) | Resend | API simple, bonne délivrabilité, plugin Payload existant |
| Analytics | Vercel Analytics ou Plausible | léger, respect RGPD |

**Alternative CMS envisagée et pourquoi Payload gagne :**
- **Sanity** : excellent mais hébergé chez eux (moins "tout chez moi"), pricing peut grimper.
- **Strapi** : nécessite un service backend séparé à héberger et maintenir à part → plus de friction avec Vercel serverless.
- **Payload 3.x** : s'installe littéralement dans ton dossier `app/(payload)`, partage la même base de données et le même déploiement Vercel que le front. C'est le choix le plus cohérent avec "un seul repo, un seul déploiement".

---

## 03 - Installation

```bash
npx create-payload-app@latest modern-portfolio --template blank
cd modern-portfolio
```

À l'installation, choisir :
- Database : **Postgres**
- Renseigner l'URL Neon (voir section 06)

Ajouter ensuite manuellement :
```bash
pnpm add framer-motion clsx tailwind-merge lucide-react
pnpm add -D tailwindcss @tailwindcss/postcss
pnpm add resend @payloadcms/plugin-form-builder @payloadcms/storage-vercel-blob
```

**Prompt Cursor à donner :**
> "Initialise un projet Next.js 15 App Router avec Payload CMS 3 installé nativement (pas en service séparé), adapter Postgres, TypeScript strict. Configure Tailwind v4. Vérifie que `/admin` répond correctement en local."

---

## 04 - Architecture globale

```
Visiteur → Next.js (front, App Router, RSC)
              ↕ (Local API Payload, pas de fetch HTTP interne)
           Payload CMS (admin UI + collections + API REST/GraphQL)
              ↕
           Neon Postgres
              ↕
     Vercel Blob (médias) / Resend (emails)
```

**Point clé** : le front n'appelle pas Payload via `fetch('/api/...')` en interne — il utilise la **Local API** de Payload (`payload.find()`, `payload.findByID()`) directement dans les Server Components, ce qui évite un aller-retour HTTP inutile et garde tout en zero-latency côté serveur.

---

## 05 - Structure des dossiers

```
modern-portfolio/
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # accueil
│   │   │   ├── projets/
│   │   │   │   ├── page.tsx              # liste
│   │   │   │   └── [slug]/page.tsx       # détail
│   │   │   ├── a-propos/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── (payload)/
│   │       ├── admin/[[...segments]]/page.tsx
│   │       └── api/[...slug]/route.ts
│   ├── collections/
│   │   ├── Projects.ts
│   │   ├── Skills.ts
│   │   ├── Experiences.ts
│   │   ├── Media.ts
│   │   ├── Users.ts
│   │   ├── FormSubmissions.ts
│   │   └── globals/
│   │       ├── SiteSettings.ts
│   │       └── SEODefaults.ts
│   ├── components/
│   │   ├── ui/                # boutons, cards, glass panels...
│   │   ├── sections/           # blocs de page (Hero, ProjectGrid...)
│   │   └── layout/             # Header, Footer, BottomTabBar
│   ├── lib/
│   │   ├── payload.ts          # helper getPayload()
│   │   ├── utils.ts
│   │   └── revalidate.ts
│   ├── payload.config.ts
│   └── payload-types.ts        # généré automatiquement
├── public/
├── .env.local
└── next.config.ts
```

**Prompt Cursor :**
> "Crée cette arborescence exacte de dossiers vide avec des fichiers `.gitkeep` où nécessaire, sans encore écrire de logique."

---

## 06 - Base de données Neon

1. Créer un compte sur neon.tech (ou activer Neon depuis le Marketplace Vercel directement — recommandé, ça pré-remplit les variables d'env sur Vercel automatiquement).
2. Créer un projet Neon, région proche de tes visiteurs (`eu-central-1` pour la France).
3. Récupérer la connection string en mode **pooled** (`-pooler` dans le hostname) pour l'usage serverless.
4. Activer les **branches Neon** : une branche par Preview Deployment Vercel (intégration officielle Vercel-Neon le fait automatiquement) → chaque PR a sa propre base isolée.

```env
DATABASE_URI=postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/dbname?sslmode=require
```

**Prompt Cursor :**
> "Configure l'adapter `@payloadcms/db-postgres` dans `payload.config.ts` avec `DATABASE_URI` depuis les variables d'environnement, active `push: true` uniquement en dev."

---

## 07 - Payload CMS

**Collections à créer (détail en section 05, code en section suivante) :**

- **Projects** : title, slug, excerpt, content (richText), cover (upload), gallery (array d'uploads), stack (relationship vers Skills ou array de tags), liveUrl, repoUrl, featured (checkbox), order (number), status (draft/published)
- **Skills** : name, icon/logo, category (select : frontend/backend/outils/design)
- **Experiences** : title, company, dateStart, dateEnd, description, current (checkbox)
- **Media** : géré automatiquement par Payload, brancher le plugin Vercel Blob dessus
- **Users** : auth admin uniquement (toi)
- **FormSubmissions** : généré par le plugin form-builder

**Globals (contenu unique, pas de liste) :**
- **SiteSettings** : nom du site, tagline, avatar, réseaux sociaux, email de contact, CV (upload PDF)
- **SEODefaults** : title/description par défaut, image OG par défaut

**Prompt Cursor (exemple pour Projects) :**
> "Crée `src/collections/Projects.ts` avec les champs : title (text, required), slug (text, unique, généré via hook à partir de title si vide), excerpt (textarea, max 200), content (richText, éditeur Lexical), cover (upload relié à Media, required), gallery (array de uploads), stack (array de select avec options prédéfinies), liveUrl (text, validation URL), repoUrl (text, validation URL), featured (checkbox), order (number, default 0), status (select draft/published, default draft). Ajoute un hook `beforeChange` pour slugifier automatiquement."

---

## 08 - Authentification

- Seul **toi** as un compte (via la collection `Users` de Payload, auth intégrée).
- Pas d'authentification visiteur nécessaire côté front.
- Sécuriser `/admin` :
  - Désactiver la création de compte publique (`auth: { disableLocalStrategy: false }` mais pas de route d'inscription exposée)
  - Activer 2FA si Payload le permet via plugin, sinon mot de passe fort + rotation
  - Limiter les tentatives de connexion (rate limiting, voir section 17)

**Prompt Cursor :**
> "Configure la collection Users pour n'autoriser que la connexion (pas d'inscription publique), ajoute un rate-limit sur `/api/users/login` via middleware Next.js."

---

## 09 - Design System

Basé sur tes préférences habituelles :

- **Palette** : dark-first (fond `#0a0a0f` à `#111118`), accents en dégradés (violet/cyan ou orange selon identité), glassmorphism (`backdrop-blur-xl`, `bg-white/5`, `border-white/10`)
- **Typographies** :
  - Titres : **Syne** (bold, expressif)
  - Corps de texte : **DM Sans**
  - Accents / code / labels techniques : **Space Grotesk**
- **Composants de base à créer dans `components/ui/` :**
  - `GlassCard`
  - `Button` (variants: primary, ghost, glass)
  - `Badge` (pour tags de stack)
  - `SectionTitle`
  - `Container`

**Prompt Cursor :**
> "Configure `tailwind.config.ts` avec les 3 familles de police (via next/font), une palette dark custom, et crée un composant `GlassCard` réutilisable avec effet glassmorphism (blur, bordure translucide, ombre douce)."

---

## 10 - UI/UX

- Hiérarchie visuelle claire : un seul CTA principal par écran ("Voir mes projets" / "Me contacter")
- Micro-interactions au survol (scale léger, glow sur les cards)
- Feedback visuel systématique (loading states, toasts de confirmation sur le formulaire)
- Dark mode uniquement en v1 (pas de toggle, évite la complexité)

---

## 11 - Responsive

- Approche **mobile-first** stricte : on stylise pour 375px puis on ajoute des breakpoints `md:` `lg:` `xl:`
- **Bottom tab bar** fixe sur mobile (Accueil / Projets / À propos / Contact), remplacée par un header classique en `lg:`
- Grilles de projets : 1 colonne mobile → 2 colonnes tablette → 3 colonnes desktop
- Tester sur breakpoints : 375, 390, 768, 1024, 1440, 1920

**Prompt Cursor :**
> "Crée un composant `BottomTabBar` fixe en bas d'écran, visible uniquement en dessous de `lg:`, avec icônes lucide-react et indicateur de route active."

---

## 12 - Animations

- **Framer Motion** pour :
  - Fade-in + slide au scroll (`whileInView`)
  - Transitions de page douces
  - Hover sur les project cards (scale + glow)
  - Stagger sur les listes (compétences, projets)
- Respecter `prefers-reduced-motion` (désactiver les animations si l'utilisateur le demande)

**Prompt Cursor :**
> "Crée un composant `FadeInWhenVisible` générique utilisant Framer Motion `whileInView`, qui respecte `prefers-reduced-motion` via le hook `useReducedMotion`."

---

## 13 - Composants

Liste des composants à construire, dans l'ordre logique :

1. `Container`, `SectionTitle`, `GlassCard`, `Button`, `Badge` (fondations)
2. `Header`, `Footer`, `BottomTabBar` (layout)
3. `Hero` (accueil)
4. `ProjectCard`, `ProjectGrid`, `ProjectFilters`
5. `SkillBadgeList`
6. `ExperienceTimeline`
7. `ContactForm`
8. `RichText` (renderer pour le contenu Lexical de Payload → composants React)

**Prompt Cursor (exemple RichText) :**
> "Crée un composant `RichTextRenderer` qui prend le JSON Lexical retourné par Payload et le convertit en JSX, en utilisant `@payloadcms/richtext-lexical/react` officiel pour éviter de réinventer le parsing."

---

## 14 - Pages

| Route | Source de données | Rendu |
|---|---|---|
| `/` | Global SiteSettings + Projects (featured) | SSG + revalidation |
| `/projets` | Collection Projects (status=published) | SSG + revalidation |
| `/projets/[slug]` | Projects.findByID | SSG (generateStaticParams) + revalidation |
| `/a-propos` | Global SiteSettings + Experiences + Skills | SSG |
| `/blog` | Collection Posts (si activé) | SSG + revalidation |
| `/contact` | Global SiteSettings (coordonnées) | statique, formulaire en Client Component |
| `/admin` | Payload Admin UI | dynamique, protégé |

**Prompt Cursor :**
> "Implémente `/app/(frontend)/projets/page.tsx` en Server Component, appelle `payload.find({ collection: 'projects', where: { status: { equals: 'published' } }, sort: 'order' })` via la Local API, affiche via `ProjectGrid`."

---

## 15 - SEO

- `generateMetadata()` dynamique sur chaque page à partir des champs Payload (title, excerpt, cover)
- Sitemap auto-généré (`next-sitemap` ou route handler custom `/sitemap.xml`)
- `robots.txt` généré
- Balises Open Graph + Twitter Card sur chaque page projet
- JSON-LD (schema.org `Person` sur la page à propos, `CreativeWork` sur les projets)
- URLs propres via les slugs Payload

**Prompt Cursor :**
> "Ajoute `generateMetadata` sur `/projets/[slug]/page.tsx` qui lit le projet via Payload et génère title, description, openGraph.images à partir de `cover`. Crée `/app/sitemap.ts` qui liste dynamiquement toutes les routes projets publiées."

---

## 16 - Performance

- Images : toujours via `next/image`, format généré par Payload/Vercel Blob en AVIF/WebP
- ISR : `revalidate = 3600` par défaut sur les pages de contenu, + **revalidation à la demande** déclenchée par un hook Payload `afterChange` qui appelle `revalidatePath` (voir section 24)
- Fonts en `next/font` (self-hosted, pas de requête externe Google Fonts)
- Analyser le bundle avec `@next/bundle-analyzer`
- Lazy-load des sections lourdes (galeries, Framer Motion) via `dynamic()`

---

## 17 - Sécurité

- Variables sensibles uniquement en variables d'environnement Vercel (jamais commit)
- Validation stricte des inputs du formulaire de contact (zod) côté serveur, pas seulement côté client
- Rate limiting sur `/api/*` et `/admin` (via middleware, ou Vercel Firewall)
- Headers de sécurité (`next.config.ts` → `headers()`) : CSP, X-Frame-Options, Referrer-Policy
- Payload : rôles utilisateurs stricts, `access control` par collection (lecture publique en `published` uniquement, écriture réservée à l'admin)
- Sanitize du contenu riche affiché (Lexical → React évite le XSS par design si on n'utilise pas `dangerouslySetInnerHTML`)

**Prompt Cursor :**
> "Ajoute des règles `access` sur la collection Projects : `read` public uniquement si `status === 'published'`, `create/update/delete` réservé aux utilisateurs authentifiés. Configure les headers de sécurité dans `next.config.ts`."

---

## 18 - Formulaires

- Formulaire de contact : React Hook Form + zod pour la validation
- Soumission → Server Action Next.js → envoi email via Resend + stockage en base (collection FormSubmissions, via le plugin form-builder de Payload)
- Protection anti-spam : honeypot field + rate limiting par IP, éventuellement Cloudflare Turnstile
- Feedback UX : état loading, succès, erreur, avec toast (`sonner` par exemple)

---

## 19 - Gestion des médias

- Plugin `@payloadcms/storage-vercel-blob` branché sur la collection Media
- Génération automatique de tailles (thumbnail, card, hero) via `imageSizes` dans la config Payload
- Alt text **obligatoire** (champ required) pour l'accessibilité et le SEO
- Formats optimisés servis automatiquement par `next/image`

**Prompt Cursor :**
> "Configure la collection Media avec `imageSizes` (thumbnail 400px, card 800px, hero 1600px), branche le storage adapter Vercel Blob, rends le champ `alt` obligatoire."

---

## 20 - Blog

*(optionnel, activable après le MVP)*

- Collection `Posts` : title, slug, excerpt, content (richText), cover, publishedDate, tags, author
- Réutilise les mêmes patterns que Projects (SSG + revalidation)
- RSS feed optionnel via route handler `/feed.xml`

---

## 21 - Portfolio

- Filtres côté client sur `/projets` (par stack/tag) sans requête serveur supplémentaire — on charge tous les projets publiés une fois (rarement > 30) et on filtre en state React
- Tri par `order` (défini dans Payload, drag-and-drop possible via plugin `@payloadcms/plugin-nested-docs` ou champ number manuel)
- Page détail avec galerie (lightbox), stack utilisée en badges, liens live/repo

---

## 22 - Dashboard Admin

- C'est l'admin Payload natif à `/admin` — rien à développer, juste à **configurer** :
  - Réorganiser les groupes de collections dans la sidebar (`admin.group` dans chaque collection)
  - Ajouter des descriptions d'aide sur les champs (`admin.description`) pour te souvenir de l'usage de chaque champ dans 6 mois
  - Configurer les colonnes visibles en liste (`admin.useAsTitle`, `admin.defaultColumns`)
  - Preview live : brancher `admin.livePreview` pour voir le rendu front en temps réel pendant l'édition

**Prompt Cursor :**
> "Configure `admin.livePreview` sur la collection Projects pour prévisualiser `/projets/[slug]` en temps réel depuis l'admin Payload, avec breakpoints mobile/desktop."

---

## 23 - API

- Payload expose automatiquement REST (`/api/projects`) et GraphQL (`/api/graphql`) — utile si un jour tu veux consommer le contenu depuis une autre app (mobile, etc.)
- En interne (Next.js front), on n'utilise **pas** cette API HTTP, on passe par la Local API (plus rapide, pas de sérialisation réseau)
- Si besoin d'endpoints custom (ex: stats de vues), créer des route handlers dans `app/(payload)/api/`

---

## 24 - Server Actions

- Formulaire de contact → Server Action qui valide (zod), envoie l'email (Resend), stocke en base
- Revalidation à la demande : hook Payload `afterChange` sur chaque collection qui appelle un endpoint interne ou directement `revalidatePath`/`revalidateTag` pour que les pages statiques se régénèrent instantanément après une modif dans le backoffice, sans attendre le `revalidate` time-based

**Prompt Cursor :**
> "Ajoute un hook `afterChange` sur la collection Projects qui appelle `revalidatePath('/projets')` et `revalidatePath('/projets/' + doc.slug)` pour que la publication soit immédiate côté front."

---

## 25 - Variables d'environnement

```env
# Base de données
DATABASE_URI=

# Payload
PAYLOAD_SECRET=

# Stockage médias
BLOB_READ_WRITE_TOKEN=

# Email
RESEND_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=
```

- `.env.local` en dev, jamais commité (`.gitignore`)
- Mêmes variables renseignées dans Vercel (Production + Preview), avec des valeurs différentes si besoin (ex: base Neon différente en preview via branching automatique)

---

## 26 - Déploiement

1. Repo GitHub connecté à Vercel
2. Intégration Neon via Vercel Marketplace (auto-configure `DATABASE_URI` + branching par PR)
3. Build command par défaut Next.js (`next build`), Payload s'intègre dans le même build
4. Domaine custom branché sur Vercel, DNS via le registrar
5. Chaque push sur `main` → déploiement production ; chaque PR → Preview Deployment avec sa propre branche Neon isolée

**Checklist avant premier déploiement :**
- [ ] Toutes les variables d'env renseignées sur Vercel
- [ ] `PAYLOAD_SECRET` généré aléatoirement (pas de valeur par défaut)
- [ ] Build local réussi (`pnpm build`) avant push

---

## 27 - Monitoring

- Vercel Analytics (Core Web Vitals réels)
- Vercel Logs / Observability pour les erreurs serverless
- Neon : dashboard de requêtes lentes, usage du compute
- Alerte email en cas d'échec de build Vercel (natif)
- Optionnel : Sentry pour le tracking d'erreurs front/back

---

## 28 - Tests

- **Unitaires** : Vitest sur les fonctions utilitaires (slugify, formatters)
- **Composants** : React Testing Library sur les composants UI critiques (ContactForm, ProjectCard)
- **E2E** : Playwright — parcours critique (navigation, soumission du formulaire, affichage d'un projet)
- **Accessibilité** : audit axe-core en CI
- Pas besoin de couverture à 100% — prioriser le formulaire de contact et le rendu des pages projets (ce qui casserait le plus visiblement)

---

## 29 - Roadmap

**Phase 1 — Fondations (semaine 1)**
- Sections 03 à 08 : install, structure, DB, collections Payload de base, auth

**Phase 2 — Design System (semaine 1-2)**
- Sections 09 à 13 : composants UI, responsive, animations

**Phase 3 — Pages & contenu (semaine 2-3)**
- Sections 14, 18, 19, 21 : toutes les pages branchées sur Payload, formulaire, médias

**Phase 4 — Qualité (semaine 3)**
- Sections 15, 16, 17 : SEO, perf, sécurité

**Phase 5 — Mise en prod (semaine 4)**
- Sections 25, 26, 27, 28 : env, déploiement, monitoring, tests

**Phase 6 — Extensions (post-v1)**
- Sections 20, 33 : blog, évolutions futures

---

## 30 - Checklist

**Avant de considérer le MVP terminé :**
- [ ] Toutes les pages se chargent sans donnée en dur (100% CMS-driven)
- [ ] Backoffice permet de tout modifier sans toucher au code (textes, images, ordre, statut)
- [ ] Formulaire de contact envoie bien un email et log en base
- [ ] Lighthouse ≥ 95 sur mobile et desktop
- [ ] Responsive validé sur au moins 3 tailles d'écran réelles
- [ ] SEO : sitemap, meta, OG tags présents sur toutes les pages
- [ ] Aucune variable sensible commitée
- [ ] Déployé en production avec domaine custom

---

## 31 - Conventions Cursor

- Toujours préciser à l'agent : **Server Component par défaut**, `'use client'` uniquement si nécessaire (interactivité, hooks)
- Toujours demander l'usage de la **Local API Payload** plutôt que fetch HTTP pour les données internes
- Nommer les composants en `PascalCase`, les fichiers utilitaires en `camelCase`
- Un composant = un fichier, colocalisation des styles Tailwind (pas de CSS modules séparés)
- Demander systématiquement à l'agent de **générer les types Payload** (`payload generate:types`) après toute modif de collection, et de les importer plutôt que de retyper à la main
- Toujours demander un check TypeScript strict avant de considérer une tâche terminée

---

## 32 - Prompts IA

Quelques prompts prêts à l'emploi pour accélérer le vibe-coding :

**Génération d'une collection complète :**
> "Crée la collection Payload `[Nom]` avec les champs suivants : [liste]. Ajoute les access control appropriés, un hook de slugification si pertinent, et regénère les types."

**Génération d'une page :**
> "Implémente la page `/[route]` en Server Component. Récupère les données via `payload.find()`/`findByID()` sur la collection `[X]`. Utilise les composants `[liste de composants UI existants]`. Ajoute `generateMetadata` pour le SEO."

**Debug d'un build Vercel :**
> "Voici le log d'erreur de build Vercel : [coller le log]. Identifie la cause et corrige."

**Refactor design :**
> "Reprends le composant `[X]` pour respecter le design system : fond dark glassmorphism, typographie Syne pour les titres, DM Sans pour le texte, animations Framer Motion au scroll."

---

## 33 - Évolutions futures

- Multi-langue (FR/EN) via `next-intl` + localisation native de Payload
- Espace "études de cas" plus riche (études longues avec sommaire sticky)
- Statistiques de vues par projet (compteur simple en base)
- Newsletter (intégration Resend Broadcasts ou Buttondown)
- Mode clair optionnel
- Intégration d'un CV dynamique généré en PDF à partir des données Payload (Experiences + Skills)
- Recherche full-text sur le blog (Postgres `tsvector` ou Algolia)

---

### Pour démarrer maintenant

Ordre recommandé d'attaque avec Cursor : **03 → 05 → 06 → 07 → 09 → 13 → 14 → 24 → 18 → 15 → 26**. Chaque section ci-dessus peut être collée telle quelle en prompt à l'agent, une à la fois, en validant le build entre chaque étape.
