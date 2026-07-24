# CV PDF — coupures de page propres + compétences sidebar

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Empêcher les cassures au milieu d’une section du CV PDF (page 1 se termine sur une section complète, page 2 commence sur une autre), ajouter des marges bas/haut entre pages, et déplacer les compétences dans la barre latérale gauche en affichant uniquement le nom + pourcentage (sans barre de progression).

**Architecture:** Remplacer le flux unique `<Page>` qui laisse React-PDF couper n’importe où par un découpage **explicite en 2 pages** piloté par une fonction pure `splitCvPages(data)`. Page 1 = en-tête + expériences récentes (section entière). Page 2 = premières expériences (si présentes) + formations + recommandation. La sidebar (contact, profil, langues, compétences %, infos) reste sur la page 1 ; le bandeau sombre `fixed` continue sur la page 2. Les marges `paddingBottom` (page 1) et `paddingTop` (page 2) sont augmentées.

**Tech Stack:** Next.js 16, `@react-pdf/renderer`, Vitest, TypeScript.

## Global Constraints

- CMS-first : zéro copy marketing en dur dans les pages React (fallback uniquement dans `portfolio-fallback.ts` + seed)
- Contenu CV inchangé (données Payload / fallback) — **layout only**
- Palette site conservée : sidebar `#141418`, accent `#ff6b1a`, page `#f8f4ef`
- Compétences sidebar : **texte `Nom` + `N%` uniquement** — **pas** de barre de progression, **pas** de description longue
- Coupure de page : **jamais** au milieu d’une section métier (expériences récentes / premières expériences / formations / recommandation) — une page se termine après une section, la suivante commence par une autre
- Marges : bas de page 1 ≥ 36pt, haut de page 2 ≥ 36pt (contenu principal)
- Dépendance PDF : `@react-pdf/renderer` uniquement
- Ne pas casser le mode démo ni `GET /api/cv`
- `SITE_VERSION` bumpé à `0.13.2`
- Gate : tests CV + `pnpm typecheck` verts (idéalement `pnpm verify`)

## File Structure

| Fichier | Rôle |
|---|---|
| `src/lib/cv/split-cv-pages.ts` | Découpe pure page1 / page2 des sections principales |
| `src/components/cv/CvDocument.tsx` | Rendu 2×`<Page>`, sidebar compétences %, marges |
| `tests/int/cv-split-pages.int.spec.ts` | Tests de la découpe |
| `tests/int/cv-api.int.spec.ts` | Reste vert (PDF non vide) ; optionnellement assert ≥1 page |
| `src/lib/site-version.ts` | `0.13.2` |
| `vitest.config.mts` | Include du nouveau spec si liste explicite |

## Décision de découpe (verrouillée)

| Page | Contenu colonne droite |
|---|---|
| **1** | Nom + tagline + section **Expériences professionnelles** (items `!earlyCareer` uniquement) |
| **2** | Section **Premières expériences** (si `earlyCareer.length > 0`) puis **Formations** puis **Recommandation** (si présente) |

Si `earlyCareer` est vide : page 2 commence par **Formations** (ou **Recommandation** si pas de formations).  
Si page 2 n’a aucune section : ne rendre **qu’une seule** `<Page>` (cas rare / CV court).

Sidebar (page 1 seulement, contenu) : Contact → Profil → Langues → **Compétences** (nom + %) → Infos.  
Bandeau sombre : `fixed` sur chaque page.

---

### Task 1: Fonction pure `splitCvPages` (TDD)

**Files:**
- Create: `src/lib/cv/split-cv-pages.ts`
- Create: `tests/int/cv-split-pages.int.spec.ts`
- Modify: `vitest.config.mts` (ajouter le spec à l’include `node-payload` si nécessaire)

**Interfaces:**
- Consumes: `CvDocumentData` from `src/lib/cv/types.ts`
- Produces:
```ts
export type CvPagePlan = {
  page1: {
    recentExperiences: CvDocumentData['experiences']
  }
  page2: {
    earlyExperiences: CvDocumentData['experiences']
    qualifications: CvDocumentData['qualifications']
    recommendationQuote: string | null
    recommendationAuthor: string | null
  } | null
}

export function splitCvPages(data: CvDocumentData): CvPagePlan
```

- [ ] **Step 1: Write the failing test**

Créer `tests/int/cv-split-pages.int.spec.ts` :

