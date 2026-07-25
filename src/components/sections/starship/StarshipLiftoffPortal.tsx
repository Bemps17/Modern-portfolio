'use client'

import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

import { LIFTOFF_MS } from './constants'
import { LaunchEffects } from './LaunchEffects'
import { StarshipSvg } from './StarshipSvg'

type StarshipLiftoffPortalProps = {
  active: boolean
  origin: DOMRect | null
  activeStage: number
}

/** Fusée en vol plein écran — sort du container via portal + z-index élevé. */
export function StarshipLiftoffPortal({ active, origin, activeStage }: StarshipLiftoffPortalProps) {
  if (typeof document === 'undefined' || !active || !origin) return null

  const centerX = origin.left + origin.width / 2
  const topY = origin.top

  return createPortal(
    <div aria-hidden className="starship-liftoff-layer">
      <motion.div
        animate={{
          x: '-50%',
          y: [0, -window.innerHeight * 1.15],
          opacity: [1, 1, 0.92, 0],
          scale: [1, 1.03, 1.06, 1.08],
          filter: ['blur(0px)', 'blur(0px)', 'blur(1.5px)', 'blur(4px)'],
        }}
        className="starship-liftoff-layer__craft"
        initial={{ x: '-50%', y: 0, opacity: 1, scale: 1 }}
        style={{
          left: centerX,
          top: topY,
          width: origin.width,
        }}
        transition={{ duration: LIFTOFF_MS / 1000, ease: [0.45, 0, 0.15, 1] }}
      >
        <LaunchEffects phase="liftoff" countdown={null} variant="flight" />
        <StarshipSvg
          activeStage={activeStage}
          isIgniting={false}
          isLaunching={false}
          stacked
          onSelect={() => undefined}
        />
      </motion.div>
      <motion.div
        animate={{ opacity: [0, 0.35, 0.15, 0] }}
        className="starship-liftoff-layer__trail"
        initial={{ opacity: 0 }}
        style={{ left: centerX }}
        transition={{ duration: LIFTOFF_MS / 1000, ease: 'easeOut' }}
      />
    </div>,
    document.body,
  )
}
