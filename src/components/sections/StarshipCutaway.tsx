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

const LAYER_SPREAD = 26
const STROKE = 'rgb(232 238 247 / 0.92)'
const STROKE_DIM = 'rgb(232 238 247 / 0.35)'

const SLICE_BOUNDS = [
  { y: 18, h: 62 },
  { y: 78, h: 72 },
  { y: 148, h: 82 },
  { y: 228, h: 82 },
  { y: 308, h: 162 },
] as const

type BlueprintSliceProps = {
  index: number
  activeStage: number
  isLaunching: boolean
  isActive: boolean
  children: React.ReactNode
}

function BlueprintSlice({ index, activeStage, isLaunching, isActive, children }: BlueprintSliceProps) {
  const spread = activeStage >= index ? index * LAYER_SPREAD : 0

  return (
    <motion.g
      animate={
        isLaunching
          ? { y: -520 - index * 36, opacity: 0 }
          : { y: spread, opacity: 1 }
      }
      transition={
        isLaunching
          ? { duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }
          : { type: 'spring', stiffness: 260, damping: 20 }
      }
    >
      {isActive ? (
        <rect
          fill="rgb(255 107 26 / 0.1)"
          height={SLICE_BOUNDS[index].h}
          stroke="var(--accent)"
          strokeOpacity={0.65}
          width={156}
          x="62"
          y={SLICE_BOUNDS[index].y}
        />
      ) : null}
      {children}
    </motion.g>
  )
}

