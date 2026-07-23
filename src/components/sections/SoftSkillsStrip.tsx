'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Skill } from '@/payload-types'

type SoftSkillsStripProps = {
  skills: Skill[]
  className?: string
}

function skillSeed(id: Skill['id']): number {
  if (typeof id === 'number') return id
  return String(id)
    .split('')
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0)
}

/** Pseudo-aléatoire déterministe (stable SSR / hydratation). */
function seededUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

function getChipMotion(id: Skill['id'], index: number) {
  const base = skillSeed(id) + index * 17
  const spread = seededUnit(base)
  const drift = seededUnit(base + 41)
  const pulse = seededUnit(base + 89)

  return {
    delay: spread * 0.72 + index * 0.045,
    rotate: (drift - 0.5) * 12,
    y: (pulse - 0.5) * 14,
    popDelay: 1.4 + spread * 2.8,
    popDuration: 2.4 + drift * 2.2,
  }
}

const chipClassName =
  'border-[color:var(--accent)]/30 bg-[var(--accent)]/14 text-[var(--foreground)] shadow-[0_8px_24px_rgb(0_0_0_/_0.22)]'

export function SoftSkillsStrip({ skills, className }: SoftSkillsStripProps) {
  const reduceMotion = useReducedMotion()

  const items = useMemo(
    () =>
      [...skills].sort((left, right) => {
        const leftSeed = seededUnit(skillSeed(left.id))
        const rightSeed = seededUnit(skillSeed(right.id))
        return leftSeed - rightSeed
      }),
    [skills],
  )

  if (!items.length) return null

  return (
    <section aria-label="Soft skills" className={cn('relative', className)}>
      <p className="mb-5 text-center font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
        Soft skills
      </p>
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {items.map((skill, index) => {
          const motionConfig = getChipMotion(skill.id, index)

          if (reduceMotion) {
            return (
              <Badge className={chipClassName} key={skill.id}>
                {skill.name}
              </Badge>
            )
          }

          return (
            <motion.div
              animate={{
                opacity: 1,
                scale: 1,
                y: motionConfig.y,
                rotate: motionConfig.rotate,
              }}
              initial={{ opacity: 0, scale: 0.2, y: motionConfig.y + 18, rotate: motionConfig.rotate }}
              key={skill.id}
              transition={{
                type: 'spring',
                stiffness: 460,
                damping: 14,
                mass: 0.65,
                delay: motionConfig.delay,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: motionConfig.popDuration,
                  repeat: Infinity,
                  delay: motionConfig.popDelay,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.1, rotate: 0 }}
              >
                <Badge className={chipClassName}>{skill.name}</Badge>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
