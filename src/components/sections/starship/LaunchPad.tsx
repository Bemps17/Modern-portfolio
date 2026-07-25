'use client'

import { cn } from '@/lib/utils'
import type { LaunchPhase } from './constants'

type LaunchPadProps = {
  children: React.ReactNode
  phase: LaunchPhase
  className?: string
}

export function LaunchPad({ children, phase, className }: LaunchPadProps) {
  const shaking = phase === 'countdown' || phase === 'ignition'

  return (
    <div className={cn('starship-pad', shaking && 'starship-pad--shake', className)}>
      <span aria-hidden className="starship-pad__shadow" />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
