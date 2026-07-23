import { cn } from '@/lib/utils'

/** Gouttières horizontales partagées — aligner toutes les sections sur ce rythme. */
export const CONTAINER_CLASSNAME = 'mx-auto w-full max-w-6xl px-3 sm:px-5 lg:px-8'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'main'
  id?: string
}

export function Container({ children, className, as: Tag = 'div', id }: ContainerProps) {
  return (
    <Tag className={cn(CONTAINER_CLASSNAME, className)} id={id}>
      {children}
    </Tag>
  )
}
