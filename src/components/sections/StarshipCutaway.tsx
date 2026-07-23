'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROJECT_CUTAWAY_STEPS, type CutawayStep } from '@/lib/project-cutaway'
import { cn } from '@/lib/utils'

type StarshipCutawayProps = {
  subtitle?: string | null
}

const LAYER_SPREAD = 18
const STROKE = 'rgb(232 238 247 / 0.94)'
const STROKE_DIM = 'rgb(232 238 247 / 0.38)'
const ORANGE = '#ff6b1a'
const IVOIRE = '#f8f4ef'

const SLICE_BOUNDS = [
  { y: 20, h: 70 },
  { y: 90, h: 90 },
  { y: 180, h: 100 },
  { y: 280, h: 100 },
  { y: 380, h: 130 },
] as const

type RocketSliceProps = {
  index: number
  activeStage: number
  isLaunching: boolean
  isActive: boolean
  onSelect: (index: number) => void
  children: React.ReactNode
}

function RocketSlice({
  index,
  activeStage,
  isLaunching,
  isActive,
  onSelect,
  children,
}: RocketSliceProps) {
  const spread = activeStage >= index ? index * LAYER_SPREAD : 0
  const bounds = SLICE_BOUNDS[index]

  return (
    <motion.g
      animate={
        isLaunching
          ? { y: -620 - index * 36, opacity: 0 }
          : { y: spread, opacity: 1 }
      }
      aria-label={`Étage ${index + 1} : ${PROJECT_CUTAWAY_STEPS[index]?.title}`}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(index)
        }
      }}
      role="button"
      style={{ cursor: 'pointer' }}
      tabIndex={0}
      transition={
        isLaunching
          ? { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }
          : { type: 'spring', stiffness: 260, damping: 20 }
      }
    >
      <rect
        fill={isActive ? 'rgb(255 107 26 / 0.14)' : 'transparent'}
        height={bounds.h}
        rx="3"
        stroke={isActive ? 'var(--accent)' : 'transparent'}
        strokeOpacity={0.75}
        width="80"
        x="80"
        y={bounds.y}
      />
      {children}
    </motion.g>
  )
}

