'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

const BLOBS = [
  {
    className: 'left-[-12%] top-[4%] h-[46vw] w-[46vw] animate-[blob-float-1_22s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.10)',
  },
  {
    className: 'right-[-10%] top-[28%] h-[40vw] w-[40vw] animate-[blob-float-2_26s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.08)',
  },
  {
    className: 'left-[22%] bottom-[2%] h-[34vw] w-[34vw] animate-[blob-float-3_20s_ease-in-out_infinite]',
    color: 'rgba(255, 179, 71, 0.07)',
  },
  {
    className: 'right-[10%] bottom-[-6%] h-[38vw] w-[38vw] animate-[blob-float-1_28s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.06)',
  },
  {
    className: 'left-[-6%] top-[52%] h-[32vw] w-[32vw] animate-[blob-float-2_24s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.05)',
  },
] as const

const PHOTO_LAYERS = [
  {
    alt: '',
    className: 'right-[-8%] top-[-10%] h-[min(92vh,980px)] w-[min(60vw,720px)]',
    opacity: 0.26,
    scroll: [0, 1600] as const,
    y: [0, 240] as const,
    src: SITE_IMAGES.backgrounds.marsHighway,
  },
  {
    alt: '',
    className: 'left-[-10%] top-[18%] h-[min(78vh,820px)] w-[min(52vw,640px)]',
    opacity: 0.2,
    scroll: [0, 1800] as const,
    y: [0, 360] as const,
    src: SITE_IMAGES.backgrounds.techParticles,
  },
  {
    alt: '',
    className: 'bottom-[-14%] right-[6%] h-[min(74vh,780px)] w-[min(54vw,680px)]',
    opacity: 0.18,
    scroll: [0, 2000] as const,
    y: [0, 420] as const,
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
      className={`pointer-events-none absolute overflow-hidden rounded-[2.5rem] ${className}`}
      style={enabled ? { y } : undefined}
    >
      <Image
        alt={alt}
        aria-hidden={alt === ''}
        className="object-cover object-center saturate-[0.9] contrast-[1.08]"
        fill
        sizes="(max-width: 1024px) 70vw, 45vw"
        src={src}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/30 via-[var(--background)]/10 to-[var(--background)]/55"
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
  const meshY = useTransform(scrollY, [0, 1400], [0, 220])
  const gridY = useTransform(scrollY, [0, 1400], [0, 80])
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
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 110%, rgba(255, 107, 26, 0.10) 0%, transparent 55%)',
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/45 via-[var(--background)]/20 to-[var(--background)]/85"
      />

      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: GRID_SVG,
          backgroundSize: '48px 48px',
          y: parallaxEnabled ? gridY : 0,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: '180px 180px' }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)',
        }}
      />
    </div>
  )
}
