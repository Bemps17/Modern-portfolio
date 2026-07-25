export const COUNTDOWN_TICK_MS = 900
export const IGNITION_MS = 500
export const LIFTOFF_MS = 2200
export const MISSION_MS = 450
export const COUNTDOWN_START = 3

export type LaunchPhase = 'idle' | 'countdown' | 'ignition' | 'liftoff' | 'mission'

export const LAYER_SPREAD = 18

export const SLICE_BOUNDS = [
  { y: 20, h: 70 },
  { y: 90, h: 90 },
  { y: 180, h: 100 },
  { y: 280, h: 100 },
  { y: 380, h: 130 },
] as const

export const STARSHIP_STROKE = 'rgb(232 238 247 / 0.94)'
export const STARSHIP_STROKE_DIM = 'rgb(232 238 247 / 0.38)'
export const STARSHIP_ORANGE = '#ff6b1a'
export const STARSHIP_IVOIRE = '#f8f4ef'
