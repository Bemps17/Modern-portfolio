import { RevealText } from '@/components/motion/RevealText'
import { cn } from '@/lib/utils'

type EditorialTitleProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  /** Titres pleine largeur avec débordement éditorial (hero, sections). */
  bleed?: boolean
  /** Titres contenus dans la colonne — pas de débordement au zoom. */
  contained?: boolean
  reveal?: boolean
  when?: 'mount' | 'inView'
}

export function EditorialTitle({
  text,
  as: Tag = 'h2',
  className,
  bleed = false,
  contained = false,
  reveal = true,
  when = 'inView',
}: EditorialTitleProps) {
  const useBleed = bleed && !contained

  const classes = cn(
    'font-[family-name:var(--font-syne)] font-bold tracking-[-0.03em]',
    contained
      ? 'max-w-full min-w-0 break-words hyphens-auto text-balance leading-[1.08] text-[clamp(1.75rem,4.5vw,3rem)]'
      : 'leading-[0.92] text-balance',
    useBleed
      ? 'text-[clamp(2.75rem,8vw,6.5rem)] xl:-ml-2 xl:w-[calc(100%+3rem)] xl:max-w-none'
      : !contained && 'text-[clamp(2rem,5vw,3.5rem)]',
    className,
  )

  if (reveal) {
    return <RevealText as={Tag} className={classes} text={text} when={when} />
  }

  return <Tag className={classes}>{text}</Tag>
}