function BlueprintRocketVisual({
  activeStage,
  isLaunching,
  reduceMotion,
}: {
  activeStage: number
  isLaunching: boolean
  reduceMotion: boolean | null
}) {
  const spread = reduceMotion ? 0 : activeStage * LAYER_SPREAD

  return (
    <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[360px]">
      <AnimatePresence>
        {isLaunching ? (
          <motion.div
            animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1.6, 2.2] }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-0 h-36 w-20 -translate-x-1/2 bg-gradient-to-t from-[var(--accent)] via-[var(--accent-soft)] to-transparent blur-lg"
            initial={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        ) : null}
      </AnimatePresence>

      <motion.svg
        animate={isLaunching ? { y: -18, opacity: 0.85 } : { y: 0, opacity: 1 }}
        aria-hidden
        className="relative z-[1] h-auto w-full"
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        viewBox="0 0 280 520"
      >
        <g opacity="0.55" stroke={STROKE_DIM} strokeWidth="0.6">
          <line x1="24" x2="256" y1="40" y2="40" />
          <line x1="24" x2="256" y1="128" y2="128" />
          <line x1="24" x2="256" y1="216" y2="216" />
          <line x1="24" x2="256" y1="304" y2="304" />
          <line x1="24" x2="256" y1="392" y2="392" />
        </g>

        <BlueprintSlice
          activeStage={activeStage}
          index={0}
          isActive={activeStage === 0}
          isLaunching={isLaunching}
        >
          <path
            d="M140 24 L168 78 L112 78 Z"
            fill="none"
            stroke={activeStage === 0 ? 'var(--accent-soft)' : STROKE}
            strokeWidth="1.4"
          />
          <path d="M112 78 H168" fill="none" stroke={STROKE} strokeWidth="1" />
          <text
            fill={activeStage === 0 ? 'var(--accent-soft)' : STROKE_DIM}
            fontFamily="var(--font-space-grotesk), monospace"
            fontSize="9"
            letterSpacing="0.14em"
            x="28"
            y="58"
          >
            NOSE
          </text>
        </BlueprintSlice>

        <BlueprintSlice
          activeStage={activeStage}
          index={1}
          isActive={activeStage === 1}
          isLaunching={isLaunching}
        >
          <path
            d="M112 78 H168 L174 148 H106 Z"
            fill="none"
            stroke={activeStage === 1 ? 'var(--accent-soft)' : STROKE}
            strokeWidth="1.4"
          />
          <circle cx="124" cy="108" fill="none" r="7" stroke={STROKE_DIM} strokeWidth="0.8" />
          <circle cx="156" cy="108" fill="none" r="7" stroke={STROKE_DIM} strokeWidth="0.8" />
          <line stroke={STROKE_DIM} strokeWidth="0.8" x1="118" x2="162" y1="126" y2="126" />
          <text
            fill={activeStage === 1 ? 'var(--accent-soft)' : STROKE_DIM}
            fontFamily="var(--font-space-grotesk), monospace"
            fontSize="9"
            letterSpacing="0.14em"
            x="28"
            y="118"
          >
            CREW
          </text>
        </BlueprintSlice>

        <BlueprintSlice
          activeStage={activeStage}
          index={2}
          isActive={activeStage === 2}
          isLaunching={isLaunching}
        >
          <path
            d="M106 148 H174 L176 228 H104 Z"
            fill="none"
            stroke={activeStage === 2 ? 'var(--accent-soft)' : STROKE}
            strokeWidth="1.4"
          />
          <path d="M118 168 H162 M118 188 H162 M118 208 H162" stroke={STROKE_DIM} strokeWidth="0.7" />
          <text
            fill={activeStage === 2 ? 'var(--accent-soft)' : STROKE_DIM}
            fontFamily="var(--font-space-grotesk), monospace"
            fontSize="9"
            letterSpacing="0.14em"
            x="28"
            y="188"
          >
            TANKS
          </text>
        </BlueprintSlice>

        <BlueprintSlice
          activeStage={activeStage}
          index={3}
          isActive={activeStage === 3}
          isLaunching={isLaunching}
        >
          <path
            d="M104 228 H176 L170 308 H110 Z"
            fill="none"
            stroke={activeStage === 3 ? 'var(--accent-soft)' : STROKE}
            strokeWidth="1.4"
          />
          <circle cx="128" cy="268" fill="none" r="9" stroke={STROKE} strokeWidth="1" />
          <circle cx="152" cy="268" fill="none" r="9" stroke={STROKE} strokeWidth="1" />
          <circle cx="140" cy="292" fill="none" r="7" stroke={STROKE_DIM} strokeWidth="0.8" />
          <text
            fill={activeStage === 3 ? 'var(--accent-soft)' : STROKE_DIM}
            fontFamily="var(--font-space-grotesk), monospace"
            fontSize="9"
            letterSpacing="0.14em"
            x="28"
            y="268"
          >
            ENGINES
          </text>
        </BlueprintSlice>

        <BlueprintSlice
          activeStage={activeStage}
          index={4}
          isActive={activeStage === 4}
          isLaunching={isLaunching}
        >
          <path
            d="M110 308 H170 L158 468 H122 Z"
            fill="none"
            stroke={activeStage === 4 ? 'var(--accent-soft)' : STROKE}
            strokeWidth="1.4"
          />
          <path d="M96 360 L110 308 L110 372 Z M184 360 L170 308 L170 372 Z" fill="none" stroke={STROKE} strokeWidth="1" />
          <line stroke={STROKE_DIM} strokeWidth="0.8" x1="122" x2="158" y1="420" y2="420" />
          <text
            fill={activeStage === 4 ? 'var(--accent-soft)' : STROKE_DIM}
            fontFamily="var(--font-space-grotesk), monospace"
            fontSize="9"
            letterSpacing="0.14em"
            x="28"
            y="388"
          >
            BOOSTER
          </text>
        </BlueprintSlice>

        <g opacity="0.7" stroke={STROKE_DIM} strokeWidth="0.8">
          <path d="M48 52 L58 52 L58 468 L48 468" fill="none" />
          <path d="M48 52 L54 52 M48 140 L54 140 M48 228 L54 228 M48 316 L54 316 M48 404 L54 404" />
        </g>

        <g
          fill="none"
          fontFamily="var(--font-space-grotesk), monospace"
          fontSize="8"
          letterSpacing="0.12em"
          stroke="none"
        >
          <text fill={STROKE_DIM} x="188" y="32">
            PROJECT CUTAWAY
          </text>
          <text fill={STROKE_DIM} x="188" y="46">
            SCALE 1:50
          </text>
          <text fill={STROKE_DIM} x="188" y="60">
            REV. A
          </text>
        </g>

        {!reduceMotion ? (
          <motion.g animate={{ y: spread * 0.15 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
            <text
              fill="var(--accent-soft)"
              fontFamily="var(--font-space-grotesk), monospace"
              fontSize="10"
              letterSpacing="0.16em"
              x="188"
              y="500"
            >
              {PROJECT_CUTAWAY_STEPS[activeStage]?.blueprintTag}
            </text>
          </motion.g>
        ) : null}
      </motion.svg>
    </div>
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
        'shrink-0 snap-center rounded-full border px-3.5 py-2 font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide transition',
        isActive
          ? 'border-[color:var(--accent)]/60 bg-[var(--accent)]/15 text-[var(--accent-soft)]'
          : 'border-[color:var(--border)] bg-[var(--surface-glass)] text-[var(--foreground-secondary)]',
      )}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span className="text-[10px] opacity-70">{String(index + 1).padStart(2, '0')}</span>
      <span className="ml-1.5">{step.title}</span>
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[#0b1a30] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.06)] sm:mt-10 sm:rounded-3xl">
        <div
          className="relative px-4 py-6 sm:px-8 sm:py-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgb(255 255 255 / 0.14) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-start lg:gap-10">
            <div className="flex flex-col items-center">
              <BlueprintRocketVisual
                activeStage={activeStage}
                isLaunching={isLaunching}
                reduceMotion={reduceMotion}
              />
              <p className="mt-3 text-center font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.18em] text-[rgb(232_238_247_/_0.55)] uppercase">
                Plan de coupe — sélectionnez une étape
              </p>
            </div>

            <div className="mt-8 space-y-5 lg:mt-0">
              <div className="hidden lg:block">
                <StepRail activeStage={activeStage} onSelect={selectStage} steps={PROJECT_CUTAWAY_STEPS} />
              </div>

              <div className="lg:hidden">
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Étape précédente"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground-secondary)] disabled:opacity-40"
                    disabled={activeStage === 0}
                    onClick={goPrev}
                    type="button"
                  >
                    <ChevronLeft aria-hidden className="size-4" />
                  </button>

                  <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground-secondary)] disabled:opacity-40"
                    disabled={activeStage === PROJECT_CUTAWAY_STEPS.length - 1}
                    onClick={goNext}
                    type="button"
                  >
                    <ChevronRight aria-hidden className="size-4" />
                  </button>
                </div>
              </div>

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

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[rgb(232_238_247_/_0.55)]">
                  Étape {activeStage + 1} / {PROJECT_CUTAWAY_STEPS.length}
                </p>
                <Button className="w-full gap-2 sm:w-auto" disabled={isLaunching} onClick={handleLaunch} type="button">
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
