'use client'

import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 right-0 left-0 z-[70] h-0.5 origin-left bg-[var(--accent)] lg:left-[72px]"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
