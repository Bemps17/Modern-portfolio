import { cn } from '@/lib/utils'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'main'
}

export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full max-w-6xl px-3 sm:px-5 lg:px-8', className)}>{children}</Tag>
}
