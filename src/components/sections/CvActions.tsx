'use client'

import { Download, Eye, FileText, Link2, Linkedin, Mail, Share2 } from 'lucide-react'
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

function cvFileName(fullName: string): string {
  const slug = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `CV-${slug || 'Portfolio'}.pdf`
}

function isShareAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
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
  const liveShareUrl = useSyncExternalStore(
    subscribeNoop,
    () => `${window.location.origin}/cv`,
    () => shareUrl,
  )

  const onDownload = useCallback(() => {
    setDownloading(true)
    const anchor = document.createElement('a')
    anchor.href = '/api/cv?download=1'
    anchor.download = cvFileName(fullName)
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => setDownloading(false), 400)
  }, [fullName])

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(liveShareUrl)
      toast.success('Lien du CV copié')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }, [liveShareUrl])

  const onNativeShare = useCallback(async () => {
    if (!navigator.share) return

    try {
      const response = await fetch('/api/cv')
      if (!response.ok) throw new Error(`CV HTTP ${response.status}`)
      const blob = await response.blob()
      const file = new File([blob], cvFileName(fullName), { type: 'application/pdf' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `CV — ${fullName}`,
          text: `CV de ${fullName}`,
        })
        setShareOpen(false)
        return
      }

      await navigator.share({
        title: `CV — ${fullName}`,
        text: `CV de ${fullName}`,
        url: liveShareUrl,
      })
      setShareOpen(false)
    } catch (error) {
      if (isShareAbort(error)) return
      try {
        await navigator.share({
          title: `CV — ${fullName}`,
          text: `CV de ${fullName}`,
          url: liveShareUrl,
        })
        setShareOpen(false)
      } catch (fallbackError) {
        if (isShareAbort(fallbackError)) return
        toast.error('Impossible de partager le CV')
      }
    }
  }, [fullName, liveShareUrl])

  return (
    <>
      <section
        aria-labelledby="cv-actions-title"
        className="cv-actions-panel mt-6 max-w-2xl rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-glass)] p-4 backdrop-blur-md sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent-soft)]"
          >
            <FileText className="size-5" strokeWidth={2} />
          </span>
          <div className="min-w-0 space-y-1">
            <h3
              className="font-[family-name:var(--font-syne)] text-lg font-semibold text-[var(--foreground)]"
              id="cv-actions-title"
            >
              Mon CV
            </h3>
            <p className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
              Visualisez la version web, partagez le lien ou téléchargez le PDF.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <a aria-label="Visualiser le CV en ligne" className={cn(glassAction, 'w-full sm:w-auto')} href="/cv">
            <Eye aria-hidden className="size-4 shrink-0" />
            <span>Visualiser</span>
          </a>

          <button
            aria-label="Partager le CV"
            aria-pressed={shareOpen}
            className={cn(glassAction, 'w-full sm:w-auto')}
            onClick={() => setShareOpen(true)}
            type="button"
          >
            <Share2 aria-hidden className="size-4 shrink-0" />
            <span>Partager</span>
          </button>

          <button
            aria-busy={downloading}
            aria-label="Télécharger le CV PDF"
            className={cn(primaryAction, 'w-full sm:w-auto')}
            onClick={onDownload}
            type="button"
          >
            <Download aria-hidden className="size-4 shrink-0" />
            <span>{downloading ? 'Téléchargement…' : 'Télécharger le PDF'}</span>
          </button>
        </div>
      </section>

      <Modal onClose={() => setShareOpen(false)} open={shareOpen} title="Partager le CV">
        <div className="grid gap-2">
          <ShareOption icon={Link2} label="Copier le lien" onClick={onCopy} />
          <ShareOption href={buildMailtoShareUrl(liveShareUrl, fullName)} icon={Mail} label="E-mail" />
          <ShareOption
            href={buildWhatsAppShareUrl(liveShareUrl, fullName)}
            icon={Share2}
            label="WhatsApp"
          />
          <ShareOption href={buildLinkedInShareUrl(liveShareUrl)} icon={Linkedin} label="LinkedIn" />
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
