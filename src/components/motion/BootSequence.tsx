'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LINES = [
  '> chargement du portfolio...',
  '> stack: Next.js + Payload ✓',
  '> café: ✓',
  '> prêt.',
]

const STORAGE_KEY = 'portfolio-boot-seen'

type BootSequenceProps = {
  children: React.ReactNode
}

export function BootSequence({ children }: BootSequenceProps) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || sessionStorage.getItem(STORAGE_KEY)) return

    const showTimer = window.setTimeout(() => setVisible(true), 0)

    const lineTimer = window.setInterval(() => {
      setLineIndex((current) => {
        if (current >= LINES.length - 1) {
          window.clearInterval(lineTimer)
          window.setTimeout(() => {
            sessionStorage.setItem(STORAGE_KEY, '1')
            setVisible(false)
          }, 220)
          return current
        }
        return current + 1
      })
    }, 160)

    const safetyTimer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
    }, 900)

    return () => {
      window.clearTimeout(showTimer)
      window.clearInterval(lineTimer)
      window.clearTimeout(safetyTimer)
    }
  }, [reduceMotion])

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Passer l'animation de démarrage"
            className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[var(--background)] px-6 text-left"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            onClick={dismiss}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') dismiss()
            }}
            type="button"
          >
            <div className="w-full max-w-md space-y-2 font-[family-name:var(--font-space-grotesk)] text-sm text-[var(--accent)]">
              {LINES.slice(0, lineIndex + 1).map((line) => (
                <motion.p
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -8 }}
                  key={line}
                >
                  {line}
                </motion.p>
              ))}
              <p className="pt-4 text-xs text-[var(--muted)]">Cliquer pour passer</p>
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>
      {children}
    </>
  )
}
