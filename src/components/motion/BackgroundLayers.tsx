'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

import { SITE_IMAGES } from '@/lib/site-images'

const BLOBS = [
  {
    className: 'left-[-14%] top-[0%] h-[44vw] w-[44vw] animate-[blob-float-1_30s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.09)',
  },
  {
    className: 'right-[-12%] top-[32%] h-[38vw] w-[38vw] animate-[blob-float-2_34s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.07)',
  },
] as const

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1'/%3E%3C/svg%3E")`

/**
 * Parallax fond Mars — v4 (fluide dès le 1er frame)
 *
 * Cause du “pop” v3 :
 * 1. Gate `reduceMotion === false` → au hydrate, y passait de `0` à `-6%` d’un coup
 * 2. Scale animé au scroll + translate → sensation de “scale/décale” brusque
 *
 * Correctifs :
 * - y démarre à 0 px (pas d’offset initial)
 * - MotionValue branché dès que reduced-motion n’est pas explicitement true
 * - pas de scale scroll : oversize CSS uniquement, seul translateY bouge
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  // Translate pur, clampé — fluide, sans spring (pas de rubber-band).
  const y = useTransform(scrollY, [0, 2400], [0, 300], { clamp: true })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{
          // Marge verticale > amplitude max (300px) pour ne jamais découvrir le vide
          top: '-18%',
          height: '136%',
          // null (SSR) et false → même MotionValue à y=0 : aucun saut à l’hydratation
          y: reduceMotion === true ? 0 : y,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[62%_center] saturate-[0.92] contrast-[1.06]"
          decoding="async"
          fetchPriority="low"
          src={SITE_IMAGES.backgrounds.marsHighway}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[var(--background)]/48" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)]/82" />

      <div className="absolute inset-0">
        {BLOBS.map((blob) => (
          <div
            className={`absolute rounded-full blur-3xl motion-reduce:animate-none ${blob.className}`}
            key={blob.className}
            style={{ background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)` }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: GRID_SVG, backgroundSize: '48px 48px' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 50%, transparent 48%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  )
}
