'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const BLOBS = [
  {
    className: 'left-[-10%] top-[8%] h-[42vw] w-[42vw] animate-[blob-float-1_22s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.07)',
  },
  {
    className: 'right-[-8%] top-[35%] h-[36vw] w-[36vw] animate-[blob-float-2_26s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.06)',
  },
  {
    className: 'left-[25%] bottom-[5%] h-[30vw] w-[30vw] animate-[blob-float-3_20s_ease-in-out_infinite]',
    color: 'rgba(255, 179, 71, 0.05)',
  },
] as const

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='1'/%3E%3C/svg%3E")`

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const meshY = useTransform(scrollY, [0, 1200], [0, 180])
  const gridY = useTransform(scrollY, [0, 1200], [0, 60])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { y: meshY }}>
        {BLOBS.map((blob) => (
          <div
            className={`absolute rounded-full blur-3xl ${blob.className}`}
            key={blob.className}
            style={{ background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)` }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage: GRID_SVG,
          backgroundSize: '48px 48px',
          y: reduceMotion ? 0 : gridY,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: '180px 180px' }}
      />
    </div>
  )
}
