'use client'

import { Briefcase, Calendar, FolderKanban } from 'lucide-react'

import { Odometer } from '@/components/motion/Odometer'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconLabel } from '@/components/ui/IconLabel'

type StatsStripProps = {
  projectCount: number
  skillCount: number
  yearsExperience: number
}

const stats = (props: StatsStripProps) =>
  [
    { value: props.projectCount, label: 'projets livrés', suffix: '', icon: FolderKanban },
    { value: props.yearsExperience, label: "ans d'expérience", suffix: '+', icon: Calendar },
    { value: props.skillCount, label: 'compétences', suffix: '', icon: Briefcase },
  ] as const

export function StatsStrip({ projectCount, skillCount, yearsExperience }: StatsStripProps) {
  const items = stats({ projectCount, skillCount, yearsExperience })

  return (
    <FadeInWhenVisible>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <GlassCard className="p-6 text-center" key={item.label}>
            <Odometer suffix={item.suffix} value={item.value} />
            <IconLabel
              className="mt-3 justify-center font-[family-name:var(--font-space-grotesk)] text-[clamp(0.625rem,2.4vw,0.75rem)] tracking-[0.12em] text-[var(--muted)] uppercase sm:tracking-[0.18em]"
              icon={item.icon}
            >
              {item.label}
            </IconLabel>
          </GlassCard>
        ))}
      </div>
    </FadeInWhenVisible>
  )
}
