'use client'

import { SLICE_BOUNDS, STARSHIP_ORANGE, STARSHIP_STROKE, STARSHIP_STROKE_DIM } from './constants'

type MiniRocketProps = {
  activeStage: number
}

/** Silhouette fusée mobile — étage actif surligné. */
export function MiniRocket({ activeStage }: MiniRocketProps) {
  const scaleY = 200 / 540

  return (
    <svg aria-hidden className="h-[200px] w-12 shrink-0" viewBox="0 0 48 200">
      {SLICE_BOUNDS.map((bounds, index) => {
        const y = bounds.y * scaleY
        const h = bounds.h * scaleY
        const isActive = activeStage === index

        return (
          <g key={bounds.y}>
            <rect
              fill={isActive ? 'rgb(255 107 26 / 0.28)' : 'rgb(255 255 255 / 0.04)'}
              height={h - 2}
              rx="2"
              stroke={isActive ? STARSHIP_ORANGE : STARSHIP_STROKE_DIM}
              strokeWidth={isActive ? 1.2 : 0.6}
              width="28"
              x="10"
              y={y + 1}
            />
            {index === 0 ? (
              <path
                d="M24 6 C 20 12, 18 16, 17 20 H 31 C 30 16, 28 12, 24 6 Z"
                fill={isActive ? 'rgb(255 107 26 / 0.2)' : 'transparent'}
                stroke={isActive ? STARSHIP_ORANGE : STARSHIP_STROKE}
                strokeWidth="1"
              />
            ) : null}
            {index === 4 ? (
              <>
                <path d="M17 168 L 10 188 L 14 188 L 17 176 Z" fill={STARSHIP_ORANGE} opacity="0.7" />
                <path d="M31 168 L 38 188 L 34 188 L 31 176 Z" fill={STARSHIP_ORANGE} opacity="0.7" />
              </>
            ) : null}
          </g>
        )
      })}
      <line stroke={STARSHIP_STROKE_DIM} strokeDasharray="2 2" strokeWidth="0.5" x1="24" x2="24" y1="8" y2="188" />
    </svg>
  )
}
