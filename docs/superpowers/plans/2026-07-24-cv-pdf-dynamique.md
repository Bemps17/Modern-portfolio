# CV PDF dynamique — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrichir le CMS avec les données pertinentes du CV Bertrand Fouquet, puis exposer un bouton « Télécharger le CV » qui génère un PDF à la volée depuis ces données (mode CMS et mode démo).

**Architecture:** Une couche pure `buildCvDocumentData()` assemble un DTO typé à partir de `getSiteSettingsContent()`, `getExperiences()`, `getQualifications()` et des compétences CV. Une Route Handler `GET /api/cv` rend ce DTO via `@react-pdf/renderer` (`CvDocument`). Si `site-settings.cv` (upload PDF) est renseigné, la route streame ce fichier à la place (override manuel). Aucun fetch REST Payload depuis le front — Local API uniquement dans la route serveur.

**Tech Stack:** Next.js 16 App Router, Payload 3, Vitest, `@react-pdf/renderer`, TypeScript, tokens CSS du design system (PDF = couleurs figées hex équivalentes, pas de CSS variables runtime).

## Global Constraints

- CMS-first : zéro copy marketing en dur dans les pages React (fallback uniquement dans `portfolio-fallback.ts` + seed)
- Local API Payload — pas de `fetch('/api/projects')` / `fetch('/api/…')` Payload depuis le front ; la route `/api/cv` est une Route Handler Next légitime
- Ne pas casser le mode démo (`isPayloadConfigured()` / `portfolio-fallback.ts`)
- Server Components par défaut ; `'use client'` seulement pour le bouton si nécessaire (préférer `<a href="/api/cv">` serveur)
- Pas de lib UI lourde (shadcn, MUI…)
- Pas de secrets dans le code ou les commits
- Scope minimal — une PR = CV PDF dynamique + données CV
- `SITE_VERSION` bumpé à `0.13.0` à la livraison
- Source chronologie récente : **CMS déjà curaté gagne** (Malakoff Humanis, Commercial B2B, Sonotra/PAPREC fusionnés). Le fichier CV uploadé est une **source d’enrichissement**, pas un remplacement aveugle — le poste GEIQ (oct. 2024 – en cours) du fichier CV est **hors scope** (conflit avec la chronologie CMS 2025)
- RQTH : champ CMS optionnel, affiché sur le PDF uniquement si `showRqthOnCv === true`
- Dépendance PDF : `@react-pdf/renderer` uniquement (pas de Puppeteer / Chrome headless)
- Gate : `pnpm verify` vert avant merge

## Décisions produit (fichier CV → CMS)

| Élément CV | Action |
|---|---|
| Coordonnées (Puilboreau, tél, email) | Nouveaux champs `phone` + raffiner `location` ; `email` déjà présent |
| Projet professionnel | Nouveau champ `cvPitch` (textarea) — distinct de `aboutIntro` (plus court / Hero) |
| Recommandation | `recommendationQuote` + `recommendationAuthor` |
| Expériences 2023–2025 | **Conserver CMS** ; ne pas importer GEIQ ; optionnellement enrichir bullets Hautier/Casquette si trop courts |
| Compétences à niveaux % | Nouveau tableau `cvCompetencies` (name, level 0–100, description) — distinct de `skills` (badges tech) et `skillGroups` (À propos) |
| Formations (3 lignes CV) | Déjà couvertes par `qualifications` élargies — pas de purge ; seed aligne libellés si besoin |
| Disponibilité | Réutiliser `availability` + `availabilityLabel` (`Disponible immédiatement`) |
| RQTH / Permis / Langues / Centres d’intérêt | Groupe admin « Profil CV » : `rqthNote`, `showRqthOnCv`, `mobility`, `languages[]`, `interests` |
| Upload `cv` existant | Conservé comme **override** : si média PDF lié, `/api/cv` le streame ; sinon génération dynamique |

## File Structure

| Fichier | Rôle |
|---|---|
| `src/lib/cv/types.ts` | DTO `CvDocumentData` + types associés |
| `src/lib/cv/build-cv-data.ts` | Assembleur pur (testable) |
| `src/lib/cv/format-date-range.ts` | Format dates FR pour PDF |
| `src/components/cv/CvDocument.tsx` | Document `@react-pdf/renderer` |
| `src/app/api/cv/route.ts` | `GET` → `application/pdf` |
| `src/components/sections/CvDownloadButton.tsx` | Lien bouton (Server Component OK) |
| `src/globals/SiteSettings.ts` | Champs profil CV |
| `src/lib/content.ts` | Expose les nouveaux champs dans `SiteSettingsContent` |
| `src/data/portfolio-fallback.ts` | Valeurs démo alignées CV |
| `scripts/seed-portfolio.ts` | Upsert des nouveaux champs + compétences CV |
| `tests/int/cv-build-data.int.spec.ts` | Tests assembleur |
| `tests/int/cv-api.int.spec.ts` | Tests route PDF (buffer non vide, content-type) |
| `src/lib/site-version.ts` | `0.13.0` |

---

### Task 1: DTO + formatage de dates (TDD)

**Files:**
- Create: `src/lib/cv/types.ts`
- Create: `src/lib/cv/format-date-range.ts`
- Create: `tests/int/cv-format-date.int.spec.ts`

**Interfaces:**
- Produces: `formatCvDateRange(dateStart: string, dateEnd: string | null | undefined, current: boolean): string`
- Produces: types `CvDocumentData`, `CvExperienceItem`, `CvQualificationItem`, `CvCompetencyItem`, `CvLanguageItem`

- [ ] **Step 1: Write the failing test**

Créer `tests/int/cv-format-date.int.spec.ts` :

