'use client'

import { motion, useReducedMotion } from 'framer-motion'

type FadeInWhenVisibleProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeInWhenVisible({ children, className, delay = 0 }: FadeInWhenVisibleProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -60px 0px' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    >
      {children}
    </motion.div>
  )
}
