'use client'

import { CustomCursor } from '@/components/motion/CustomCursor'
import { MouseGlow } from '@/components/motion/MouseGlow'
import { BackgroundLayers } from '@/components/motion/BackgroundLayers'
import { useRichMotionEffects } from '@/lib/use-client-media'

export function FunEffects() {
  const richEffects = useRichMotionEffects()

  return (
    <>
      {/* Les couches de fond sont toujours rendues (desktop + mobile).
          Seuls les effets riches (glow souris, curseur custom) restent desktop-only. */}
      <BackgroundLayers />
      {richEffects ? <MouseGlow /> : null}
      <CustomCursor />
    </>
  )
}
