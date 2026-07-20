'use client'

import { BackgroundLayers } from '@/components/motion/BackgroundLayers'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { MouseGlow } from '@/components/motion/MouseGlow'

export function FunEffects() {
  return (
    <>
      <BackgroundLayers />
      <MouseGlow />
      <CustomCursor />
    </>
  )
}