```ts
import { describe, expect, it } from 'vitest'

import { splitCvPages } from '../../src/lib/cv/split-cv-pages'
import type { CvDocumentData } from '../../src/lib/cv/types'

function baseData(overrides: Partial<CvDocumentData> = {}): CvDocumentData {
  return {
    fullName: 'Bertrand Fouquet',
    tagline: 'Profil polyvalent',
    email: 'a@b.c',
    phone: null,
    location: null,
    pitch: 'Pitch',
    recommendationQuote: 'Super collab',
    recommendationAuthor: 'Directeur X',
    availabilityLabel: null,
    mobility: null,
    interests: null,
    rqthNote: null,
    showRqthOnCv: false,
    languages: [],
    competencies: [],
    experiences: [
      {
        title: 'Téléconseiller',
        company: 'Malakoff',
        dateLabel: 'nov. 2025 – Présent',
        description: 'Conseil',
        earlyCareer: false,
      },
      {
        title: 'Commercial terrain',
        company: 'Divers',
        dateLabel: '2007 – 2012',
        description: 'Prospection',
        earlyCareer: true,
      },
    ],
    qualifications: [
      {
        title: 'Infographiste',
        organization: 'AP Formation',
        yearLabel: '2023',
        description: null,
      },
    ],
    ...overrides,
  }
}

describe('splitCvPages', () => {
  it('puts only recent experiences on page 1 and the rest on page 2', () => {
    const plan = splitCvPages(baseData())
    expect(plan.page1.recentExperiences).toHaveLength(1)
    expect(plan.page1.recentExperiences[0].company).toBe('Malakoff')
    expect(plan.page2).not.toBeNull()
    expect(plan.page2!.earlyExperiences).toHaveLength(1)
    expect(plan.page2!.qualifications).toHaveLength(1)
    expect(plan.page2!.recommendationQuote).toBe('Super collab')
  })

  it('returns null page2 when there is nothing after recent experiences', () => {
    const plan = splitCvPages(
      baseData({
        experiences: [
          {
            title: 'Solo',
            company: 'Co',
            dateLabel: '2024 – Présent',
            description: 'Desc',
            earlyCareer: false,
          },
        ],
        qualifications: [],
        recommendationQuote: null,
        recommendationAuthor: null,
      }),
    )
    expect(plan.page2).toBeNull()
  })

  it('starts page2 with formations when early career is empty', () => {
    const plan = splitCvPages(
      baseData({
        experiences: [
          {
            title: 'Solo',
            company: 'Co',
            dateLabel: '2024 – Présent',
            description: 'Desc',
            earlyCareer: false,
          },
        ],
      }),
    )
    expect(plan.page2).not.toBeNull()
    expect(plan.page2!.earlyExperiences).toHaveLength(0)
    expect(plan.page2!.qualifications).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-split-pages.int.spec.ts`  
Expected: FAIL (module not found). Si le fichier n’est pas découvert, ajouter `'tests/int/cv-split-pages.int.spec.ts'` dans l’include `node-payload` de `vitest.config.mts`, re-run : FAIL toujours sur import manquant.

- [ ] **Step 3: Write minimal implementation**

Créer `src/lib/cv/split-cv-pages.ts` :

```ts
import type { CvDocumentData } from './types'

export type CvPagePlan = {
  page1: {
    recentExperiences: CvDocumentData['experiences']
  }
  page2: {
    earlyExperiences: CvDocumentData['experiences']
    qualifications: CvDocumentData['qualifications']
    recommendationQuote: string | null
    recommendationAuthor: string | null
  } | null
}

export function splitCvPages(data: CvDocumentData): CvPagePlan {
  const recentExperiences = data.experiences.filter((item) => !item.earlyCareer)
  const earlyExperiences = data.experiences.filter((item) => item.earlyCareer)
  const hasPage2 =
    earlyExperiences.length > 0 ||
    data.qualifications.length > 0 ||
    Boolean(data.recommendationQuote?.trim())

  return {
    page1: { recentExperiences },
    page2: hasPage2
      ? {
          earlyExperiences,
          qualifications: data.qualifications,
          recommendationQuote: data.recommendationQuote,
          recommendationAuthor: data.recommendationAuthor,
        }
      : null,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-split-pages.int.spec.ts`  
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/cv/split-cv-pages.ts tests/int/cv-split-pages.int.spec.ts vitest.config.mts
git commit -m "feat(cv): découpe pure des sections PDF page1/page2"
```

---

### Task 2: Sidebar compétences (nom + %) sans barre

**Files:**
- Modify: `src/components/cv/CvDocument.tsx`

**Interfaces:**
- Consumes: `data.competencies: CvCompetencyItem[]`
- Produces: lignes sidebar `Nom` … `85%` (pas de `barTrack` / `barFill` / description)

- [ ] **Step 1: Remove right-column skills grid**

Dans `CvDocument.tsx` :
- Supprimer le composant `SkillCell`
- Supprimer les styles `skillsGrid`, `skillCell`, `skillName`, `barTrack`, `barFill`, `skillHint`
- Supprimer le bloc JSX colonne droite qui rend `<Text style={styles.sectionTitle}>Compétences</Text>` + grille

- [ ] **Step 2: Add sidebar competency rows**

Ajouter styles :

```ts
  sideCompetencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  sideCompetencyName: {
    flex: 1,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.sidebarText,
    paddingRight: 6,
  },
  sideCompetencyLevel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.accentSoft,
  },
