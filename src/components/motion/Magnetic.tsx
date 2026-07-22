'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef } from 'react'

type MagneticProps = {
  children: React.ReactNode
  className?: string
  /** Force d’attraction en px (desktop). */
  strength?: number
}

/**
 * Attraction magnétique au curseur — desktop only, respect reduced-motion.
 */
export function Magnetic({ children, className, strength = 18 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      onMouseMove={(event) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const offsetX = event.clientX - (rect.left + rect.width / 2)
        const offsetY = event.clientY - (rect.top + rect.height / 2)
        x.set((offsetX / rect.width) * strength)
        y.set((offsetY / rect.height) * strength)
      }}
      ref={ref}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  )
}