/** Fusée hybride rétro-technique : ogive, damier, hublots, ailerons, buses. */
function StarshipSvg({
  activeStage,
  isLaunching,
  onSelect,
}: {
  activeStage: number
  isLaunching: boolean
  onSelect: (index: number) => void
}) {
  const stroke = (index: number) => (activeStage === index ? 'var(--accent-soft)' : STROKE)

  return (
    <svg
      aria-label="Fusée hybride rétro-technique"
      className="mx-auto h-auto w-full max-h-[min(64vh,540px)]"
      viewBox="0 0 240 540"
    >
      <RocketSlice
        activeStage={activeStage}
        index={0}
        isActive={activeStage === 0}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M120 22 C 100 50, 92 75, 90 90 H 150 C 148 75, 140 50, 120 22 Z"
          fill="none"
          stroke={stroke(0)}
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
        <path d="M90 90 H 150" stroke={STROKE} strokeWidth="1" />
        <circle cx="120" cy="56" fill="none" r="4" stroke={STROKE_DIM} strokeWidth="0.8" />
        <circle cx="120" cy="56" fill={STROKE_DIM} r="1.4" />
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={1}
        isActive={activeStage === 1}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 90 H 150 V 180 H 90 Z" fill="none" stroke={stroke(1)} strokeWidth="1.5" />
        {/* Damier 4×2 — cases orange */}
        <rect fill={ORANGE} height="35" opacity="0.92" width="15" x="90" y="95" />
        <rect fill={ORANGE} height="35" opacity="0.92" width="15" x="120" y="95" />
        <rect fill={ORANGE} height="35" opacity="0.92" width="15" x="105" y="130" />
        <rect fill={ORANGE} height="35" opacity="0.92" width="15" x="135" y="130" />
        {/* Damier — cases ivoire */}
        <rect fill={IVOIRE} height="35" opacity="0.16" width="15" x="105" y="95" />
        <rect fill={IVOIRE} height="35" opacity="0.16" width="15" x="135" y="95" />
        <rect fill={IVOIRE} height="35" opacity="0.16" width="15" x="90" y="130" />
        <rect fill={IVOIRE} height="35" opacity="0.16" width="15" x="120" y="130" />
        {/* Grille du damier */}
        <g stroke={STROKE_DIM} strokeWidth="0.5">
          <path d="M105 95 V 165 M120 95 V 165 M135 95 V 165 M90 130 H 150" />
        </g>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={2}
        isActive={activeStage === 2}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 180 H 150 V 280 H 90 Z" fill="none" stroke={stroke(2)} strokeWidth="1.5" />
        <path d="M90 200 H 150 M90 260 H 150" stroke={STROKE_DIM} strokeWidth="0.7" />
        {/* 3 hublots alignés */}
        <circle cx="102" cy="230" fill="none" r="6" stroke={STROKE} strokeWidth="1" />
        <circle cx="120" cy="230" fill="none" r="6" stroke={STROKE} strokeWidth="1" />
        <circle cx="138" cy="230" fill="none" r="6" stroke={STROKE} strokeWidth="1" />
        <circle cx="102" cy="230" fill={IVOIRE} opacity="0.12" r="3.5" />
        <circle cx="120" cy="230" fill={IVOIRE} opacity="0.12" r="3.5" />
        <circle cx="138" cy="230" fill={IVOIRE} opacity="0.12" r="3.5" />
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={3}
        isActive={activeStage === 3}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 280 H 150 V 380 H 90 Z" fill="none" stroke={stroke(3)} strokeWidth="1.5" />
        <path d="M90 320 H 150 M90 360 H 150" stroke={STROKE_DIM} strokeWidth="0.7" />
        {/* Rivets / panneaux d'accès */}
        <g fill={STROKE_DIM}>
          <circle cx="100" cy="300" r="1.2" />
          <circle cx="120" cy="300" r="1.2" />
          <circle cx="140" cy="300" r="1.2" />
          <circle cx="100" cy="340" r="1.2" />
          <circle cx="120" cy="340" r="1.2" />
          <circle cx="140" cy="340" r="1.2" />
        </g>
        {/* Petit hublot moteur */}
        <rect fill="none" height="14" rx="2" stroke={STROKE_DIM} strokeWidth="0.7" width="22" x="109" y="358" />
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={4}
        isActive={activeStage === 4}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        {/* Corps inférieur */}
        <path d="M90 380 H 150 V 440 H 90 Z" fill="none" stroke={stroke(4)} strokeWidth="1.5" />
        {/* Base conique (rétrécie) */}
        <path d="M90 440 H 150 L 140 480 H 100 Z" fill="none" stroke={stroke(4)} strokeWidth="1.5" />
        {/* 4 ailerons trapézoïdaux — damier orange/ivoire */}
        <path d="M90 400 L 55 445 L 78 445 L 90 415 Z" fill={ORANGE} opacity="0.85" stroke={stroke(4)} strokeWidth="1.2" />
        <path d="M90 420 L 80 450 L 90 450 Z" fill={IVOIRE} opacity="0.18" stroke={stroke(4)} strokeWidth="1" />
        <path d="M150 400 L 185 445 L 162 445 L 150 415 Z" fill={ORANGE} opacity="0.85" stroke={stroke(4)} strokeWidth="1.2" />
        <path d="M150 420 L 160 450 L 150 450 Z" fill={IVOIRE} opacity="0.18" stroke={stroke(4)} strokeWidth="1" />
        {/* 3 buses */}
        <path d="M100 480 L 98 505 L 112 505 L 110 480 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
        <path d="M114 480 L 112 505 L 126 505 L 124 480 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
        <path d="M128 480 L 126 505 L 140 505 L 138 480 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
      </RocketSlice>

      {/* Ligne centrale de coupe */}
      <line stroke={STROKE_DIM} strokeDasharray="4 3" strokeWidth="0.8" x1="120" x2="120" y1="22" y2="480" />
    </svg>
  )
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

function MobileSlideContent({ step }: { step: CutawayStep }) {
  return (
    <div className="w-full space-y-3">
      <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--accent-soft)] uppercase">
        {step.blueprintTag}
      </p>
      <p className="font-[family-name:var(--font-syne)] text-2xl font-bold leading-tight text-[var(--foreground)]">
        {step.title}
      </p>
      <p className="text-base leading-relaxed text-[var(--foreground-secondary)]">{step.description}</p>
    </div>
  )
}