```

Dans la sidebar, **après Langues et avant Infos**, ajouter :

```tsx
{data.competencies.length > 0 ? (
  <>
    <Text style={styles.sideSectionTitle}>Compétences</Text>
    {data.competencies.map((item, index) => (
      <View key={`comp-${index}`} style={styles.sideCompetencyRow} wrap={false}>
        <Text style={styles.sideCompetencyName}>{item.name}</Text>
        <Text style={styles.sideCompetencyLevel}>{item.level}%</Text>
      </View>
    ))}
  </>
) : null}
```

Ne **pas** afficher `item.description`. Ne **pas** dessiner de barre.

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/cv/CvDocument.tsx
git commit -m "feat(cv): compétences sidebar en pourcentage sans barre"
```

---

### Task 3: Deux `<Page>` explicites + marges

**Files:**
- Modify: `src/components/cv/CvDocument.tsx`
- Modify: `tests/int/cv-api.int.spec.ts` (assertion page count optionnelle mais recommandée)

**Interfaces:**
- Consumes: `splitCvPages(data)` → `CvPagePlan`
- Produces: 1 ou 2 éléments `<Page size="A4">` ; page 1 paddingBottom 40 ; page 2 paddingTop 40

- [ ] **Step 1: Wire splitCvPages and dual Page render**

En haut de `CvDocument.tsx` :

```ts
import { splitCvPages } from '@/lib/cv/split-cv-pages'
```

Remplacer le rendu d’une seule `<Page>` par la structure suivante (conserver couleurs / sidebar absolute + fixed) :

```tsx
export function CvDocument({ data }: { data: CvDocumentData }) {
  const plan = splitCvPages(data)
  const interestItems = data.interests ? splitInterests(data.interests) : []

  return (
    <Document author={data.fullName} subject={data.tagline} title={`CV — ${data.fullName}`}>
      <Page size="A4" style={[styles.page, styles.page1]}>
        <View fixed style={styles.sidebar} />
        {/* Sidebar content (page 1) — Contact, Profil, Langues, Compétences %, Infos */}
        <View style={styles.sidebarContent} wrap={false}>
          {/* ... contenu sidebar existant + compétences % (Task 2) ... */}
        </View>

        <View style={styles.main}>
          <Text style={styles.headerName}>{data.fullName}</Text>
          <Text style={styles.headerTagline}>{data.tagline}</Text>

          <Text style={styles.sectionTitle}>Expériences professionnelles</Text>
          {plan.page1.recentExperiences.map((experience, index) => (
            <TimelineExperience
              key={`exp-${index}`}
              experience={experience}
              isLast={index === plan.page1.recentExperiences.length - 1}
            />
          ))}
        </View>
      </Page>

      {plan.page2 ? (
        <Page size="A4" style={[styles.page, styles.page2]}>
          <View fixed style={styles.sidebar} />
          <View style={styles.main}>
            {plan.page2.earlyExperiences.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Premières expériences</Text>
                {plan.page2.earlyExperiences.map((experience, index) => (
                  <TimelineExperience
                    key={`early-${index}`}
                    experience={experience}
                    isLast={index === plan.page2!.earlyExperiences.length - 1}
                  />
                ))}
              </>
            ) : null}

            {plan.page2.qualifications.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Formations</Text>
                {plan.page2.qualifications.map((item, index) => (
                  <View key={`qual-${index}`} style={styles.timelineItem} wrap={false}>
                    <View style={styles.timelineMeta}>
                      {item.organization ? (
                        <Text style={styles.company}>{item.organization}</Text>
                      ) : null}
                      {item.yearLabel ? (
                        <Text style={styles.dateLabel}>{item.yearLabel}</Text>
                      ) : null}
                    </View>
                    <View style={styles.timelineRail}>
                      <View style={styles.timelineDot} />
                      {index === plan.page2!.qualifications.length - 1 ? null : (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.jobTitle}>{item.title}</Text>
                      {item.description ? (
                        <Text style={styles.jobBody}>{item.description}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </>
            ) : null}

            {plan.page2.recommendationQuote ? (
              <>
                <Text style={styles.sectionTitle}>Recommandation</Text>
                <View style={styles.quote} wrap={false}>
                  <Text style={styles.quoteText}>« {plan.page2.recommendationQuote} »</Text>
                  {plan.page2.recommendationAuthor ? (
                    <Text style={styles.quoteAuthor}>— {plan.page2.recommendationAuthor}</Text>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>
        </Page>
      ) : null}
    </Document>
  )
}
```

