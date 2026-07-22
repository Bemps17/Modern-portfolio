# How-to — CMS Payload

## Thème admin (marque)

Look & feel white-label dark — tokens + overrides dans :

| Élément | Fichier |
|---|---|
| Tokens / overrides CSS | `src/app/(payload)/custom.scss` |
| Config (`theme`, `meta`, `graphics`, `i18n`) | `src/payload.config.ts` → `admin` |
| Logo login | `src/components/admin/Logo.tsx` |
| Icône sidebar | `src/components/admin/Icon.tsx` |

**Ajuster rapidement :**

1. Couleurs / rayons / typo → variables `--brand-*` et `--color-base-*` en tête de `custom.scss`
2. Accent → `--brand-accent` (`#ff850a` par défaut)
3. Logo / favicon admin → `Logo.tsx` / `Icon.tsx` + `admin.meta.icons`
4. Langue → `i18n.fallbackLanguage` / `supportedLanguages` (`fr` uniquement)

Après changement de `admin.components` : `pnpm generate:importmap`.

## Collections

| Slug | Rôle |
|---|---|
| `projects` | Projets (slug, cover, stack, featured, `status`) |
| `skills` | Compétences |
| `experiences` | Parcours |
| `media` | Uploads (Vercel Blob si `BLOB_READ_WRITE_TOKEN`) |
| `form-submissions` | Inbox contact |
| `users` | Admins |

## Globals

- `site-settings` — nom, tagline, **logo**, **favicon**, avatar, email, réseaux, intro à propos, **disponibilité**, **localisation**, **approche**, **aboutBody**
- `seo-defaults` — titre/description/OG par défaut

## Accueil (structure v0.8)

1. Hero — brand + badge disponibilité + CTAs  
2. Marquee skills (max 8)  
3. Projets à la une (max 5, bento + index)  
4. Approche (3 étapes CMS)  
5. Bandeau contact + statut  

Éditer disponibilité / approche : Admin → **Paramètres du site**.

## Logo & favicon (dashboard)

1. Admin → **Paramètres du site** (`Globals` → Site Settings)
2. Uploader **Logo** (PNG/SVG carré) → sidebar / header
3. Uploader **Favicon** (PNG 32×32 ou SVG) → onglet navigateur
4. Enregistrer — revalidation auto de `/`, `/a-propos`, etc.

Sans upload CMS, fallback : `/brand/favicon.png`.

## Publier un projet

1. Admin → Projects → statut **Publié** (`published`)
2. `afterChange` / `afterDelete` revalident le front (`revalidatePublicSite`)
3. Toast admin natif à l’enregistrement / suppression
4. Preview admin : bouton sur le document → `/projets/[slug]`

## Actualiser le cache du site

- **Auto** : chaque create / update / delete (projets, skills, expériences, médias, globals) invalide le cache Next des pages publiques.
- **Manuel** : bouton **Actualiser le site** dans la barre du haut de l’admin → `POST /api/admin/revalidate` (auth cookie) + toast de confirmation.

## Seed Neon

```bash
# .env.local avec DATABASE_URI + PAYLOAD_SECRET
pnpm seed:portfolio
```

## Après modification de schéma

```bash
pnpm generate:types
pnpm generate:importmap
pnpm build
```

## Mode démo (sans env)

`src/lib/content.ts` bascule sur `portfolio-fallback.ts`. Le build Vercel doit rester vert sans `PAYLOAD_SECRET`.
