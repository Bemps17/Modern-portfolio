'use client'

import { motion } from 'framer-motion'

import { PROJECT_CUTAWAY_STEPS } from '@/lib/project-cutaway'

import {
  LAYER_SPREAD,
  SLICE_BOUNDS,
  STARSHIP_IVOIRE,
  STARSHIP_ORANGE,
  STARSHIP_STROKE,
  STARSHIP_STROKE_DIM,
} from './constants'

type RocketSliceProps = {
  index: number
  activeStage: number
  isLaunching: boolean
  isIgniting: boolean
  isActive: boolean
  onSelect: (index: number) => void
  children: React.ReactNode
}

function RocketSlice({
  index,
  activeStage,
  isLaunching,
  isIgniting,
  isActive,
  onSelect,
  children,
}: RocketSliceProps) {
  const spread = activeStage >= index ? index * LAYER_SPREAD : 0
  const bounds = SLICE_BOUNDS[index]
  const stageLabel = String(index + 1).padStart(2, '0')

  return (
    <motion.g
      animate={
        isLaunching
          ? {
              y: -620 - index * 36,
              opacity: 0,
              rotate: index % 2 === 0 ? -5 : 5,
            }
          : isIgniting
            ? { y: spread - 2, scale: 0.985, opacity: 1 }
            : { y: spread, scale: 1, opacity: 1, rotate: 0 }
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
      style={{ cursor: 'pointer', transformOrigin: '120px 260px' }}
      tabIndex={0}
      transition={
        isLaunching
          ? { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }
          : isIgniting
            ? { duration: 0.35, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 260, damping: 20 }
      }
    >
      <rect
        fill={isActive ? 'url(#starship-body-fill)' : 'transparent'}
        filter={isActive ? 'url(#starship-active-glow)' : undefined}
        height={bounds.h}
        rx="3"
        stroke={isActive ? 'var(--accent)' : 'transparent'}
        strokeOpacity={0.75}
        width="80"
        x="80"
        y={bounds.y}
      />
      <text
        fill={isActive ? 'var(--accent-soft)' : STARSHIP_STROKE_DIM}
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        letterSpacing="0.08em"
        x="168"
        y={bounds.y + bounds.h / 2 + 3}
      >
        {stageLabel}
      </text>
      {children}
    </motion.g>
  )
}

type StarshipSvgProps = {
  activeStage: number
  isLaunching: boolean
  isIgniting: boolean
  onSelect: (index: number) => void
}

/** Fusée hybride rétro-technique : ogive, damier, hublots, ailerons, buses. */
export function StarshipSvg({ activeStage, isLaunching, isIgniting, onSelect }: StarshipSvgProps) {
  const stroke = (index: number) => (activeStage === index ? 'var(--accent-soft)' : STARSHIP_STROKE)
  const portholeOpacity = (index: number) => (activeStage === index ? 0.35 : 0.12)

  return (
    <svg
      aria-label="Fusée hybride rétro-technique"
      className="mx-auto h-auto w-full max-h-[min(64vh,540px)]"
      viewBox="0 0 240 540"
    >
      <defs>
        <linearGradient id="starship-body-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(255 107 26 / 0.24)" />
          <stop offset="100%" stopColor="rgb(153 27 27 / 0.1)" />
        </linearGradient>
        <filter height="180%" id="starship-active-glow" width="180%" x="-40%" y="-40%">
          <feGaussianBlur result="blur" stdDeviation="3.5" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <RocketSlice
        activeStage={activeStage}
        index={0}
        isActive={activeStage === 0}
        isIgniting={isIgniting}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M120 22 C 100 50, 92 75, 90 90 H 150 C 148 75, 140 50, 120 22 Z"
          fill="url(#starship-body-fill)"
          stroke={stroke(0)}
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
        <path d="M90 90 H 150" stroke={STARSHIP_STROKE} strokeWidth="1" />
        <circle cx="120" cy="56" fill="none" r="4" stroke={STARSHIP_STROKE_DIM} strokeWidth="0.8" />
        <circle cx="120" cy="56" fill={STARSHIP_STROKE_DIM} r="1.4" />
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={1}
        isActive={activeStage === 1}
        isIgniting={isIgniting}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 90 H 150 V 180 H 90 Z" fill="url(#starship-body-fill)" stroke={stroke(1)} strokeWidth="1.5" />
        <rect fill={STARSHIP_ORANGE} height="35" opacity="0.92" width="15" x="90" y="95" />
        <rect fill={STARSHIP_ORANGE} height="35" opacity="0.92" width="15" x="120" y="95" />
        <rect fill={STARSHIP_ORANGE} height="35" opacity="0.92" width="15" x="105" y="130" />
        <rect fill={STARSHIP_ORANGE} height="35" opacity="0.92" width="15" x="135" y="130" />
        <rect fill={STARSHIP_IVOIRE} height="35" opacity="0.16" width="15" x="105" y="95" />
        <rect fill={STARSHIP_IVOIRE} height="35" opacity="0.16" width="15" x="135" y="95" />
        <rect fill={STARSHIP_IVOIRE} height="35" opacity="0.16" width="15" x="90" y="130" />
        <rect fill={STARSHIP_IVOIRE} height="35" opacity="0.16" width="15" x="120" y="130" />
        <g stroke={STARSHIP_STROKE_DIM} strokeWidth="0.5">
          <path d="M105 95 V 165 M120 95 V 165 M135 95 V 165 M90 130 H 150" />
        </g>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={2}
        isActive={activeStage === 2}
        isIgniting={isIgniting}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 180 H 150 V 280 H 90 Z" fill="url(#starship-body-fill)" stroke={stroke(2)} strokeWidth="1.5" />
        <path d="M90 200 H 150 M90 260 H 150" stroke={STARSHIP_STROKE_DIM} strokeWidth="0.7" />
        <circle cx="102" cy="230" fill="none" r="6" stroke={stroke(2)} strokeWidth="1" />
        <circle cx="120" cy="230" fill="none" r="6" stroke={stroke(2)} strokeWidth="1" />
        <circle cx="138" cy="230" fill="none" r="6" stroke={stroke(2)} strokeWidth="1" />
        <circle cx="102" cy="230" fill={STARSHIP_IVOIRE} opacity={portholeOpacity(2)} r="3.5" />
        <circle cx="120" cy="230" fill={STARSHIP_IVOIRE} opacity={portholeOpacity(2)} r="3.5" />
        <circle cx="138" cy="230" fill={STARSHIP_IVOIRE} opacity={portholeOpacity(2)} r="3.5" />
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={3}
        isActive={activeStage === 3}
        isIgniting={isIgniting}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 280 H 150 V 380 H 90 Z" fill="url(#starship-body-fill)" stroke={stroke(3)} strokeWidth="1.5" />
        <path d="M90 320 H 150 M90 360 H 150" stroke={STARSHIP_STROKE_DIM} strokeWidth="0.7" />
        <g fill={STARSHIP_STROKE_DIM}>
          <circle cx="100" cy="300" r="1.2" />
          <circle cx="120" cy="300" r="1.2" />
          <circle cx="140" cy="300" r="1.2" />
          <circle cx="100" cy="340" r="1.2" />
          <circle cx="120" cy="340" r="1.2" />
          <circle cx="140" cy="340" r="1.2" />
        </g>
        <rect fill="none" height="14" rx="2" stroke={STARSHIP_STROKE_DIM} strokeWidth="0.7" width="22" x="109" y="358" />
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={4}
        isActive={activeStage === 4}
        isIgniting={isIgniting}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path d="M90 380 H 150 V 440 H 90 Z" fill="url(#starship-body-fill)" stroke={stroke(4)} strokeWidth="1.5" />
        <path d="M90 440 H 150 L 140 480 H 100 Z" fill="url(#starship-body-fill)" stroke={stroke(4)} strokeWidth="1.5" />
        <path
          d="M90 400 L 55 445 L 78 445 L 90 415 Z"
          fill={STARSHIP_ORANGE}
          opacity="0.85"
          stroke={stroke(4)}
          strokeWidth="1.2"
        />
        <path d="M90 420 L 80 450 L 90 450 Z" fill={STARSHIP_IVOIRE} opacity="0.18" stroke={stroke(4)} strokeWidth="1" />
        <path
          d="M150 400 L 185 445 L 162 445 L 150 415 Z"
          fill={STARSHIP_ORANGE}
          opacity="0.85"
          stroke={stroke(4)}
          strokeWidth="1.2"
        />
        <path d="M150 420 L 160 450 L 150 450 Z" fill={STARSHIP_IVOIRE} opacity="0.18" stroke={stroke(4)} strokeWidth="1" />
        <path d="M100 480 L 98 505 L 112 505 L 110 480 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
        <path d="M114 480 L 112 505 L 126 505 L 124 480 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
        <path d="M128 480 L 126 505 L 140 505 L 138 480 Z" fill="none" stroke={stroke(4)} strokeWidth="1.2" />
      </RocketSlice>

      <line
        stroke={activeStage >= 0 ? 'var(--accent-soft)' : STARSHIP_STROKE_DIM}
        strokeDasharray="4 3"
        strokeOpacity={activeStage >= 0 ? 0.55 : 0.35}
        strokeWidth="0.8"
        x1="120"
        x2="120"
        y1="22"
        y2="480"
      />
    </svg>
  )
}
