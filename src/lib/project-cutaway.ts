export type CutawayStep = {
  id: string
  title: string
  description: string
  /** Libellé technique affiché sur le plan. */
  blueprintTag: string
}

/** 5 étapes de la métaphore fusée — brief → frontend final. */
export const PROJECT_CUTAWAY_STEPS: CutawayStep[] = [
  {
    id: 'brief',
    title: 'Brief client',
    blueprintTag: 'NOSE / BRIEF',
    description:
      'Comprendre vos objectifs, vos utilisateurs et vos contraintes avant toute ligne de code.',
  },
  {
    id: 'cadrage',
    title: 'Cadrage & UX',
    blueprintTag: 'CREW / UX',
    description: 'Parcours, wireframes et validation — le projet prend forme avec vous.',
  },
  {
    id: 'design',
    title: 'Design & contenu',
    blueprintTag: 'TANKS / UI',
    description: 'UI, branding et structure éditoriale — une expérience cohérente et lisible.',
  },
  {
    id: 'dev',
    title: 'Développement',
    blueprintTag: 'ENGINES / CODE',
    description: 'Intégration typée, CMS et logique métier — solide et maintenable.',
  },
  {
    id: 'ship',
    title: 'Frontend final',
    blueprintTag: 'BOOSTER / SHIP',
    description: 'Performance, déploiement et handoff — prêt à être utilisé en production.',
  },
]
