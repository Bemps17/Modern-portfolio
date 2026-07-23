import { RevealText } from '@/components/motion/RevealText'
import { cn } from '@/lib/utils'

type EditorialTitleProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  bleed?: boolean
  reveal?: boolean
  when?: 'mount' | 'inView'
}

export function EditorialTitle({
  text,
  as: Tag = 'h2',
  className,
  bleed = false,
  reveal = true,
  when = 'inView',
}: EditorialTitleProps) {
  const classes = cn(
    'font-[family-name:var(--font-syne)] font-bold leading-[0.92] tracking-[-0.03em] text-balance',
    bleed
      ? 'text-[clamp(2.75rem,8vw,6.5rem)] xl:-ml-2 xl:w-[calc(100%+3rem)] xl:max-w-none'
      : 'text-[clamp(2rem,5vw,3.5rem)]',
    className,
  )

  if (reveal) {
    return <RevealText as={Tag} className={classes} text={text} when={when} />
  }

  return <Tag className={classes}>{text}</Tag>
}
