'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { Container } from '@/components/ui/Container'
import { GlassCard } from '@/components/ui/GlassCard'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
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
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="h-full"
      whileHover={reduceMotion ? undefined : { y: -6 }}
    >
      <GlassCard className="group relative h-full overflow-hidden p-6">
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
        <p className="relative mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">
          {step.description}
        </p>
      </GlassCard>
    </motion.div>
  )
}

export function ApproachSection({ steps }: ApproachSectionProps) {
  if (!steps.length) return null

  return (
    <Container as="section" className="py-12 sm:py-16 lg:py-20">
      <ReadableSurface strong>
        <SectionTitle
          editorial
          eyebrow="Méthode"
          icon="method"
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
      </ReadableSurface>
    </Container>
  )
}
