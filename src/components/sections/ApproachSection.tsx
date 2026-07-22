'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'

import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionTitle } from '@/components/ui/SectionTitle'

export type ApproachStep = {
  title: string
  description: string
  id?: string | number | null
}

type ApproachSectionProps = {
  steps: ApproachStep[]
}

function ApproachCard({ step, index }: { step: ApproachStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 220, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 20 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  return (
    <motion.div
      className="h-full"
      onMouseLeave={() => {
        rotateX.set(0)
        rotateY.set(0)
        setGlow({ x: 50, y: 50 })
      }}
      onMouseMove={(event) => {
        if (reduceMotion || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        rotateX.set((y - rect.height / 2) / 16)
        rotateY.set((rect.width / 2 - x) / 16)
        setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
      }}
      ref={ref}
      style={
        reduceMotion
          ? undefined
          : { rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', perspective: 900 }
      }
      whileHover={reduceMotion ? undefined : { y: -6 }}
    >
          <GlassCard className="group relative h-full overflow-hidden p-6">
        {!reduceMotion ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(220px circle at ${glow.x}% ${glow.y}%, var(--accent-glow), transparent 70%)`,
            }}
          />
        ) : null}
        <motion.span
          aria-hidden
          className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--accent-soft)] uppercase"
          whileHover={reduceMotion ? undefined : { letterSpacing: '0.32em', color: 'var(--accent)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        <h3 className="relative mt-3 font-[family-name:var(--font-syne)] text-xl font-semibold">
          {step.title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
      </GlassCard>
    </motion.div>
  )
}

export function ApproachSection({ steps }: ApproachSectionProps) {
  if (!steps.length) return null

  return (
    <section className="px-6 py-20 xl:px-16">
      <SectionTitle
        editorial
        eyebrow="Méthode"
        subtitle="Du cadrage au ship — précision, rythme, impact."
        title="Comment je construis"
      />
      <StaggerChildren className="mt-10 grid gap-4 md:grid-cols-3" mode="view" stagger={0.14}>
        {steps.map((step, index) => (
          <StaggerItem key={step.id ?? `${step.title}-${index}`}>
            <ApproachCard index={index} step={step} />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  )
}
