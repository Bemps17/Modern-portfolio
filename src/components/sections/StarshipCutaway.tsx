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

const LAYER_SPREAD = 30
const STROKE = 'rgb(232 238 247 / 0.94)'
const STROKE_DIM = 'rgb(232 238 247 / 0.38)'

const SLICE_BOUNDS = [
  { y: 24, h: 74 },
  { y: 98, h: 82 },
  { y: 180, h: 82 },
  { y: 262, h: 82 },
  { y: 344, h: 162 },
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
          ? { duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }
          : { type: 'spring', stiffness: 260, damping: 20 }
      }
    >
      <rect
        fill={isActive ? 'rgb(255 107 26 / 0.14)' : 'transparent'}
        height={bounds.h}
        rx="2"
        stroke={isActive ? 'var(--accent)' : 'transparent'}
        strokeOpacity={0.75}
        width={152}
        x="74"
        y={bounds.y}
      />
      {children}
    </motion.g>
  )
}

/** Fusée Starship fidèle : ogive conique, corps cylindrique, ailerons, Super Heavy. */
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
      aria-label="Plan de coupe Starship SpaceX"
      className="mx-auto h-auto w-full max-h-[min(64vh,540px)]"
      viewBox="0 0 300 560"
    >
      <defs>
        <clipPath id="starship-right">
          <rect height="540" width="150" x="150" y="10" />
        </clipPath>
      </defs>

      <RocketSlice
        activeStage={activeStage}
        index={0}
        isActive={activeStage === 0}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M150 28 C170 52 178 74 180 98 L120 98 C122 74 130 52 150 28 Z"
          fill="none"
          stroke={stroke(0)}
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path d="M120 98 H180" stroke={STROKE} strokeWidth="1" />
        <g clipPath="url(#starship-right)">
          <path d="M150 48 L198 66 L150 84" fill="none" stroke={STROKE_DIM} strokeWidth="0.8" />
        </g>
        <text fill={activeStage === 0 ? 'var(--accent-soft)' : STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="8" letterSpacing="0.12em" x="26" y="64">
          NOSE CONE
        </text>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={1}
        isActive={activeStage === 1}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M120 98 H180 L182 180 H118 Z"
          fill="none"
          stroke={stroke(1)}
          strokeWidth="1.5"
        />
        <path d="M118 128 H182 M118 158 H182" stroke={STROKE_DIM} strokeWidth="0.7" />
        <g clipPath="url(#starship-right)">
          <ellipse cx="200" cy="120" fill="none" rx="42" ry="10" stroke={STROKE} strokeWidth="0.8" />
          <ellipse cx="200" cy="160" fill="none" rx="42" ry="10" stroke={STROKE} strokeWidth="0.8" />
        </g>
        <text fill={activeStage === 1 ? 'var(--accent-soft)' : STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="8" letterSpacing="0.12em" x="26" y="136">
          LOX TANK
        </text>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={2}
        isActive={activeStage === 2}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M118 180 H182 L184 262 H116 Z"
          fill="none"
          stroke={stroke(2)}
          strokeWidth="1.5"
        />
        <circle cx="126" cy="200" fill="none" r="5" stroke={STROKE_DIM} strokeWidth="0.8" />
        <circle cx="150" cy="200" fill="none" r="5" stroke={STROKE_DIM} strokeWidth="0.8" />
        <circle cx="174" cy="200" fill="none" r="5" stroke={STROKE_DIM} strokeWidth="0.8" />
        <g clipPath="url(#starship-right)">
          <rect fill="none" height="36" stroke={STROKE} strokeWidth="0.7" width="72" x="164" y="210" />
        </g>
        <text fill={activeStage === 2 ? 'var(--accent-soft)' : STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="8" letterSpacing="0.12em" x="26" y="218">
          PAYLOAD / UI
        </text>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={3}
        isActive={activeStage === 3}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M116 262 H184 L180 344 H120 Z"
          fill="none"
          stroke={stroke(3)}
          strokeWidth="1.5"
        />
        <g clipPath="url(#starship-right)">
          <circle cx="176" cy="292" fill="none" r="8" stroke={STROKE} strokeWidth="0.9" />
          <circle cx="200" cy="292" fill="none" r="8" stroke={STROKE} strokeWidth="0.9" />
          <circle cx="224" cy="292" fill="none" r="8" stroke={STROKE} strokeWidth="0.9" />
        </g>
        <path d="M108 312 L120 262 L120 332 Z M192 312 L180 262 L180 332 Z" fill="none" stroke={stroke(3)} strokeWidth="1" />
        <text fill={activeStage === 3 ? 'var(--accent-soft)' : STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="8" letterSpacing="0.12em" x="26" y="296">
          RAPTOR BAY
        </text>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={4}
        isActive={activeStage === 4}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M120 344 H180 L172 460 L204 470 L204 530 L96 530 L96 470 L128 460 Z"
          fill="none"
          stroke={stroke(4)}
          strokeWidth="1.5"
        />
        <g clipPath="url(#starship-right)">
          {Array.from({ length: 9 }).map((_, engine) => (
            <circle
              cx={162 + (engine % 3) * 18}
              cy={498 + Math.floor(engine / 3) * 16}
              fill="none"
              key={engine}
              r="5"
              stroke={STROKE}
              strokeWidth="0.7"
            />
          ))}
        </g>
        <path d="M88 420 L120 344 L120 448 Z M212 420 L180 344 L180 448 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
        <text fill={activeStage === 4 ? 'var(--accent-soft)' : STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="8" letterSpacing="0.12em" x="26" y="414">
          SUPER HEAVY
        </text>
      </RocketSlice>

      {/* Ligne centrale de coupe */}
      <line stroke={STROKE_DIM} strokeDasharray="4 3" strokeWidth="0.8" x1="150" x2="150" y1="28" y2="530" />

      {/* Encadrement technique */}
      <g opacity="0.7" stroke={STROKE_DIM} strokeWidth="0.8">
        <path d="M46 98 L56 98 L56 344 L46 344" fill="none" />
        <path d="M46 98 L52 98 M46 216 L52 216 M46 344 L52 344" />
      </g>
      <text fill={STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="7" letterSpacing="0.14em" transform="rotate(-90 28 220)" x="28" y="220">
        STARSHIP
      </text>
      <g opacity="0.7" stroke={STROKE_DIM} strokeWidth="0.8">
        <path d="M46 344 L56 344 L56 530 L46 530" fill="none" />
        <path d="M46 344 L52 344 M46 437 L52 437 M46 530 L52 530" />
      </g>
      <text fill={STROKE_DIM} fontFamily="var(--font-space-grotesk), monospace" fontSize="7" letterSpacing="0.14em" transform="rotate(-90 28 440)" x="28" y="440">
        SUPER HEAVY
      </text>

      <g fontFamily="var(--font-space-grotesk), monospace" fontSize="7.5" letterSpacing="0.1em">
        <text fill={STROKE_DIM} x="198" y="38">
          STARSHIP CUTAWAY
        </text>
        <text fill={STROKE_DIM} x="198" y="52">
          SCALE 1:50
        </text>
        <text fill={STROKE_DIM} x="198" y="66">
          REV. 3A
        </text>
      </g>
    </svg>
  )
}

function StageDetailCard({ step, className }: { step: CutawayStep; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-[color:var(--accent)]/30 bg-[rgb(8_18_36_/_0.9)] p-4 backdrop-blur-sm', className)}>
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
    if (isLaunching) return

    if (reduceMotion) {
      router.push('/contact')
      return
    }

    setIsLaunching(true)
    window.setTimeout(() => router.push('/contact'), 1300)
  }, [isLaunching, reduceMotion, router])

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

      {/* Desktop (xl+) : fusée Starship + panneau blueprint + Lancer */}
      <div className="mt-8 hidden overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[#0a1830] xl:block sm:mt-10">
        <div
          className="relative px-8 py-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(255 255 255 / 0.13) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[340px]">
                <AnimatePresence>
                  {isLaunching ? (
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1.8, 2.4] }}
                      className="pointer-events-none absolute bottom-2 left-1/2 z-0 h-44 w-24 -translate-x-1/2 bg-gradient-to-t from-[var(--accent)] via-[var(--accent-soft)] to-transparent blur-xl"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                    />
                  ) : null}
                </AnimatePresence>
                <motion.div
                  animate={isLaunching ? { y: -32, opacity: 0.65 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StarshipSvg
                    activeStage={activeStage}
                    isLaunching={isLaunching}
                    onSelect={selectStage}
                  />
                </motion.div>
              </div>
              <p className="mt-3 text-center font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.18em] text-[rgb(232_238_247_/_0.55)] uppercase">
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
                <p className="text-xs text-[rgb(232_238_247_/_0.55)]">
                  Étape {activeStage + 1} / {PROJECT_CUTAWAY_STEPS.length}
                </p>
                <Button className="gap-2" disabled={isLaunching} onClick={handleLaunch} type="button">
                  <Rocket aria-hidden className="size-4" />
                  {isLaunching ? 'Lancement…' : 'Lancer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
