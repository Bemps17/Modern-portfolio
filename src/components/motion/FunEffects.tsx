'use client'

import { BackgroundLayers } from '@/components/motion/BackgroundLayers'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { MouseGlow } from '@/components/motion/MouseGlow'
import { useRichMotionEffects } from '@/lib/use-client-media'

export function FunEffects() {
  const richEffects = useRichMotionEffects()

  return (
    <>
      {richEffects ? (
        <>
          <BackgroundLayers />
          <MouseGlow />
        </>
      ) : null}
      <CustomCursor />
    </>
  )
}