```ts
import { describe, expect, it } from 'vitest'

import { formatCvDateRange } from '../../src/lib/cv/format-date-range'

describe('formatCvDateRange', () => {
  it('formats a closed range in French abbreviated months', () => {
    expect(formatCvDateRange('2023-10-01', '2024-06-01', false)).toBe('oct. 2023 – juin 2024')
  })

  it('uses Présent when current is true', () => {
    expect(formatCvDateRange('2025-11-01', null, true)).toBe('nov. 2025 – Présent')
  })

  it('uses Présent when current is true even if dateEnd is set', () => {
    expect(formatCvDateRange('2025-11-01', '2026-01-01', true)).toBe('nov. 2025 – Présent')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-format-date.int.spec.ts`
Expected: FAIL with module not found / `formatCvDateRange` not defined

- [ ] **Step 3: Write types**

Créer `src/lib/cv/types.ts` :

```ts
export type CvLanguageItem = {
  name: string
  level: string
}

export type CvCompetencyItem = {
  name: string
  level: number
  description: string
}

export type CvExperienceItem = {
  title: string
  company: string
  dateLabel: string
  description: string
  earlyCareer: boolean
}

export type CvQualificationItem = {
  title: string
  organization: string | null
  yearLabel: string | null
  description: string | null
}

export type CvDocumentData = {
  fullName: string
  tagline: string
  email: string
  phone: string | null
  location: string | null
  pitch: string
  recommendationQuote: string | null
  recommendationAuthor: string | null
  availabilityLabel: string | null
  mobility: string | null
  interests: string | null
  rqthNote: string | null
  showRqthOnCv: boolean
  languages: CvLanguageItem[]
  competencies: CvCompetencyItem[]
  experiences: CvExperienceItem[]
  qualifications: CvQualificationItem[]
}
```

- [ ] **Step 4: Write minimal formatCvDateRange**

Créer `src/lib/cv/format-date-range.ts` :

```ts
const MONTHS_FR = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
] as const

function formatMonthYear(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${MONTHS_FR[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatCvDateRange(
  dateStart: string,
  dateEnd: string | null | undefined,
  current: boolean,
): string {
  const start = formatMonthYear(dateStart)
  if (current) return `${start} – Présent`
  if (!dateEnd) return start
  return `${start} – ${formatMonthYear(dateEnd)}`
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-format-date.int.spec.ts`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/lib/cv/types.ts src/lib/cv/format-date-range.ts tests/int/cv-format-date.int.spec.ts
git commit -m "feat(cv): types DTO et formatage de dates FR"
```

---

### Task 2: Assembleur pur `buildCvDocumentData` (TDD)

**Files:**
- Create: `src/lib/cv/build-cv-data.ts`
- Create: `tests/int/cv-build-data.int.spec.ts`

**Interfaces:**
- Consumes: `formatCvDateRange`, `CvDocumentData`
- Produces: `buildCvDocumentData(input: BuildCvDocumentInput): CvDocumentData`

- [ ] **Step 1: Write the failing test**

Créer `tests/int/cv-build-data.int.spec.ts` :

```ts
import { describe, expect, it } from 'vitest'

import { buildCvDocumentData } from '../../src/lib/cv/build-cv-data'

