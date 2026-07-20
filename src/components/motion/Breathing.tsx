'use client'

import { motion, useReducedMotion } from 'framer-motion'

type BreathingProps = {
  children: React.ReactNode
  className?: string
}

export function Breathing({ children, className }: BreathingProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      className={className}
      transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
    >
      {children}
    </motion.div>
  )
}
