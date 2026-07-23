'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROJECT_CUTAWAY_STEPS, type CutawayStep } from '@/lib/project-cutaway'
import { cn } from '@/lib/utils'

type StarshipCutawayProps = {
  subtitle?: string | null
}

const LAYER_SPREAD = 22

type RocketSliceProps = {
  index: number
  activeStage: number
  isLaunching: boolean
  children: React.ReactNode
}

function RocketSlice({ index, activeStage, isLaunching, children }: RocketSliceProps) {
  const spread = activeStage >= index ? index * LAYER_SPREAD : 0

  return (
    <motion.g
      animate={
        isLaunching
          ? { y: -420 - index * 30, opacity: 0, scale: 1.05 }
          : { y: spread, opacity: 1, scale: 1 }
      }
      style={{ transformOrigin: '60px 160px' }}
      transition={
        isLaunching
          ? { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }
          : { type: 'spring', stiffness: 280, damping: 22 }
      }
    >
      {children}
    </motion.g>
  )
}

function RocketVisual({
  activeStage,
  isLaunching,
  reduceMotion,
}: {
  activeStage: number
  isLaunching: boolean
  reduceMotion: boolean | null
}) {
  if (reduceMotion) {
    return (
      <svg aria-hidden className="mx-auto h-auto w-full max-w-[200px]" viewBox="0 0 120 320">
        <path
          d="M60 8 L88 72 L88 248 L72 312 L48 312 L32 248 L32 72 Z"
          fill="rgb(255 107 26 / 0.2)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <AnimatePresence>
        {isLaunching ? (
          <motion.div
            animate={{ opacity: [0, 0.9, 0], scaleY: [0.4, 1.4, 2] }}
            className="pointer-events-none absolute bottom-8 left-1/2 z-0 h-40 w-16 -translate-x-1/2 rounded-full bg-gradient-to-t from-[var(--accent)] via-[var(--accent-soft)] to-transparent blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, scaleY: 0.4 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ) : null}
      </AnimatePresence>

      <motion.svg
        animate={isLaunching ? { y: -24, filter: 'blur(2px)' } : { y: 0, filter: 'blur(0px)' }}
        aria-hidden
        className="relative z-[1] h-auto w-full"
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        viewBox="0 0 120 320"
      >
        <defs>
          <linearGradient id="rocket-body" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgb(255 255 255 / 0.08)" />
            <stop offset="50%" stopColor="rgb(255 107 26 / 0.35)" />
            <stop offset="100%" stopColor="rgb(255 255 255 / 0.06)" />
          </linearGradient>
        </defs>

        <RocketSlice activeStage={activeStage} index={0} isLaunching={isLaunching}>
          <path
            d="M60 12 L78 58 L42 58 Z"
            fill="var(--accent-soft)"
            stroke="var(--accent)"
            strokeWidth="1.2"
          />
        </RocketSlice>

        <RocketSlice activeStage={activeStage} index={1} isLaunching={isLaunching}>
          <path
            d="M42 58 H78 L84 118 H36 Z"
            fill="url(#rocket-body)"
            stroke="var(--border)"
            strokeWidth="1.2"
          />
        </RocketSlice>

        <RocketSlice activeStage={activeStage} index={2} isLaunching={isLaunching}>
          <path
            d="M36 118 H84 L86 178 H34 Z"
            fill="rgb(14 14 18 / 0.85)"
            stroke="var(--border)"
            strokeWidth="1.2"
          />
          <line stroke="var(--accent)" strokeOpacity="0.45" x1="44" x2="76" y1="148" y2="148" />
        </RocketSlice>

        <RocketSlice activeStage={activeStage} index={3} isLaunching={isLaunching}>
          <path
            d="M34 178 H86 L82 238 H38 Z"
            fill="url(#rocket-body)"
            stroke="var(--border)"
            strokeWidth="1.2"
          />
          <circle cx="48" cy="208" fill="var(--accent)" fillOpacity="0.5" r="5" />
          <circle cx="72" cy="208" fill="var(--accent)" fillOpacity="0.5" r="5" />
        </RocketSlice>

        <RocketSlice activeStage={activeStage} index={4} isLaunching={isLaunching}>
          <path
            d="M38 238 H82 L74 300 H46 Z"
            fill="rgb(153 27 27 / 0.55)"
            stroke="var(--accent-secondary)"
            strokeWidth="1.2"
          />
          <path d="M30 252 L38 238 L38 268 Z" fill="var(--accent-secondary)" fillOpacity="0.7" />
          <path d="M90 252 L82 238 L82 268 Z" fill="var(--accent-secondary)" fillOpacity="0.7" />
        </RocketSlice>
      </motion.svg>
    </div>
  )
}

function StepButton({
  step,
  index,
  isActive,
  onSelect,
}: {
  step: CutawayStep
  index: number
  isActive: boolean
  onSelect: (index: number) => void
}) {
  return (
    <button
      className={cn(
        'w-full rounded-xl border px-4 py-3 text-left transition',
        isActive
          ? 'border-[color:var(--accent)]/50 bg-[var(--accent)]/12 shadow-[0_0_24px_var(--accent-glow)]'
          : 'border-[color:var(--border)] bg-[var(--surface-glass)] hover:border-[color:var(--accent)]/25',
      )}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] text-[var(--accent-soft)] uppercase">
        {String(index + 1).padStart(2, '0')} — {step.title}
      </span>
      <p
        className={cn(
          'mt-1 text-sm leading-relaxed transition-colors',
          isActive ? 'text-[var(--foreground)]' : 'text-[var(--foreground-secondary)]',
        )}
      >
        {step.description}
      </p>
    </button>
  )
}

export function StarshipCutaway({ subtitle }: StarshipCutawayProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [activeStage, setActiveStage] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)
  const [maxExplored, setMaxExplored] = useState(0)

  const selectStage = useCallback((index: number) => {
    setActiveStage(index)
    setMaxExplored((current) => Math.max(current, index))
  }, [])

  const handleLaunch = useCallback(() => {
    if (isLaunching) return

    if (reduceMotion) {
      router.push('/contact')
      return
    }

    setIsLaunching(true)
    window.setTimeout(() => {
      router.push('/contact')
    }, 1300)
  }, [isLaunching, reduceMotion, router])

  const activeStep = PROJECT_CUTAWAY_STEPS[activeStage]

  return (
    <Container as="section" className="py-12 sm:py-16 lg:py-20">
      <ReadableSurface strong>
        <SectionTitle
          editorial
          eyebrow="Méthode"
          subtitle={
            subtitle ||
            'Je centre chaque projet sur vos besoins — du brief au frontend final, étape par étape.'
          }
          title="Découpez le projet"
        />

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-14">
          <div className="relative flex flex-col items-center">
            <RocketVisual activeStage={activeStage} isLaunching={isLaunching} reduceMotion={reduceMotion} />
            <p className="mt-4 text-center font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.16em] text-[var(--muted)] uppercase">
              Cliquez une étape pour séparer les couches
            </p>
          </div>

          <div className="space-y-3">
            {PROJECT_CUTAWAY_STEPS.map((step, index) => (
              <StepButton
                index={index}
                isActive={activeStage === index}
                key={step.id}
                onSelect={selectStage}
                step={step}
              />
            ))}

            <div className="readable-surface glass-panel mt-6 rounded-xl border border-[color:var(--accent)]/20 p-4">
              <p className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] text-[var(--accent-soft)] uppercase">
                Couche active
              </p>
              <p className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold">{activeStep.title}</p>
              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">{activeStep.description}</p>
            </div>

            <div className="pt-4">
              <Button
                className="w-full gap-2 sm:w-auto"
                disabled={isLaunching}
                onClick={handleLaunch}
                type="button"
              >
                <Rocket aria-hidden className="size-4" />
                {isLaunching ? 'Lancement…' : 'Lancer'}
              </Button>
              {maxExplored < PROJECT_CUTAWAY_STEPS.length - 1 ? (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Explorez les {PROJECT_CUTAWAY_STEPS.length} étapes puis lancez vers le formulaire de contact.
                </p>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Prêt ? Lancez pour démarrer votre projet — redirection vers le contact.
                </p>
              )}
            </div>
          </div>
        </div>
      </ReadableSurface>
    </Container>
  )
}
