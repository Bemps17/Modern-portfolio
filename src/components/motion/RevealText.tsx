'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type RevealTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  /** `mount` : anime dès le rendu (hero). `inView` : au scroll (défaut). */
  when?: 'mount' | 'inView'
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.95 && rect.bottom > 0
}

export function RevealText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  when = 'inView',
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12, margin: '0px 0px -32px 0px' })
  const [visibleOnMount, setVisibleOnMount] = useState(when === 'mount')
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  useEffect(() => {
    if (reduceMotion || when === 'mount') return

    const el = ref.current
    if (!el) return

    const markVisibleIfNeeded = () => {
      if (isInViewport(el)) setVisibleOnMount(true)
    }

    markVisibleIfNeeded()
    const frame = window.requestAnimationFrame(markVisibleIfNeeded)
    const timer = window.setTimeout(markVisibleIfNeeded, 900)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [reduceMotion, when])

  const visible = when === 'mount' || visibleOnMount || inView

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
            visible
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
