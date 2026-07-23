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

const LAYER_SPREAD = 28
const STROKE = 'rgb(232 238 247 / 0.94)'
const STROKE_DIM = 'rgb(232 238 247 / 0.38)'

/** Positions overlay mobile (%) alignées sur les étages Starship. */
const MOBILE_OVERLAY_TOP = ['4%', '20%', '36%', '50%', '66%'] as const

const SLICE_BOUNDS = [
  { y: 14, h: 78, label: 'NOSE CONE' },
  { y: 92, h: 88, label: 'FORWARD LOX' },
  { y: 180, h: 92, label: 'PAYLOAD' },
  { y: 272, h: 88, label: 'RAPTOR BAY' },
  { y: 360, h: 200, label: 'SUPER HEAVY' },
] as const

type BlueprintSliceProps = {
  index: number
  activeStage: number
  isLaunching: boolean
  isActive: boolean
  onSelect: (index: number) => void
  children: React.ReactNode
}

function BlueprintSlice({
  index,
  activeStage,
  isLaunching,
  isActive,
  onSelect,
  children,
}: BlueprintSliceProps) {
  const spread = activeStage >= index ? index * LAYER_SPREAD : 0
  const bounds = SLICE_BOUNDS[index]

  return (
    <motion.g
      animate={
        isLaunching
          ? { y: -620 - index * 40, opacity: 0 }
          : { y: spread, opacity: 1 }
      }
      className="cursor-pointer"
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(index)
        }
      }}
      role="button"
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
        stroke={isActive ? 'var(--accent)' : 'transparent'}
        strokeOpacity={0.7}
        width={168}
        x="66"
        y={bounds.y}
      />
      {children}
    </motion.g>
  )
}

