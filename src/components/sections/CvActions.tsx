'use client'

import { Download, Eye, Link2, Linkedin, Mail, Share2 } from 'lucide-react'
import { useCallback, useState, useSyncExternalStore } from 'react'
import { toast } from 'sonner'

import { Modal } from '@/components/ui/Modal'
import {
  buildLinkedInShareUrl,
  buildMailtoShareUrl,
  buildWhatsAppShareUrl,
} from '@/lib/cv/share-links'
import { cn } from '@/lib/utils'

type CvActionsProps = {
  shareUrl: string
  fullName: string
}

function subscribeNoop() {
  return () => {}
}

function getCanNativeShareSnapshot() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

function getCanNativeShareServerSnapshot() {
  return false
}

const actionBase =
  'inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/50 active:scale-95 sm:px-4'

const glassAction = cn(
  actionBase,
  'border border-white/15 bg-white/10 text-white backdrop-blur-md',
  'hover:border-[color:var(--accent)]/35 hover:bg-white/15',
  'active:bg-white/20 active:brightness-90',
)

const primaryAction = cn(
  actionBase,
  'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white',
  'hover:brightness-110 active:brightness-90',
)

export function CvActions({ shareUrl, fullName }: CvActionsProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getCanNativeShareSnapshot,
    getCanNativeShareServerSnapshot,
  )

  const onDownload = useCallback(() => {
    setDownloading(true)
    const anchor = document.createElement('a')
    anchor.href = '/api/cv'
    anchor.download = ''
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => setDownloading(false), 400)
  }, [])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Lien du CV copié')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }, [shareUrl])

  const onNativeShare = useCallback(async () => {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: `CV — ${fullName}`,
        text: `CV de ${fullName}`,
        url: shareUrl,
      })
    } catch {
      // annulé par l'utilisateur — ignorer
    }
  }, [fullName, shareUrl])

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
        <a
          aria-label="Visualiser le CV"
          className={glassAction}
          href="/api/cv?preview=1"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Eye aria-hidden className="size-4 shrink-0" />
          <span className="hidden sm:inline">Visualiser</span>
        </a>

        <button
          aria-label="Partager le CV"
          aria-pressed={shareOpen}
          className={glassAction}
          onClick={() => setShareOpen(true)}
          type="button"
        >
          <Share2 aria-hidden className="size-4 shrink-0" />
          <span className="hidden sm:inline">Partager</span>
        </button>

        <button
          aria-busy={downloading}
          aria-label="Télécharger le CV PDF"
          className={primaryAction}
          onClick={onDownload}
          type="button"
        >
          <Download aria-hidden className="size-4 shrink-0" />
          <span className="hidden sm:inline">{downloading ? 'Téléchargement…' : 'Télécharger'}</span>
        </button>
      </div>

      <Modal onClose={() => setShareOpen(false)} open={shareOpen} title="Partager le CV">
        <div className="grid gap-2">
          <ShareOption icon={Link2} label="Copier le lien" onClick={onCopy} />
          <ShareOption href={buildMailtoShareUrl(shareUrl, fullName)} icon={Mail} label="E-mail" />
          <ShareOption
            href={buildWhatsAppShareUrl(shareUrl, fullName)}
            icon={Share2}
            label="WhatsApp"
          />
          <ShareOption href={buildLinkedInShareUrl(shareUrl)} icon={Linkedin} label="LinkedIn" />
          {canNativeShare ? (
            <ShareOption icon={Share2} label="Plus d'options…" onClick={onNativeShare} />
          ) : null}
        </div>
      </Modal>
    </>
  )
}

function ShareOption({
  label,
  icon: Icon,
  href,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  href?: string
  onClick?: () => void
}) {
  const classes = cn(
    'flex h-12 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-left text-sm font-medium text-[var(--foreground)]',
    'transition active:scale-[0.98] active:bg-white/15 hover:border-[color:var(--accent)]/30 hover:bg-white/10',
  )

  if (href) {
    return (
      <a className={classes} href={href} rel="noopener noreferrer" target="_blank">
        <Icon aria-hidden className="size-4 text-[var(--accent-soft)]" />
        {label}
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      <Icon aria-hidden className="size-4 text-[var(--accent-soft)]" />
      {label}
    </button>
  )
}
