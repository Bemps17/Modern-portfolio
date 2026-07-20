'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

type CursorMode = 'default' | 'view' | 'link' | 'open'

const LABELS: Record<CursorMode, string> = {
  default: '',
  view: 'Voir',
  link: 'Ouvrir',
  open: 'Externe',
}

export function CustomCursor() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.4 })
  const [mode, setMode] = useState<CursorMode>('default')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduceMotion) return

    setEnabled(true)
    document.body.classList.add('custom-cursor-active')

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)

      const target = event.target
      if (!(target instanceof Element)) return

      const cursorEl = target.closest('[data-cursor]')
      const cursorValue = cursorEl?.getAttribute('data-cursor') as CursorMode | null
      setMode(cursorValue && cursorValue in LABELS ? cursorValue : 'default')
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [x, y])

  if (!enabled) return null

  const label = LABELS[mode]
  const isActive = mode !== 'default'

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-normal"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        animate={{
          height: isActive ? 56 : 12,
          width: isActive ? 56 : 12,
          marginLeft: isActive ? -28 : -6,
          marginTop: isActive ? -28 : -6,
        }}
        className="relative flex items-center justify-center rounded-full border border-[var(--accent)]/80 bg-[var(--accent)]/20 backdrop-blur-sm"
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold tracking-wide text-[var(--accent-soft)] uppercase"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={label}
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