function StarshipBlueprintSvg({
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
    <svg aria-label="Plan de coupe Starship interactif" className="h-auto w-full" viewBox="0 0 300 580">
      <defs>
        <clipPath id="cutaway-right">
          <rect height="560" width="150" x="150" y="10" />
        </clipPath>
      </defs>

      <g opacity="0.45" stroke={STROKE_DIM} strokeWidth="0.5">
        {Array.from({ length: 28 }).map((_, row) => (
          <line key={`grid-h-${row}`} x1="20" x2="280" y1={20 + row * 20} y2={20 + row * 20} />
        ))}
        {Array.from({ length: 14 }).map((_, col) => (
          <line key={`grid-v-${col}`} x1={20 + col * 20} x2={20 + col * 20} y1="20" y2="560" />
        ))}
      </g>

      {/* Coque extérieure gauche — silhouette Starship */}
      <path
        d="M150 18
           C150 18 178 52 182 92
           L188 180
           L184 272
           L176 360
           L168 420
           L198 430
           L198 548
           L102 548
           L102 430
           L132 420
           L124 360
           L116 272
           L112 180
           L118 92
           C122 52 150 18 150 18 Z"
        fill="none"
        opacity="0.35"
        stroke={STROKE_DIM}
        strokeWidth="1"
      />

      <BlueprintSlice
        activeStage={activeStage}
        index={0}
        isActive={activeStage === 0}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M150 22 C165 48 172 68 174 92 L126 92 C128 68 135 48 150 22 Z"
          fill="none"
          stroke={stroke(0)}
          strokeWidth="1.5"
        />
        <path d="M126 92 H174" stroke={STROKE} strokeWidth="1" />
        <g clipPath="url(#cutaway-right)">
          <ellipse cx="192" cy="58" fill="none" rx="22" ry="12" stroke={STROKE_DIM} strokeWidth="0.8" />
        </g>
        <text fill={activeStage === 0 ? 'var(--accent-soft)' : STROKE_DIM} fontSize="8" letterSpacing="0.12em" x="24" y="58">
          NOSE
        </text>
      </BlueprintSlice>

      <BlueprintSlice
        activeStage={activeStage}
        index={1}
        isActive={activeStage === 1}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M126 92 H174 L178 148 L122 148 Z"
          fill="none"
          stroke={stroke(1)}
          strokeWidth="1.5"
        />
        <path d="M118 118 H182 M118 132 H182" stroke={STROKE_DIM} strokeWidth="0.7" />
        <g clipPath="url(#cutaway-right)">
          <path d="M158 104 H220 M158 124 H220" stroke={STROKE_DIM} strokeWidth="0.7" />
          <rect fill="none" height="28" stroke={STROKE_DIM} strokeWidth="0.7" width="48" x="168" y="108" />
        </g>
        <text fill={activeStage === 1 ? 'var(--accent-soft)' : STROKE_DIM} fontSize="8" letterSpacing="0.12em" x="24" y="124">
          LOX TANK
        </text>
      </BlueprintSlice>

      <BlueprintSlice
        activeStage={activeStage}
        index={2}
        isActive={activeStage === 2}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M122 148 H178 L182 228 L118 228 Z"
          fill="none"
          stroke={stroke(2)}
          strokeWidth="1.5"
        />
        <path d="M128 168 H172 M128 188 H172 M128 208 H172" stroke={STROKE_DIM} strokeWidth="0.6" />
        <g clipPath="url(#cutaway-right)">
          <ellipse cx="200" cy="178" fill="none" rx="36" ry="14" stroke={STROKE} strokeWidth="0.8" />
          <ellipse cx="200" cy="208" fill="none" rx="36" ry="14" stroke={STROKE} strokeWidth="0.8" />
        </g>
        <path d="M188 162 L208 178 L188 194 Z M112 178 L92 194 L112 210 Z" fill="none" stroke={STROKE_DIM} strokeWidth="0.8" />
        <text fill={activeStage === 2 ? 'var(--accent-soft)' : STROKE_DIM} fontSize="8" letterSpacing="0.12em" x="24" y="192">
          STARSHIP
        </text>
      </BlueprintSlice>

      <BlueprintSlice
        activeStage={activeStage}
        index={3}
        isActive={activeStage === 3}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M118 228 H182 L176 310 L124 310 Z"
          fill="none"
          stroke={stroke(3)}
          strokeWidth="1.5"
        />
        <g clipPath="url(#cutaway-right)">
          <circle cx="178" cy="262" fill="none" r="10" stroke={STROKE} strokeWidth="0.9" />
          <circle cx="206" cy="262" fill="none" r="10" stroke={STROKE} strokeWidth="0.9" />
          <circle cx="192" cy="286" fill="none" r="8" stroke={STROKE_DIM} strokeWidth="0.8" />
        </g>
        <path d="M108 250 L124 228 L124 268 Z M192 250 L208 228 L208 268 Z" fill="none" stroke={stroke(3)} strokeWidth="1" />
        <text fill={activeStage === 3 ? 'var(--accent-soft)' : STROKE_DIM} fontSize="8" letterSpacing="0.12em" x="24" y="272">
          RAPTOR
        </text>
      </BlueprintSlice>

      <BlueprintSlice
        activeStage={activeStage}
        index={4}
        isActive={activeStage === 4}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M124 310 H176 L168 420 L198 430 L198 548 L102 548 L102 430 L132 420 Z"
          fill="none"
          stroke={stroke(4)}
          strokeWidth="1.5"
        />
        <path d="M108 360 L124 310 L124 380 Z M192 360 L176 310 L176 380 Z" fill="none" stroke={STROKE} strokeWidth="1" />
        <g clipPath="url(#cutaway-right)">
          <path d="M156 330 L220 350 L156 370 Z M156 390 L220 410 L156 430 Z" fill="none" stroke={STROKE_DIM} strokeWidth="0.7" />
          {Array.from({ length: 7 }).map((_, engine) => (
            <circle
              cx={162 + (engine % 4) * 16}
              cy={500 + Math.floor(engine / 4) * 14}
              fill="none"
              key={engine}
              r="5"
              stroke={STROKE}
              strokeWidth="0.7"
            />
          ))}
        </g>
        <text fill={activeStage === 4 ? 'var(--accent-soft)' : STROKE_DIM} fontSize="8" letterSpacing="0.12em" x="24" y="400">
          BOOSTER
        </text>
      </BlueprintSlice>

      <line stroke={STROKE_DIM} strokeDasharray="4 3" strokeWidth="0.8" x1="150" x2="150" y1="20" y2="555" />

      <g fontFamily="var(--font-space-grotesk), monospace" fontSize="7.5" letterSpacing="0.1em">
        <text fill={STROKE_DIM} x="210" y="34">
          STARSHIP CUTAWAY
        </text>
        <text fill={STROKE_DIM} x="210" y="48">
          SCALE 1:50
        </text>
        <text fill={STROKE_DIM} x="210" y="62">
          REV. 3A
        </text>
      </g>

      <g opacity="0.65" stroke={STROKE_DIM} strokeWidth="0.7">
        <path d="M38 92 L48 92 L48 310 L38 310" fill="none" />
        <text fill={STROKE_DIM} fontSize="7" letterSpacing="0.14em" transform="rotate(-90 32 200)" x="32" y="200">
          STARSHIP
        </text>
        <path d="M38 310 L48 310 L48 548 L38 548" fill="none" />
        <text fill={STROKE_DIM} fontSize="7" letterSpacing="0.14em" transform="rotate(-90 32 430)" x="32" y="430">
          SUPER HEAVY
        </text>
      </g>
    </svg>
  )
}

