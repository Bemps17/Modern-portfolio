'use client'

import { Odometer } from '@/components/motion/Odometer'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { GlassCard } from '@/components/ui/GlassCard'

type StatsStripProps = {
  projectCount: number
  skillCount: number
  yearsExperience: number
}

const stats = (props: StatsStripProps) =>
  [
    { value: props.projectCount, label: 'projets livrés', suffix: '' },
    { value: props.yearsExperience, label: "ans d'expérience", suffix: '+' },
    { value: props.skillCount, label: 'compétences', suffix: '' },
  ] as const

export function StatsStrip({ projectCount, skillCount, yearsExperience }: StatsStripProps) {
  const items = stats({ projectCount, skillCount, yearsExperience })

  return (
    <FadeInWhenVisible>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <GlassCard className="p-6 text-center" key={item.label}>
            <Odometer suffix={item.suffix} value={item.value} />
            <p className="mt-2 font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.18em] text-[var(--muted)] uppercase">
              {item.label}
            </p>
          </GlassCard>
        ))}
      </div>
    </FadeInWhenVisible>
  )
}