describe('buildCvDocumentData', () => {
  it('maps settings, experiences and qualifications into CvDocumentData', () => {
    const data = buildCvDocumentData({
      settings: {
        siteName: 'Bertrand Fouquet',
        tagline: 'Profil polyvalent',
        email: 'bertrandfouquet@gmail.com',
        phone: '06 66 93 82 35',
        location: '17138 Puilboreau',
        cvPitch:
          'Professionnel expérimenté avec plus de 10 ans d’expérience dans la relation client.',
        aboutIntro: 'Intro courte Hero',
        recommendationQuote: 'Bertrand a su redynamiser notre prospection.',
        recommendationAuthor: 'Directeur Commercial, Entreprise X',
        availabilityLabel: 'Disponible immédiatement',
        mobility: 'Permis B — véhicule personnel, déplacements régionaux',
        interests: 'Création visuelle, Technologie, Art',
        rqthNote: 'RQTH — adaptations possibles du poste de travail.',
        showRqthOnCv: true,
        languages: [
          { name: 'Anglais', level: 'Conversationnel' },
          { name: 'Espagnol', level: 'Scolaire' },
        ],
        cvCompetencies: [
          {
            name: 'Prospection B2B/B2C',
            level: 85,
            description: 'Qualification de leads et conversion',
          },
        ],
      },
      experiences: [
        {
          title: 'Téléconseiller',
          company: 'Malakoff Humanis',
          dateStart: '2025-11-01',
          dateEnd: null,
          current: true,
          earlyCareer: false,
          description: 'Relation client et conseil.',
        },
        {
          title: 'Attaché Commercial Terrain',
          company: 'Diverses entreprises',
          dateStart: '2007-01-01',
          dateEnd: '2012-12-01',
          current: false,
          earlyCareer: true,
          description: 'Prospection B2B terrain.',
        },
      ],
      qualifications: [
        {
          title: 'Infographiste Designer Web',
          organization: 'AP Formation',
          year: 2023,
          description: 'Design graphique et web.',
        },
      ],
    })

    expect(data.fullName).toBe('Bertrand Fouquet')
    expect(data.pitch).toContain('10 ans')
    expect(data.phone).toBe('06 66 93 82 35')
    expect(data.experiences).toHaveLength(2)
    expect(data.experiences[0].dateLabel).toBe('nov. 2025 – Présent')
    expect(data.experiences[0].earlyCareer).toBe(false)
    expect(data.experiences[1].earlyCareer).toBe(true)
    expect(data.qualifications[0].yearLabel).toBe('2023')
    expect(data.competencies[0].level).toBe(85)
    expect(data.showRqthOnCv).toBe(true)
    expect(data.languages).toHaveLength(2)
  })

  it('falls back pitch to aboutIntro when cvPitch is empty', () => {
    const data = buildCvDocumentData({
      settings: {
        siteName: 'Bertrand Fouquet',
        tagline: 'Tag',
        email: 'a@b.c',
        phone: null,
        location: null,
        cvPitch: null,
        aboutIntro: 'Pitch de secours',
        recommendationQuote: null,
        recommendationAuthor: null,
        availabilityLabel: null,
        mobility: null,
        interests: null,
        rqthNote: null,
        showRqthOnCv: false,
        languages: [],
        cvCompetencies: [],
      },
      experiences: [],
      qualifications: [],
    })
    expect(data.pitch).toBe('Pitch de secours')
    expect(data.showRqthOnCv).toBe(false)
  })

  it('clamps competency level between 0 and 100', () => {
    const data = buildCvDocumentData({
      settings: {
        siteName: 'Bertrand Fouquet',
        tagline: 'Tag',
        email: 'a@b.c',
        phone: null,
        location: null,
        cvPitch: 'Pitch',
        aboutIntro: null,
        recommendationQuote: null,
        recommendationAuthor: null,
        availabilityLabel: null,
        mobility: null,
        interests: null,
        rqthNote: null,
        showRqthOnCv: false,
        languages: [],
        cvCompetencies: [{ name: 'X', level: 140, description: 'Y' }],
      },
      experiences: [],
      qualifications: [],
    })
    expect(data.competencies[0].level).toBe(100)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-build-data.int.spec.ts`
Expected: FAIL with module not found

- [ ] **Step 3: Write minimal implementation**

Créer `src/lib/cv/build-cv-data.ts` :

```ts
import { formatCvDateRange } from './format-date-range'
import type { CvDocumentData } from './types'

export type BuildCvSettingsInput = {
  siteName: string
  tagline: string
  email: string
  phone?: string | null
  location?: string | null
  cvPitch?: string | null
  aboutIntro?: string | null
  recommendationQuote?: string | null
  recommendationAuthor?: string | null
  availabilityLabel?: string | null
  mobility?: string | null
  interests?: string | null
  rqthNote?: string | null
  showRqthOnCv?: boolean | null
  languages?: Array<{ name: string; level: string }> | null
  cvCompetencies?: Array<{ name: string; level: number; description: string }> | null
}

export type BuildCvExperienceInput = {
  title: string
  company: string
  dateStart: string
  dateEnd?: string | null
  current?: boolean | null
  earlyCareer?: boolean | null
  description: string
}

export type BuildCvQualificationInput = {
  title: string
  organization?: string | null
  year?: number | null
  description?: string | null
}

export type BuildCvDocumentInput = {
  settings: BuildCvSettingsInput
  experiences: BuildCvExperienceInput[]
  qualifications: BuildCvQualificationInput[]
}

function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return 0
  return Math.min(100, Math.max(0, Math.round(level)))
}

export function buildCvDocumentData(input: BuildCvDocumentInput): CvDocumentData {
  const { settings, experiences, qualifications } = input
  const pitch = settings.cvPitch?.trim() || settings.aboutIntro?.trim() || settings.tagline

  return {
    fullName: settings.siteName,
    tagline: settings.tagline,
    email: settings.email,
    phone: settings.phone?.trim() || null,
    location: settings.location?.trim() || null,
    pitch,
    recommendationQuote: settings.recommendationQuote?.trim() || null,
    recommendationAuthor: settings.recommendationAuthor?.trim() || null,
    availabilityLabel: settings.availabilityLabel?.trim() || null,
    mobility: settings.mobility?.trim() || null,
    interests: settings.interests?.trim() || null,
    rqthNote: settings.rqthNote?.trim() || null,
    showRqthOnCv: Boolean(settings.showRqthOnCv),
    languages: (settings.languages || []).map((lang) => ({
      name: lang.name,
      level: lang.level,
    })),
    competencies: (settings.cvCompetencies || []).map((item) => ({
      name: item.name,
      level: clampLevel(item.level),
      description: item.description,
    })),
    experiences: experiences.map((experience) => ({
      title: experience.title,
      company: experience.company,
      dateLabel: formatCvDateRange(
        experience.dateStart,
        experience.dateEnd,
        Boolean(experience.current),
      ),
      description: experience.description,
      earlyCareer: Boolean(experience.earlyCareer),
    })),
    qualifications: qualifications.map((qualification) => ({
      title: qualification.title,
      organization: qualification.organization?.trim() || null,
      yearLabel:
        qualification.year !== null && qualification.year !== undefined
          ? String(qualification.year)
          : null,
      description: qualification.description?.trim() || null,
    })),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-build-data.int.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/cv/build-cv-data.ts tests/int/cv-build-data.int.spec.ts
git commit -m "feat(cv): assembleur pur buildCvDocumentData"
```

---

### Task 3: Schéma Payload — champs profil CV

**Files:**
- Modify: `src/globals/SiteSettings.ts` (après le champ `cv` upload, avant `aboutIntro`)
- Modify: `src/lib/content.ts` (`SiteSettingsContent` + `withEditorialFallback`)
- Run: `pnpm generate:types`

**Interfaces:**
- Produces (Payload / types générés) : `phone`, `cvPitch`, `recommendationQuote`, `recommendationAuthor`, `mobility`, `interests`, `rqthNote`, `showRqthOnCv`, `languages[]`, `cvCompetencies[]`
- Produces: ces champs exposés sur `SiteSettingsContent`

- [ ] **Step 1: Write schema test expectations**

Ajouter dans `tests/int/payload-schema.int.spec.ts` (ou créer `tests/int/cv-schema.int.spec.ts` si le fichier existant est trop couplé) un test qui charge la config Payload et vérifie la présence des champs :

```ts
import { describe, expect, it } from 'vitest'

import { SiteSettings } from '../../src/globals/SiteSettings'

describe('SiteSettings CV profile fields', () => {
  const names = SiteSettings.fields
    .map((field) => ('name' in field ? field.name : null))
    .filter(Boolean)

  it('declares CV profile fields', () => {
    expect(names).toEqual(
      expect.arrayContaining([
        'phone',
        'cvPitch',
        'recommendationQuote',
        'recommendationAuthor',
        'mobility',
        'interests',
        'rqthNote',
        'showRqthOnCv',
        'languages',
        'cvCompetencies',
      ]),
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-schema.int.spec.ts`
Expected: FAIL (champs absents)

- [ ] **Step 3: Add fields to SiteSettings**

Dans `src/globals/SiteSettings.ts`, **immédiatement après** le bloc `cv` (upload), insérer :

```ts
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Téléphone affiché sur le CV PDF.',
      },
    },
    {
      name: 'cvPitch',
      type: 'textarea',
      admin: {
        description: 'Projet professionnel / pitch long pour le CV PDF (sinon aboutIntro).',
      },
    },
    {
      name: 'recommendationQuote',
      type: 'textarea',
      admin: {
        description: 'Citation de recommandation (CV PDF).',
      },
    },
    {
      name: 'recommendationAuthor',
      type: 'text',
      admin: {
        description: 'Auteur de la recommandation (ex. « Directeur Commercial, Entreprise X »).',
      },
    },
    {
      name: 'mobility',
      type: 'text',
      admin: {
        description: 'Ex. « Permis B — véhicule personnel, déplacements régionaux ».',
      },
    },
    {
      name: 'interests',
      type: 'text',
      admin: {
        description: 'Centres d’intérêt (CV PDF).',
      },
    },
    {
      name: 'rqthNote',
      type: 'textarea',
      admin: {
        description: 'Mention RQTH / aménagements (sensible — contrôlé par showRqthOnCv).',
      },
    },
    {
      name: 'showRqthOnCv',
      type: 'checkbox',
      defaultValue: false,
      label: 'Afficher la mention RQTH sur le CV PDF',
    },
    {
      name: 'languages',
      type: 'array',
      labels: { singular: 'Langue', plural: 'Langues' },
      admin: {
        description: 'Langues pour le CV PDF.',
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Langue' },
        { name: 'level', type: 'text', required: true, label: 'Niveau' },
      ],
    },
    {
      name: 'cvCompetencies',
      type: 'array',
      labels: { singular: 'Compétence CV', plural: 'Compétences CV' },
      admin: {
        description: 'Compétences à niveau % pour le CV PDF (distinct des badges Skills).',
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Compétence' },
        {
          name: 'level',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          label: 'Niveau (%)',
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description courte',
        },
      ],
    },
```

Mettre aussi à jour la description du champ `cv` upload :

```ts
description: 'Override optionnel : PDF statique. Si vide, /api/cv génère le PDF dynamiquement.',
```

- [ ] **Step 4: Extend SiteSettingsContent**

Dans `src/lib/content.ts`, ajouter à `SiteSettingsContent` :

```ts
  phone?: string | null
  cvPitch?: string | null
  recommendationQuote?: string | null
  recommendationAuthor?: string | null
  mobility?: string | null
  interests?: string | null
  rqthNote?: string | null
  showRqthOnCv?: boolean | null
  languages?: NonNullable<SiteSetting['languages']> | typeof portfolioFallback.siteSettings.languages
  cvCompetencies?:
    | NonNullable<SiteSetting['cvCompetencies']>
    | typeof portfolioFallback.siteSettings.cvCompetencies
  cv?: SiteSetting['cv']
```

Dans `withEditorialFallback`, merger comme pour `skillGroups` :

```ts
    phone: ('phone' in settings && settings.phone?.trim()) || fb.phone,
    cvPitch: ('cvPitch' in settings && settings.cvPitch?.trim()) || fb.cvPitch,
    recommendationQuote:
      ('recommendationQuote' in settings && settings.recommendationQuote?.trim()) ||
      fb.recommendationQuote,
    recommendationAuthor:
      ('recommendationAuthor' in settings && settings.recommendationAuthor?.trim()) ||
      fb.recommendationAuthor,
    mobility: ('mobility' in settings && settings.mobility?.trim()) || fb.mobility,
    interests: ('interests' in settings && settings.interests?.trim()) || fb.interests,
    rqthNote: ('rqthNote' in settings && settings.rqthNote?.trim()) || fb.rqthNote,
    showRqthOnCv:
      'showRqthOnCv' in settings && settings.showRqthOnCv !== undefined && settings.showRqthOnCv !== null
        ? settings.showRqthOnCv
        : fb.showRqthOnCv,
    languages: settings.languages?.length ? settings.languages : fb.languages,
    cvCompetencies: settings.cvCompetencies?.length ? settings.cvCompetencies : fb.cvCompetencies,
```

- [ ] **Step 5: Generate types**

Run: `pnpm generate:types`
Expected: `src/payload-types.ts` contient les nouveaux champs sur `SiteSetting`

- [ ] **Step 6: Run schema test**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-schema.int.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/globals/SiteSettings.ts src/lib/content.ts src/payload-types.ts tests/int/cv-schema.int.spec.ts
git commit -m "feat(cms): champs profil CV dans SiteSettings"
```

---

### Task 4: Fallback démo + seed alignés sur le fichier CV

**Files:**
- Modify: `src/data/portfolio-fallback.ts` (`siteSettings`)
- Modify: `scripts/seed-portfolio.ts` (upsert `site-settings` avec les nouveaux champs)

**Interfaces:**
- Consumes: champs Task 3
- Produces: données démo + Neon seedées pour PDF sans édition manuelle admin

- [ ] **Step 1: Update portfolio-fallback siteSettings**

Dans `src/data/portfolio-fallback.ts`, sur l’objet `siteSettings`, ajouter / ajuster :

```ts
    phone: '06 66 93 82 35',
    location: '17138 Puilboreau · ouvert au remote',
    email: 'bertrandfouquet@gmail.com', // si déjà présent, aligner
    availabilityLabel: 'Disponible immédiatement',
    cvPitch:
      'Professionnel expérimenté avec plus de 10 ans d’expérience dans la relation client, la vente terrain, la logistique et la gestion de projet. Titulaire d’un titre professionnel d’attaché commercial et d’une formation récente en infographie/web, je recherche un poste polyvalent où mes compétences commerciales, logistiques et créatives seront pleinement mobilisées.',
    recommendationQuote:
      'Bertrand a su redynamiser notre prospection commerciale avec des méthodes innovantes, entraînant une augmentation de 30% des leads qualifiés en 3 mois.',
    recommendationAuthor: 'Directeur Commercial, Entreprise X',
    mobility: 'Permis B — véhicule personnel, déplacements régionaux',
    interests: 'Création visuelle, Technologie, Art',
    rqthNote:
      'RQTH (Reconnaissance de la qualité de travailleur handicapé) — problèmes de dos. Adaptations possibles du poste de travail.',
    showRqthOnCv: true,
    languages: [
      { name: 'Anglais', level: 'Conversationnel' },
      { name: 'Espagnol', level: 'Scolaire' },
    ],
    cvCompetencies: [
      {
        name: 'Prospection B2B/B2C',
        level: 85,
        description: 'Techniques de prospection, qualification de leads et conversion',
      },
      {
        name: 'Logistique & Exploitation',
        level: 75,
        description: 'Planification de tournées, gestion des flux, optimisation des processus',
      },
      {
        name: 'Gestion de Projet',
        level: 80,
        description: 'Coordination d’équipes, suivi d’objectifs, optimisation des délais',
      },
      {
        name: 'Infographie & Web Design',
        level: 70,
        description: 'Maquettes, identité visuelle, interfaces utilisateur',
      },
      {
        name: 'Relation Client',
        level: 90,
        description: 'Écoute active, résolution de problèmes, fidélisation',
      },
      {
        name: 'CRM & Outils Digitaux',
        level: 80,
        description: 'Logiciels CRM, tableaux de bord, reporting',
      },
      {
        name: 'Organisation & Autonomie',
        level: 85,
        description: 'Priorités, autonomie, respect des délais',
      },
      {
        name: 'Suite Adobe & Office',
        level: 75,
        description: 'Photoshop, Illustrator, InDesign, Excel, Word, PowerPoint',
      },
    ],
```

Ne **pas** remplacer `aboutBody` / timeline expériences déjà curatés sauf si un libellé est factuellement faux.

- [ ] **Step 2: Update seed upsert for site-settings**

Dans `scripts/seed-portfolio.ts`, dans le `payload.updateGlobal` / create de `site-settings`, merger les mêmes clés (`phone`, `cvPitch`, `recommendationQuote`, `recommendationAuthor`, `mobility`, `interests`, `rqthNote`, `showRqthOnCv: true`, `languages`, `cvCompetencies`, `availabilityLabel: 'Disponible immédiatement'`, `location: '17138 Puilboreau · ouvert au remote'`).

Conserver la logique existante qui **préserve l’avatar** déjà uploadé.

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/data/portfolio-fallback.ts scripts/seed-portfolio.ts
git commit -m "feat(cv): fallback et seed profil CV (coordonnées, compétences, RQTH)"
```

---

### Task 5: Document PDF `@react-pdf/renderer`

**Files:**
- Modify: `package.json` / `pnpm-lock.yaml` via `pnpm add`
- Create: `src/components/cv/CvDocument.tsx`

**Interfaces:**
- Consumes: `CvDocumentData`
- Produces: `CvDocument({ data }: { data: CvDocumentData })` — composant React-PDF (`Document` / `Page` / `View` / `Text`)

- [ ] **Step 1: Install dependency**

```bash
pnpm add @react-pdf/renderer
```

Expected: dépendance listée dans `package.json`

- [ ] **Step 2: Create CvDocument**

Créer `src/components/cv/CvDocument.tsx` :

```tsx
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import type { CvDocumentData } from '@/lib/cv/types'

const colors = {
  ink: '#1a1a1a',
  muted: '#4a4a4a',
  accent: '#ff6b1a',
  line: '#e5e0d8',
  soft: '#f7f4ef',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.ink,
  },
  headerName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.accent,
    marginBottom: 4,
  },
  headerTagline: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 8,
  },
  contactLine: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.accent,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.45,
    color: colors.ink,
  },
  quote: {
    marginTop: 4,
    padding: 8,
    backgroundColor: colors.soft,
    fontSize: 9,
    fontStyle: 'italic',
    color: colors.muted,
    lineHeight: 1.4,
  },
  quoteAuthor: {
    marginTop: 4,
    fontSize: 8,
    color: colors.muted,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  jobMeta: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  jobBlock: {
    marginBottom: 8,
  },
  competencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  barTrack: {
    height: 4,
    backgroundColor: colors.line,
    marginBottom: 6,
  },
  barFill: {
    height: 4,
    backgroundColor: colors.accent,
  },
  metaItem: {
    fontSize: 9,
    color: colors.ink,
    marginBottom: 3,
  },
})

export function CvDocument({ data }: { data: CvDocumentData }) {
  const recent = data.experiences.filter((item) => !item.earlyCareer)
  const early = data.experiences.filter((item) => item.earlyCareer)

  return (
    <Document
      author={data.fullName}
      title={`CV — ${data.fullName}`}
      subject={data.tagline}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerName}>{data.fullName}</Text>
        <Text style={styles.headerTagline}>{data.tagline}</Text>
        {data.location ? <Text style={styles.contactLine}>{data.location}</Text> : null}
        {data.phone ? <Text style={styles.contactLine}>{data.phone}</Text> : null}
        <Text style={styles.contactLine}>{data.email}</Text>
        {data.availabilityLabel ? (
          <Text style={styles.contactLine}>{data.availabilityLabel}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>Projet professionnel</Text>
        <Text style={styles.body}>{data.pitch}</Text>

        {data.recommendationQuote ? (
          <>
            <Text style={styles.sectionTitle}>Recommandation</Text>
            <View style={styles.quote}>
              <Text>« {data.recommendationQuote} »</Text>
              {data.recommendationAuthor ? (
                <Text style={styles.quoteAuthor}>— {data.recommendationAuthor}</Text>
              ) : null}
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Expériences professionnelles</Text>
        {recent.map((experience, index) => (
          <View key={`exp-${index}`} style={styles.jobBlock} wrap={false}>
            <Text style={styles.jobTitle}>
              {experience.title} — {experience.company}
            </Text>
            <Text style={styles.jobMeta}>{experience.dateLabel}</Text>
            <Text style={styles.body}>{experience.description}</Text>
          </View>
        ))}

        {early.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Premières expériences</Text>
            {early.map((experience, index) => (
              <View key={`early-${index}`} style={styles.jobBlock} wrap={false}>
                <Text style={styles.jobTitle}>
                  {experience.title} — {experience.company}
                </Text>
                <Text style={styles.jobMeta}>{experience.dateLabel}</Text>
                <Text style={styles.body}>{experience.description}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.competencies.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Compétences clés</Text>
            {data.competencies.map((item, index) => (
              <View key={`comp-${index}`} wrap={false}>
                <View style={styles.competencyRow}>
                  <Text style={styles.jobTitle}>{item.name}</Text>
                  <Text style={styles.jobMeta}>{item.level}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.level}%` }]} />
                </View>
                <Text style={[styles.body, { marginBottom: 6 }]}>{item.description}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.qualifications.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Formations</Text>
            {data.qualifications.map((item, index) => (
              <View key={`qual-${index}`} style={styles.jobBlock} wrap={false}>
                <Text style={styles.jobTitle}>
                  {item.yearLabel ? `${item.yearLabel} · ` : ''}
                  {item.title}
                  {item.organization ? ` — ${item.organization}` : ''}
                </Text>
                {item.description ? <Text style={styles.body}>{item.description}</Text> : null}
              </View>
            ))}
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Informations complémentaires</Text>
        {data.showRqthOnCv && data.rqthNote ? (
          <Text style={styles.metaItem}>Statut — {data.rqthNote}</Text>
        ) : null}
        {data.mobility ? <Text style={styles.metaItem}>Mobilité — {data.mobility}</Text> : null}
        {data.languages.length > 0 ? (
          <Text style={styles.metaItem}>
            Langues —{' '}
            {data.languages.map((lang) => `${lang.name} (${lang.level})`).join(' · ')}
          </Text>
        ) : null}
        {data.interests ? (
          <Text style={styles.metaItem}>Centres d’intérêt — {data.interests}</Text>
        ) : null}
      </Page>
    </Document>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/cv/CvDocument.tsx
git commit -m "feat(cv): document PDF React-PDF (mise en page A4)"
```

---

### Task 6: Route `GET /api/cv` + tests

**Files:**
- Create: `src/lib/cv/get-cv-document-data.ts`
- Create: `src/app/api/cv/route.ts`
- Create: `tests/int/cv-api.int.spec.ts`

**Interfaces:**
- Consumes: `getSiteSettingsContent`, `getExperiences`, `getQualifications`, `buildCvDocumentData`, `CvDocument`
- Produces: `getCvDocumentData(): Promise<CvDocumentData>`
- Produces: `GET /api/cv` → `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="CV-Bertrand-Fouquet.pdf"`

- [ ] **Step 1: Write failing API test**

Créer `tests/int/cv-api.int.spec.ts` :

```ts
import { describe, expect, it } from 'vitest'

describe('GET /api/cv', () => {
  it('returns a non-empty PDF buffer', async () => {
    const { GET } = await import('../../src/app/api/cv/route')
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
    const disposition = response.headers.get('Content-Disposition') || ''
    expect(disposition).toContain('attachment')
    expect(disposition).toContain('.pdf')
    const buffer = Buffer.from(await response.arrayBuffer())
    expect(buffer.byteLength).toBeGreaterThan(500)
    expect(buffer.subarray(0, 4).toString('utf8')).toBe('%PDF')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-api.int.spec.ts`
Expected: FAIL (module route introuvable)

- [ ] **Step 3: Create getCvDocumentData helper**

Créer `src/lib/cv/get-cv-document-data.ts` :

```ts
import { getExperiences, getQualifications, getSiteSettingsContent } from '@/lib/content'

import { buildCvDocumentData } from './build-cv-data'
import type { CvDocumentData } from './types'

export async function getCvDocumentData(): Promise<CvDocumentData> {
  const [settings, experiences, qualifications] = await Promise.all([
    getSiteSettingsContent(),
    getExperiences(),
    getQualifications(),
  ])

  return buildCvDocumentData({
    settings: {
      siteName: settings.siteName,
      tagline: settings.tagline,
      email: settings.email || 'contact@example.com',
      phone: settings.phone,
      location: settings.location,
      cvPitch: settings.cvPitch,
      aboutIntro: settings.aboutIntro,
      recommendationQuote: settings.recommendationQuote,
      recommendationAuthor: settings.recommendationAuthor,
      availabilityLabel: settings.availabilityLabel,
      mobility: settings.mobility,
      interests: settings.interests,
      rqthNote: settings.rqthNote,
      showRqthOnCv: settings.showRqthOnCv,
      languages: settings.languages,
      cvCompetencies: settings.cvCompetencies,
    },
    experiences: experiences.map((experience) => ({
      title: experience.title,
      company: experience.company,
      dateStart: experience.dateStart,
      dateEnd: experience.dateEnd,
      current: experience.current,
      earlyCareer: experience.earlyCareer,
      description: experience.description,
    })),
    qualifications: qualifications.map((qualification) => ({
      title: qualification.title,
      organization: qualification.organization,
      year: qualification.year,
      description: qualification.description,
    })),
  })
}
```

Vérifier les noms exacts des champs `Qualification` dans `payload-types.ts` (`organization` / `institution`, `year` / `date`) et aligner le mapping si différent.

- [ ] **Step 4: Create route handler**

Créer `src/app/api/cv/route.ts` :

```ts
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'

import { CvDocument } from '@/components/cv/CvDocument'
import { getSiteSettingsContent } from '@/lib/content'
import { getCvDocumentData } from '@/lib/cv/get-cv-document-data'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { getPayloadClientSafe } from '@/lib/payload'

export const dynamic = 'force-dynamic'

function pdfFileName(fullName: string): string {
  const slug = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `CV-${slug || 'Portfolio'}.pdf`
}

async function tryStreamUploadedCv(): Promise<Response | null> {
  const settings = await getSiteSettingsContent()
  if (!isMedia(settings.cv)) return null
  const url = resolveMediaUrl(settings.cv)
  if (!url) return null

  // Média local Payload : lire via Local API si possible
  const payload = await getPayloadClientSafe()
  if (payload && typeof settings.cv === 'object' && settings.cv.id) {
    try {
      const file = await payload.findByID({
        collection: 'media',
        id: settings.cv.id,
        depth: 0,
      })
      if (file?.url?.startsWith('http')) {
        const remote = await fetch(file.url)
        if (remote.ok) {
          const bytes = await remote.arrayBuffer()
          return new Response(bytes, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${pdfFileName(settings.siteName)}"`,
              'Cache-Control': 'private, max-age=0, must-revalidate',
            },
          })
        }
      }
    } catch {
      // fallback génération dynamique
    }
  }

  if (url.startsWith('http')) {
    const remote = await fetch(url)
    if (!remote.ok) return null
    const bytes = await remote.arrayBuffer()
    return new Response(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pdfFileName(settings.siteName)}"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    })
  }

  return null
}

export async function GET(): Promise<Response> {
  const uploaded = await tryStreamUploadedCv()
  if (uploaded) return uploaded

  const data = await getCvDocumentData()
  const element = createElement(CvDocument, { data })
  const buffer = await renderToBuffer(element as React.ReactElement)

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdfFileName(data.fullName)}"`,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  })
}
```

Si `settings.cv` n’est pas encore sur `SiteSettingsContent`, l’ajouter (Task 3) ou typer avec optional chaining `settings.cv` après extension.

Simplification YAGNI acceptée : si l’override upload complique trop le premier jet, implémenter **uniquement** la génération dynamique dans cette task et laisser `tryStreamUploadedCv` pour un commit suivant — mais le plan recommande de livrer les deux chemins dans la même task pour coller à la décision produit.

- [ ] **Step 5: Run API test**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-api.int.spec.ts`
Expected: PASS (mode démo via fallback, sans DB obligatoire)

Si le test échoue faute d’env Payload, s’assurer que `getSiteSettingsContent` / `getExperiences` / `getQualifications` basculent bien sur `portfolio-fallback` quand `!isPayloadConfigured()`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cv/get-cv-document-data.ts src/app/api/cv/route.ts tests/int/cv-api.int.spec.ts src/lib/content.ts
git commit -m "feat(cv): route GET /api/cv génère le PDF dynamique"
```

---

### Task 7: Bouton « Télécharger le CV » sur `/a-propos`

**Files:**
- Create: `src/components/sections/CvDownloadButton.tsx`
- Modify: `src/app/(frontend)/a-propos/page.tsx` (CTA sous le profil / près de l’intro)
- Optional: `src/components/sections/Hero.tsx` — **hors scope** sauf si un second CTA est demandé explicitement

**Interfaces:**
- Consumes: `Button` (`href="/api/cv"`)
- Produces: lien téléchargement accessible (texte visible, pas icône seule)

- [ ] **Step 1: Create CvDownloadButton**

Créer `src/components/sections/CvDownloadButton.tsx` :

```tsx
import { Download } from 'lucide-react'

import { Button } from '@/components/ui/Button'

type CvDownloadButtonProps = {
  className?: string
  label?: string
}

export function CvDownloadButton({
  className,
  label = 'Télécharger le CV (PDF)',
}: CvDownloadButtonProps) {
  return (
    <Button className={className} href="/api/cv" variant="glass">
      <Download aria-hidden className="size-4" />
      {label}
    </Button>
  )
}
```

Note : `Button` avec `href` utilise `next/link`. Pour un téléchargement de fichier binaire, préférer une ancre native si `Link` pose problème (prefetch / navigation client). Si besoin, adapter `Button` ou utiliser :

```tsx
<a className={/* classes glass du Button */} data-cursor="link" download href="/api/cv">
```

**Règle :** si `next/link` vers `/api/cv` provoque une navigation HTML cassée en e2e, basculer sur `<a download href="/api/cv">` avec les classes `glass` du design system (copier depuis `Button.tsx`).

Implémentation recommandée (évite Link) :

```tsx
import { Download } from 'lucide-react'

import { cn } from '@/lib/utils'

const glassClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition duration-200 hover:border-[color:var(--accent)]/35 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'

type CvDownloadButtonProps = {
  className?: string
  label?: string
}

export function CvDownloadButton({
  className,
  label = 'Télécharger le CV (PDF)',
}: CvDownloadButtonProps) {
  return (
    <a className={cn(glassClasses, className)} data-cursor="link" href="/api/cv" rel="noopener">
      <Download aria-hidden className="size-4 shrink-0" />
      <span>{label}</span>
    </a>
  )
}
```

- [ ] **Step 2: Wire on About page**

Dans `src/app/(frontend)/a-propos/page.tsx`, importer `CvDownloadButton` et l’afficher sous le bloc intro (après `aboutHeadline` / avant la timeline), dans un conteneur flex :

```tsx
import { CvDownloadButton } from '@/components/sections/CvDownloadButton'
```

Exemple d’insertion (après le paragraphe `aboutBody`) :

```tsx
<div className="mt-6 flex flex-wrap gap-3">
  <CvDownloadButton />
</div>
```

Ne pas ajouter de copy marketing en dur autour du bouton (pas de phrase « Cliquez ici pour… »).

- [ ] **Step 3: Manual smoke (dev)**

```bash
pnpm dev
# puis
curl -sI http://localhost:3000/api/cv | head
curl -s http://localhost:3000/api/cv -o /tmp/cv-test.pdf && file /tmp/cv-test.pdf
```

Expected: `Content-Type: application/pdf` et `file` rapporte `PDF document`

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/CvDownloadButton.tsx src/app/(frontend)/a-propos/page.tsx
git commit -m "feat(about): bouton téléchargement CV PDF"
```

---

### Task 8: Version, docs courtes, verify

**Files:**
- Modify: `src/lib/site-version.ts` → `0.13.0`
- Modify: `docs/DEVELOPMENT.md` — une ligne dans la section pertinente (API / contenu) : `GET /api/cv` génère le CV PDF
- Modify: `docs/how-to/cms.md` — court paragraphe « Profil CV » (champs SiteSettings + override upload)

**Interfaces:**
- Produces: livraison versionnée + how-to éditeur

- [ ] **Step 1: Bump SITE_VERSION**

```ts
export const SITE_VERSION = '0.13.0'
```

- [ ] **Step 2: Document in DEVELOPMENT.md**

Ajouter une ligne dans le tableau / section API :

```md
| `GET /api/cv` | PDF CV dynamique (override si `site-settings.cv` uploadé) | ✅ |
```

- [ ] **Step 3: Document in how-to/cms.md**

Paragraphe :

```md
## CV PDF

Les champs **Profil CV** dans Paramètres du site (`phone`, `cvPitch`, compétences CV, langues, RQTH…) alimentent `GET /api/cv`.
Le bouton « Télécharger le CV » sur `/a-propos` pointe vers cette route.
Si un fichier PDF est uploadé dans le champ **CV**, il est servi à la place de la génération dynamique.
```

- [ ] **Step 4: Run verify**

```bash
pnpm verify
```

Expected: PASS (lint, typecheck, tests int, tokens, build)

Si Postgres local requis pour une partie des tests Payload, démarrer :

```bash
sudo pg_ctlcluster 16 main start
```

- [ ] **Step 5: Seed Neon (si env CMS)**

```bash
pnpm seed:portfolio
```

Expected: `site-settings` mis à jour avec profil CV ; avatar préservé

- [ ] **Step 6: Commit**

```bash
git add src/lib/site-version.ts docs/DEVELOPMENT.md docs/how-to/cms.md
git commit -m "chore(cv): SITE_VERSION 0.13.0 et docs CV PDF"
```

---

## Self-Review

**1. Spec coverage**
- Intégrer éléments pertinents du fichier CV → Tasks 3–4 (champs + seed/fallback) ; chronologie CMS préservée (contrainte globale)
- Bouton téléchargement → Task 7
- Génération PDF depuis datas → Tasks 1–2, 5–6
- Mode démo → fallback Task 4 + content layer Task 3
- Override upload existant → Task 6
- RQTH opt-in → `showRqthOnCv` Tasks 3–5
- GEIQ exclu explicitement (contrainte globale)

**2. Placeholder scan**
- Pas de TBD / « implement later » / « similar to Task N » sans code
- Noms de champs Qualification à **vérifier** contre `payload-types.ts` au Step 3 Task 6 (action concrète, pas un TBD de contenu)

**3. Type consistency**
- `CvDocumentData` / `buildCvDocumentData` / `CvDocument` / `getCvDocumentData` alignés
- `formatCvDateRange` → `dateLabel` string
- `showRqthOnCv: boolean` partout

---

## Execution Handoff

Plan enregistré dans `docs/superpowers/plans/2026-07-24-cv-pdf-dynamique.md`.

**Deux options d’exécution :**

1. **Subagent-Driven (recommandé)** — un sous-agent frais par task, revue entre tasks (`superpowers:subagent-driven-development`)
2. **Inline Execution** — exécution séquentielle dans cette session (`superpowers:executing-plans`)

Quelle approche ?