Ajouter styles de page / sidebar content :

```ts
  page1: {
    paddingTop: 28,
    paddingBottom: 40,
  },
  page2: {
    paddingTop: 40,
    paddingBottom: 36,
  },
  sidebarContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
```

Ajuster `styles.page` pour garder `paddingLeft: SIDEBAR_WIDTH` + `backgroundColor` ; retirer `paddingTop`/`paddingBottom` de `styles.main` s’ils doublonnent (garder seulement `paddingHorizontal: 22` sur `main`).

Extraire le bloc sidebar actuel dans le `View` `styles.sidebarContent` (pas d’inline style dupliqué).

- [ ] **Step 2: Strengthen cv-api test with page count**

Dans `tests/int/cv-api.int.spec.ts`, après le check `%PDF`, ajouter :

```ts
    const text = buffer.toString('latin1')
    const pageCount = (text.match(/\/Type\s*\/Page\b/g) || []).length
    expect(pageCount).toBeGreaterThanOrEqual(1)
```

Avec le fallback démo (early career + formations), attendre typiquement **2** pages :

```ts
    expect(pageCount).toBe(2)
```

Utiliser `toBe(2)` si le fallback contient bien `earlyCareer` + qualifications (c’est le cas actuel). Si flaky, garder `>= 1` et documenter — préférer `toBe(2)` pour verrouiller le split.

- [ ] **Step 3: Run tests**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/cv-split-pages.int.spec.ts tests/int/cv-api.int.spec.ts
pnpm typecheck
```

Expected: PASS

- [ ] **Step 4: Manual smoke PDF**

Créer temporairement (ne pas committer) ou réutiliser un script local :

```bash
pnpm exec tsx -e "
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { writeFileSync } from 'fs'
import { CvDocument } from './src/components/cv/CvDocument.tsx'
import { getCvDocumentData } from './src/lib/cv/get-cv-document-data.ts'
;(async () => {
  const data = await getCvDocumentData()
  const buf = await renderToBuffer(createElement(CvDocument, { data }))
  writeFileSync('/tmp/cv-pages.pdf', buf)
  console.log('pages', (buf.toString('latin1').match(/\\/Type\\s*\\/Page\\b/g) || []).length)
})()
"
file /tmp/cv-pages.pdf
```

Expected: `PDF document … 2 page(s)` ; page 1 se termine après expériences récentes ; page 2 commence par « Premières expériences » (ou Formations).

- [ ] **Step 5: Commit**

```bash
git add src/components/cv/CvDocument.tsx tests/int/cv-api.int.spec.ts
git commit -m "fix(cv): pages PDF sectionnées avec marges haut/bas"
```

---

### Task 4: Version + verify

**Files:**
- Modify: `src/lib/site-version.ts`

**Interfaces:**
- Produces: `SITE_VERSION = '0.13.2'`

- [ ] **Step 1: Bump version**

```ts
export const SITE_VERSION = '0.13.2'
```

- [ ] **Step 2: Run verify**

```bash
pnpm verify
```

Expected: PASS (lint, typecheck, tests int, tokens, build)

- [ ] **Step 3: Commit**

```bash
git add src/lib/site-version.ts
git commit -m "chore(cv): SITE_VERSION 0.13.2"
```

---

## Self-Review

**1. Spec coverage**
- Fin de page 1 / début page 2 sans cassure de section → Task 1 + Task 3 (split explicite)
- Marge bas page 1 / haut page 2 → Task 3 (`page1`/`page2` paddings ≥ 36–40)
- Compétences sidebar, % seulement, sans barre → Task 2
- Couleurs site → inchangées (contrainte globale)
- Version → Task 4

**2. Placeholder scan**
- Pas de TBD ; code complet dans chaque step
- Le JSX sidebar « … contenu existant … » dans Task 3 réutilise le bloc déjà écrit en Task 2 — l’implémenteur déplace le bloc réel, ne laisse pas de commentaire ellipsis dans le fichier final

**3. Type consistency**
- `CvPagePlan` / `splitCvPages` / `CvDocument` alignés
- `page2` nullable géré

---

## Execution Handoff

Plan enregistré dans `docs/superpowers/plans/2026-07-24-cv-pdf-page-breaks.md`.

**Deux options d’exécution :**

1. **Subagent-Driven (recommandé)** — un sous-agent frais par task, revue entre tasks  
2. **Inline Execution** — exécution séquentielle dans cette session  

Quelle approche ?
