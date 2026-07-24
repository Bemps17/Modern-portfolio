'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

import { cn } from '@/lib/utils'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('button, [href], input, iframe')?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      lastFocusedRef.current?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.button
            aria-label="Fermer"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn(
              'relative z-[1] flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background-elevated)] shadow-2xl',
              className,
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            role="dialog"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] px-4 py-3">
              <h2 className="font-[family-name:var(--font-syne)] text-base font-semibold text-[var(--foreground)]" id={titleId}>
                {title}
              </h2>
              <button
                aria-label="Fermer la fenêtre"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--foreground-secondary)] transition active:scale-95 hover:bg-white/10 hover:text-[var(--foreground)]"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
