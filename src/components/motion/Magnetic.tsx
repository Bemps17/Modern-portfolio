'use client'

type MagneticProps = {
  children: React.ReactNode
  className?: string
  /** Conservé pour compatibilité API — sans effet magnétique. */
  strength?: number
}

/** Wrapper neutre — l’attraction magnétique au curseur a été retirée. */
export function Magnetic({ children, className }: MagneticProps) {
  return <div className={className}>{children}</div>
}
