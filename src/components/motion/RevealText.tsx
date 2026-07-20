'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

type RevealTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
}

export function RevealText({ text, as: Tag = 'span', className, delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className} ref={ref as never}>
      {words.map((word, index) => (
        <motion.span
          className="mr-[0.28em] inline-block"
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 18, filter: 'blur(6px)' }
          }
          key={`${word}-${index}`}
          transition={{ duration: 0.45, delay: delay + index * 0.07, ease: 'easeOut' }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

type SectionDividerProps = {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  const reduceMotion = useReducedMotion()

  return (
    <div className={cn('py-10', className)} ref={ref}>
      <motion.div
        animate={inView || reduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.4 }}
        className="h-px origin-left bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        initial={{ scaleX: 0, opacity: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