function MobileStageOverlay({ step, activeStage }: { step: CutawayStep; activeStage: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="absolute inset-x-3 z-20 max-w-[92%] sm:inset-x-6"
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        key={step.id}
        style={{ top: MOBILE_OVERLAY_TOP[activeStage] }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="rounded-xl border border-[color:var(--accent)]/40 bg-[rgb(8_18_36_/_0.88)] p-3.5 shadow-[0_12px_40px_rgb(0_0_0_/_0.45)] backdrop-blur-md">
          <p className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] text-[var(--accent-soft)] uppercase">
            {step.blueprintTag}
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-syne)] text-base font-semibold leading-tight text-[var(--foreground)]">
            {step.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground-secondary)]">{step.description}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function StepPill({
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
        'shrink-0 snap-center rounded-full border px-3 py-1.5 font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-wide transition',
        isActive
          ? 'border-[color:var(--accent)]/60 bg-[var(--accent)]/15 text-[var(--accent-soft)]'
          : 'border-[color:var(--border)] bg-[rgb(8_18_36_/_0.7)] text-[var(--foreground-secondary)]',
      )}
      onClick={() => onSelect(index)}
      type="button"
    >
      {String(index + 1).padStart(2, '0')}
    </button>
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[#0a1830] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.06)] sm:mt-10 sm:rounded-3xl">
        <div
          className="relative px-3 py-5 sm:px-8 sm:py-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgb(255 255 255 / 0.13) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-start lg:gap-10">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[min(100%,340px)]">
                <AnimatePresence>
                  {isLaunching ? (
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1.8, 2.4] }}
                      className="pointer-events-none absolute bottom-4 left-1/2 z-0 h-40 w-24 -translate-x-1/2 bg-gradient-to-t from-[var(--accent)] via-[var(--accent-soft)] to-transparent blur-xl"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                    />
                  ) : null}
                </AnimatePresence>

                <motion.div
                  animate={isLaunching ? { y: -30, opacity: 0.7 } : { y: 0, opacity: 1 }}
                  className="relative z-[1]"
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StarshipBlueprintSvg
                    activeStage={activeStage}
                    isLaunching={isLaunching}
                    onSelect={selectStage}
                  />
                </motion.div>

                <div aria-live="polite" className="pointer-events-none absolute inset-0 z-20 lg:hidden">
                  <MobileStageOverlay activeStage={activeStage} step={activeStep} />
                </div>
              </div>

              <p className="mt-3 text-center font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.18em] text-[rgb(232_238_247_/_0.55)] uppercase lg:mt-4">
                Touchez un étage de la fusée
              </p>

              <div className="mt-4 flex w-full max-w-[340px] items-center justify-center gap-2 lg:hidden">
                <button
                  aria-label="Étape précédente"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground-secondary)] disabled:opacity-40"
                  disabled={activeStage === 0}
                  onClick={goPrev}
                  type="button"
                >
                  <ChevronLeft aria-hidden className="size-4" />
                </button>
                <div className="flex gap-1.5">
                  {PROJECT_CUTAWAY_STEPS.map((step, index) => (
                    <StepPill
                      index={index}
                      isActive={activeStage === index}
                      key={step.id}
                      onSelect={selectStage}
                      step={step}
                    />
                  ))}
                </div>
                <button
                  aria-label="Étape suivante"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground-secondary)] disabled:opacity-40"
                  disabled={activeStage === PROJECT_CUTAWAY_STEPS.length - 1}
                  onClick={goNext}
                  type="button"
                >
                  <ChevronRight aria-hidden className="size-4" />
                </button>
              </div>

              <div className="mt-5 w-full max-w-[340px] lg:hidden">
                <Button className="w-full gap-2" disabled={isLaunching} onClick={handleLaunch} type="button">
                  <Rocket aria-hidden className="size-4" />
                  {isLaunching ? 'Lancement…' : 'Lancer'}
                </Button>
              </div>
            </div>

            <div className="mt-8 hidden space-y-5 lg:mt-0 lg:block">
              <StepRail activeStage={activeStage} onSelect={selectStage} steps={PROJECT_CUTAWAY_STEPS} />

              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[color:var(--accent)]/25 bg-[rgb(8_16_30_/_0.72)] p-4 backdrop-blur-sm"
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={activeStep.id}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <p className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] text-[var(--accent-soft)] uppercase">
                    {activeStep.blueprintTag}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold text-[var(--foreground)]">
                    {activeStep.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">
                    {activeStep.description}
                  </p>
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
