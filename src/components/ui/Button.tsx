'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'ghost' | 'glass'

type ButtonProps = {
  children: React.ReactNode
  className?: string
  href?: string
  variant?: ButtonVariant
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50'

const ghostClasses = 'bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/40'
const glassClasses =
  'border border-white/15 bg-white/10 text-white backdrop-blur-md hover:border-[color:var(--accent)]/35 hover:bg-white/15 focus-visible:ring-white/40'

function PrimaryButton({
  children,
  className,
  href,
  type,
  disabled,
  onClick,
}: Omit<ButtonProps, 'variant'>) {
  const inner = (
    <span
      className={cn(
        'relative z-[1] inline-flex w-full items-center justify-center rounded-[11px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-5 py-2.5 text-white hover:brightness-110',
        className,
      )}
    >
      {children}
    </span>
  )

  const shellClasses = cn(
    'group relative inline-flex overflow-hidden rounded-xl p-px',
    'bg-[linear-gradient(90deg,var(--accent),var(--accent-soft),var(--accent))] bg-[length:200%_100%] hover:animate-[shimmer_2.4s_linear_infinite]',
    disabled && 'opacity-50',
  )

  if (href) {
    return (
      <Link className={shellClasses} data-cursor="link" href={href}>
        {inner}
      </Link>
    )
  }

  return (
    <button className={shellClasses} disabled={disabled} onClick={onClick} type={type}>
      {inner}
    </button>
  )
}

export function Button({
  children,
  className,
  href,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
}: ButtonProps) {
  if (variant === 'primary') {
    return (
      <PrimaryButton className={className} disabled={disabled} href={href} onClick={onClick} type={type}>
        {children}
      </PrimaryButton>
    )
  }

  const classes = cn(baseClasses, variant === 'ghost' ? ghostClasses : glassClasses, className)

  if (href) {
    return (
      <Link className={classes} data-cursor="link" href={href}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  )
}