function MobileCarousel({
  activeStage,
  onSelect,
  onPrev,
  onNext,
}: {
  activeStage: number
  onSelect: (index: number) => void
  onPrev: () => void
  onNext: () => void
}) {
  const step = PROJECT_CUTAWAY_STEPS[activeStage]

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between gap-2">
        <button
          aria-label="Étape précédente"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-glass)] text-[var(--foreground-secondary)] disabled:opacity-40"
          disabled={activeStage === 0}
          onClick={onPrev}
          type="button"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>

        <div className="flex flex-1 items-center justify-center gap-1.5">
          {PROJECT_CUTAWAY_STEPS.map((_, index) => (
            <button
              aria-label={`Étape ${index + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                activeStage === index ? 'w-6 bg-[var(--accent)]' : 'w-2 bg-[var(--border)]',
              )}
              key={index}
              onClick={() => onSelect(index)}
              type="button"
            />
          ))}
        </div>

        <button
          aria-label="Étape suivante"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-glass)] text-[var(--foreground-secondary)] disabled:opacity-40"
          disabled={activeStage === PROJECT_CUTAWAY_STEPS.length - 1}
          onClick={onNext}
          type="button"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="min-h-[9rem] w-full"
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: 20 }}
          key={step.id}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <MobileSlideContent step={step} />
        </motion.div>
      </AnimatePresence>

      <p className="text-center font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.14em] text-[var(--muted)]">
        {String(activeStage + 1).padStart(2, '0')} / {String(PROJECT_CUTAWAY_STEPS.length).padStart(2, '0')}
      </p>
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

export function StarshipCutaway({ subtitle }: StarshipCutawayProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [activeStage, setActiveStage] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const selectStage = useCallback((index: number) => {
    setActiveStage(index)
  }, [])

  const goPrev = useCallback(() => {
    setActiveStage((current) => Math.max(0, current - 1))
  }, [])

  const goNext = useCallback(() => {
    setActiveStage((current) => Math.min(PROJECT_CUTAWAY_STEPS.length - 1, current + 1))
  }, [])

  const handleLaunch = useCallback(() => {
    if (isLaunching || countdown !== null) return

    if (reduceMotion) {
      router.push('/contact')
      return
    }

    setCountdown(3)
    const tick = window.setInterval(() => {
      setCountdown((current) => {
        if (current === null || current <= 1) {
          window.clearInterval(tick)
          setIsLaunching(true)
          window.setTimeout(() => router.push('/contact'), 2200)
          return null
        }
        return current - 1
      })
    }, 850)
  }, [countdown, isLaunching, reduceMotion, router])

  const activeStep = PROJECT_CUTAWAY_STEPS[activeStage]

  return (
    <Container as="section" className="py-12 sm:py-16 lg:py-20">
      <SectionTitle
        editorial
        eyebrow="Méthode"
        subtitle={
          subtitle ||
          'Je centre chaque projet sur vos besoins — du brief au frontend final, étape par étape.'
        }
        title="Découpez le projet"
      />

      {/* Mobile / tablette : diaporama pleine largeur, sans Lancer */}
      <div className="relative left-1/2 mt-8 w-screen max-w-none -translate-x-1/2 px-4 sm:px-6 xl:hidden">
        <MobileCarousel
          activeStage={activeStage}
          onNext={goNext}
          onPrev={goPrev}
          onSelect={selectStage}
        />
      </div>

      {/* Desktop (xl+) : fusée hybride + panneau + Lancer */}
      <div className="mt-8 hidden overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[var(--background-elevated)] xl:block sm:mt-10">
        <div className="relative px-8 py-10">
          <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[340px]">
                {/* Compte à rebours */}
                <AnimatePresence>
                  {countdown !== null ? (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute left-1/2 top-6 z-20 -translate-x-1/2 font-[family-name:var(--font-syne)] text-6xl font-bold text-[var(--accent-soft)]"
                      exit={{ opacity: 0, scale: 1.4 }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      key={countdown}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      {countdown}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {/* Fumée pré-décollage (moteurs qui s'allument pendant le compte à rebours) */}
                <AnimatePresence>
                  {countdown !== null && !isLaunching ? (
                    <motion.div
                      animate={{ opacity: [0, 0.5, 0.7], scaleX: [0.4, 0.8, 1], scaleY: [0.2, 0.6, 0.9] }}
                      className="pointer-events-none absolute -bottom-2 left-1/2 z-0 h-28 w-28 -translate-x-1/2 rounded-full bg-gradient-to-t from-white/70 via-[var(--accent-soft)]/50 to-transparent blur-2xl"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 2.5, ease: 'easeOut' }}
                    />
                  ) : null}
                </AnimatePresence>
                {/* Fumée de décollage */}
                <AnimatePresence>
                  {isLaunching ? (
                    <motion.div
                      animate={{
                        opacity: [0.9, 1, 0.85],
                        scaleX: [1, 1.4, 1.8],
                        scaleY: [0.9, 1.5, 2.2],
                      }}
                      className="pointer-events-none absolute -bottom-6 left-1/2 z-0 h-44 w-44 -translate-x-1/2 rounded-full bg-gradient-to-t from-white/85 via-[var(--accent-soft)]/65 to-transparent blur-2xl"
                      initial={{ opacity: 0, scaleX: 1, scaleY: 0.9 }}
                      transition={{ duration: 2.2, ease: 'easeOut' }}
                    />
                  ) : null}
                </AnimatePresence>
                <motion.div
                  animate={
                    isLaunching
                      ? { y: [-2, 2, -2, 0, -40], opacity: [1, 1, 0.9, 0.7, 0] }
                      : countdown !== null
                        ? { y: [-1.5, 1.5, -1.5, 1.5, 0] }
                        : { y: 0, opacity: 1 }
                  }
                  transition={
                    isLaunching
                      ? { duration: 2.2, ease: 'easeIn' }
                      : countdown !== null
                        ? { duration: 0.18, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.3 }
                  }
                >
                  <StarshipSvg
                    activeStage={activeStage}
                    isLaunching={isLaunching}
                    onSelect={selectStage}
                  />
                </motion.div>
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
                <Button className="gap-2" disabled={isLaunching || countdown !== null} onClick={handleLaunch} type="button">
                  <Rocket aria-hidden className="size-4" />
                  {countdown !== null
                    ? `Décollage dans ${countdown}…`
                    : isLaunching
                      ? 'Lancement…'
                      : 'Lancer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
