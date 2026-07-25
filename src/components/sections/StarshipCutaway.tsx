'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { LaunchEffects } from '@/components/sections/starship/LaunchEffects'
import { LaunchPad } from '@/components/sections/starship/LaunchPad'
import { StarshipLiftoffPortal } from '@/components/sections/starship/StarshipLiftoffPortal'
import { StarshipSvg } from '@/components/sections/starship/StarshipSvg'
import { useLaunchSequence } from '@/components/sections/starship/useLaunchSequence'
import type { LaunchPhase } from '@/components/sections/starship/constants'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROJECT_CUTAWAY_STEPS, type CutawayStep } from '@/lib/project-cutaway'
import { cn } from '@/lib/utils'

type StarshipCutawayProps = {
  subtitle?: string | null
}

function StageDetailCard({ step, className }: { step: CutawayStep; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-[color:var(--accent)]/30 bg-[var(--background)]/60 p-4 backdrop-blur-sm', className)}>
      <p className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] text-[var(--accent-soft)] uppercase">
        {step.blueprintTag}
      </p>
      <p className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold leading-tight text-[var(--foreground)]">
        {step.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">{step.description}</p>
    </div>
  )
}

function StepRail({
  steps,
  activeStage,
  onSelect,
}: {
  steps: CutawayStep[]
  activeStage: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <button
          className={cn(
            'flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition',
            activeStage === index
              ? 'border-[color:var(--accent)]/50 bg-[var(--accent)]/10'
              : 'border-transparent hover:border-[color:var(--border)] hover:bg-white/5',
          )}
          key={step.id}
          onClick={() => onSelect(index)}
          type="button"
        >
          <span
            className={cn(
              'mt-0.5 font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em]',
              activeStage === index ? 'text-[var(--accent-soft)]' : 'text-[var(--muted)]',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0">
            <span className="block font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
              {step.blueprintTag}
            </span>
            <span className="block text-sm font-medium text-[var(--foreground)]">{step.title}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

function launchButtonLabel(phase: LaunchPhase, countdown: number | null): string {
  if (phase === 'countdown' && countdown !== null) return `Décollage dans ${countdown}…`
  if (phase === 'ignition') return 'Allumage…'
  if (phase === 'liftoff') return 'Lancement…'
  if (phase === 'mission') return 'Cap contact…'
  return 'Lancer'
}

export function StarshipCutaway({ subtitle }: StarshipCutawayProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [activeStage, setActiveStage] = useState(0)
  const rocketAnchorRef = useRef<HTMLDivElement>(null)
  const [liftoffOrigin, setLiftoffOrigin] = useState<DOMRect | null>(null)

  const { phase, countdown, handleLaunch, launchDisabled, isIgniting, isMission } =
    useLaunchSequence({
      reduceMotion,
      onComplete: () => router.push('/contact'),
    })

  useEffect(() => {
    if (phase === 'liftoff') {
      const frame = requestAnimationFrame(() => {
        const node = rocketAnchorRef.current
        if (node) setLiftoffOrigin(node.getBoundingClientRect())
      })
      return () => cancelAnimationFrame(frame)
    }

    if (phase === 'idle') {
      const frame = requestAnimationFrame(() => setLiftoffOrigin(null))
      return () => cancelAnimationFrame(frame)
    }

    return undefined
  }, [phase])

  const isFullScreenFlight = phase === 'liftoff' || phase === 'mission'
  const isStacked = phase !== 'idle'

  const selectStage = useCallback((index: number) => {
    if (launchDisabled) return
    setActiveStage(index)
  }, [launchDisabled])

  const activeStep = PROJECT_CUTAWAY_STEPS[activeStage]
  const desktopSubtitle =
    subtitle ||
    'Je centre chaque projet sur vos besoins — du brief au frontend final, étape par étape.'

  return (
    <Container as="section" className="hidden py-12 sm:py-16 lg:py-20 xl:block">
      <SectionTitle
        editorial
        eyebrow="Méthode"
        icon="method"
        subtitle={desktopSubtitle}
        title="Découpez le projet"
      />

      <StarshipLiftoffPortal
        active={isFullScreenFlight && liftoffOrigin !== null}
        activeStage={activeStage}
        origin={liftoffOrigin}
      />

      <div
        className={cn(
          'mt-8 rounded-3xl border border-[color:var(--border)] bg-[var(--background-elevated)] sm:mt-10',
          isFullScreenFlight ? 'overflow-visible' : 'overflow-hidden',
        )}
      >
        <div className="relative px-8 py-10">
          <AnimatePresence>
            {isMission ? (
              <motion.div
                animate={{ opacity: 1 }}
                className="starship-mission-overlay"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <div className="text-center">
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--accent-soft)] uppercase">
                    Mission
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--foreground)]">
                    Cap sur le contact
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[340px]">
                <LaunchPad className={isFullScreenFlight ? 'starship-pad--liftoff' : undefined} phase={phase}>
                  <LaunchEffects countdown={countdown} phase={phase} />
                  <div ref={rocketAnchorRef}>
                    <motion.div
                      animate={
                        isFullScreenFlight
                          ? { opacity: 0 }
                          : phase === 'countdown' || phase === 'ignition'
                            ? { y: [-1.5, 1.5, -1.5], opacity: 1 }
                            : { y: [0, -3, 0], opacity: 1 }
                      }
                      className={cn(isFullScreenFlight && 'pointer-events-none')}
                      transition={
                        phase === 'idle'
                          ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                          : phase === 'countdown' || phase === 'ignition'
                            ? { duration: 0.18, repeat: Infinity, ease: 'easeInOut' }
                            : { duration: 0.25 }
                      }
                    >
                      <StarshipSvg
                        activeStage={activeStage}
                        isIgniting={isIgniting}
                        isLaunching={false}
                        stacked={isStacked}
                        onSelect={selectStage}
                      />
                    </motion.div>
                  </div>
                </LaunchPad>
              </div>
              <p className="mt-3 text-center font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase">
                Cliquez un étage pour séparer les couches
              </p>
            </div>

            <div className="space-y-5">
              <StepRail activeStage={activeStage} onSelect={selectStage} steps={PROJECT_CUTAWAY_STEPS} />
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={activeStep.id}
                  transition={{ duration: 0.25 }}
                >
                  <StageDetailCard step={activeStep} />
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-[var(--muted)]">
                  Étape {activeStage + 1} / {PROJECT_CUTAWAY_STEPS.length}
                </p>
                <Button className="gap-2" disabled={launchDisabled} onClick={handleLaunch} type="button">
                  <Rocket aria-hidden className="size-4" />
                  {launchButtonLabel(phase, countdown)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
