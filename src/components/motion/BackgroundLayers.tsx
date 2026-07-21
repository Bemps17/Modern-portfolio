'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

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

const PHOTO_LAYERS = [
  {
    alt: '',
    className: 'right-[-6%] top-[-6%] h-[min(88vh,920px)] w-[min(58vw,680px)]',
    opacity: 0.22,
    scroll: [0, 1400] as const,
    y: [0, 220] as const,
    src: SITE_IMAGES.backgrounds.marsHighway,
  },
  {
    alt: '',
    className: 'bottom-[-10%] left-[-8%] h-[min(72vh,760px)] w-[min(50vw,620px)]',
    opacity: 0.17,
    scroll: [0, 1400] as const,
    y: [0, 320] as const,
    src: SITE_IMAGES.backgrounds.hangar8Lounge,
  },
] as const

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='1'/%3E%3C/svg%3E")`

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

function ParallaxPhotoLayer({
  alt,
  className,
  opacity,
  scrollRange,
  yRange,
  src,
  enabled,
}: {
  alt: string
  className: string
  opacity: number
  scrollRange: readonly [number, number]
  yRange: readonly [number, number]
  src: string
  enabled: boolean
}) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [...scrollRange], [...yRange])

  return (
    <motion.div
      className={`pointer-events-none absolute overflow-hidden rounded-[2rem] ${className}`}
      style={enabled ? { y } : undefined}
    >
      <Image
        alt={alt}
        aria-hidden={alt === ''}
        className="object-cover object-center saturate-[0.85] contrast-[1.05]"
        fill
        sizes="(max-width: 1024px) 70vw, 45vw"
        src={src}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/35 via-[var(--background)]/10 to-[var(--background)]/55"
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: `rgba(10, 10, 10, ${1 - opacity})` }}
      />
    </motion.div>
  )
}

export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const meshY = useTransform(scrollY, [0, 1200], [0, 180])
  const gridY = useTransform(scrollY, [0, 1200], [0, 60])
  const parallaxEnabled = !reduceMotion

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      {PHOTO_LAYERS.map((layer) => (
        <ParallaxPhotoLayer
          alt={layer.alt}
          className={layer.className}
          enabled={parallaxEnabled}
          key={layer.src}
          opacity={layer.opacity}
          scrollRange={layer.scroll}
          src={layer.src}
          yRange={layer.y}
        />
      ))}

      <motion.div className="absolute inset-0" style={parallaxEnabled ? { y: meshY } : undefined}>
        {BLOBS.map((blob) => (
          <div
            className={`absolute rounded-full blur-3xl ${blob.className}`}
            key={blob.className}
            style={{ background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)` }}
          />
        ))}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/55 via-[var(--background)]/25 to-[var(--background)]/80"
      />

      <motion.div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage: GRID_SVG,
          backgroundSize: '48px 48px',
          y: parallaxEnabled ? gridY : 0,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: '180px 180px' }}
      />
    </div>
  )
}
