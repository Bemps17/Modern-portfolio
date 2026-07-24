import { Download } from 'lucide-react'

import { cn } from '@/lib/utils'

const glassClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition duration-200 hover:border-[color:var(--accent)]/35 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'

type CvDownloadButtonProps = {
  className?: string
  label?: string
}

export function CvDownloadButton({
  className,
  label = 'Télécharger le CV (PDF)',
}: CvDownloadButtonProps) {
  return (
    <a className={cn(glassClasses, className)} data-cursor="link" href="/api/cv" rel="noopener">
      <Download aria-hidden className="size-4 shrink-0" />
      <span>{label}</span>
    </a>
  )
}
