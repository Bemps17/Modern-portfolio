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

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-400 to-violet-400 text-black hover:brightness-110 focus-visible:ring-cyan-300',
  ghost: 'bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/40',
  glass:
    'border border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/15 focus-visible:ring-white/40',
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
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    className,
  )

  if (href) {
    return (
      <Link className={classes} href={href}>
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
