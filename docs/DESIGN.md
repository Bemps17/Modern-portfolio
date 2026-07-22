# Design system — Modern Portfolio

> Référence visuelle. Règles d’usage UI : `docs/DEVELOPMENT.md` § UI.

**Source de vérité CSS :** `src/app/(frontend)/styles.css` (`:root`)

---

## Identité

- **Thème :** dark-first, orange/noir, glassmorphism
- **Règle 60-30-10 :** ~60 % fond sombre, ~30 % surfaces/contenu, ~10 % accent orange
- **Pas de mode clair** sans décision produit explicite

## Typographie (`next/font`)

| Rôle | Variable | Police |
|---|---|---|
| Display / titres | `--font-syne` | Syne |
| Corps | `--font-dm-sans` | DM Sans |
| Labels / stats | `--font-space-grotesk` | Space Grotesk |

Usage : `font-[family-name:var(--font-syne)]`

## Palette (tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--background` | `#0a0a0a` | Fond principal |
| `--background-elevated` | `#111014` | Modales, surfaces |
| `--foreground` | `#f5f1ea` | Texte principal |
| `--muted` | `#8a8580` | Texte secondaire |
| `--border` | `rgb(255 255 255 / 0.08)` | Bordures subtiles |
| `--glass` | `rgb(255 255 255 / 0.05)` | Cartes glass |
| `--accent` | `#ff6b1a` | CTA, liens actifs |
| `--accent-secondary` | `#991b1b` | Dégradés |
| `--accent-soft` | `#ffb347` | Texte accentué |
| `--accent-glow` | `rgb(255 107 26 / 0.18)` | Halos survol |
| `--accent-secondary-glow` | `rgb(153 27 27 / 0.14)` | Halos secondaires |

## Composants primitives

| Composant | Fichier |
|---|---|
| `Button` | `src/components/ui/Button.tsx` |
| `Badge` | `src/components/ui/Badge.tsx` |
| `GlassCard` | `src/components/ui/GlassCard.tsx` |
| `SectionTitle` | `src/components/ui/SectionTitle.tsx` |
| `Container` | `src/components/ui/Container.tsx` |
| `EditorialTitle` | `src/components/ui/EditorialTitle.tsx` |

Icônes : **lucide-react** uniquement.

## Layout responsive

| Viewport | Navigation |
|---|---|
| `< lg` | `BottomTabBar` (4 onglets) |
| `≥ lg` | `Sidebar` fixe 72px |

## Motion

- `prefers-reduced-motion` : animations réduites globalement (`styles.css`)
- Effets riches (mesh, glow, curseur custom) : **desktop** (`pointer: fine`) — `FunEffects.tsx`
- Ne pas masquer du contenu critique avec `opacity: 0` par défaut

## Ajouter un token

1. Déclarer dans `:root` (`styles.css`)
2. Documenter ici (tableau palette)
3. Vérifier : `pnpm check:tokens`

## Contraste

Cible **WCAG AA** sur texte body (`--foreground`, `--muted`) sur `--background`.  
Audit formel : 🎯 `tests/a11y.spec.ts` (à venir).

---

## Admin Payload (white-label)

Source de vérité : `src/app/(payload)/custom.scss` (hors frontend Tailwind).

| Token | Valeur | Usage |
|---|---|---|
| `--brand-bg` | `#0c0e12` | Fond admin |
| `--brand-surface` | `#12151a` | Sidebar, cartes, inputs |
| `--brand-text` | `#f4f5f6` | Texte principal |
| `--brand-text-muted` | `#9aa0ab` | Labels, secondaires |
| `--brand-accent` | `#ff850a` | CTA primary, focus, active nav |
| `--brand-success` | `#3d9a6a` | Statuts OK (pas l’accent) |
| `--brand-error` | `#e05a52` | Erreurs |

- `admin.theme: 'dark'` — pas de mode clair
- Pas de Tailwind dans l’admin (évite le preflight)
- Détails pratiques : `docs/how-to/cms.md` § Thème admin
