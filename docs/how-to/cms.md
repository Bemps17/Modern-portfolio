# How-to — CMS Payload

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

- `site-settings` — nom, tagline, email, réseaux, intro à propos
- `seo-defaults` — titre/description/OG par défaut

## Publier un projet

1. Admin → Projects → statut **Publié** (`published`)
2. `afterChange` revalide : `/`, `/projets`, `/projets/[slug]`, `/a-propos`
3. Preview admin : bouton sur le document → `/projets/[slug]`

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
