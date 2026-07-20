'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import { submitContact, type ContactActionState } from '@/app/(frontend)/contact/actions'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'

const initialState: ContactActionState = { ok: false, message: '' }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  useEffect(() => {
    if (!state.message) return
    if (state.ok) toast.success(state.message)
    else toast.error(state.message)
  }, [state])

  return (
    <GlassCard className="p-6 sm:p-8">
      <form action={formAction} className="space-y-5" noValidate>
        <div className="space-y-2">
          <label className="text-sm text-[var(--muted)]" htmlFor="name">
            Nom
          </label>
          <input
            autoComplete="name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none focus:border-cyan-300/50"
            id="name"
            name="name"
            required
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-[var(--muted)]" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none focus:border-cyan-300/50"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-[var(--muted)]" htmlFor="message">
            Message
          </label>
          <textarea
            className="min-h-36 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none focus:border-cyan-300/50"
            id="message"
            name="message"
            required
          />
        </div>
        <div aria-hidden className="hidden">
          <label htmlFor="website">Website</label>
          <input autoComplete="off" id="website" name="website" tabIndex={-1} type="text" />
        </div>
        <Button disabled={pending} type="submit">
          {pending ? 'Envoi…' : 'Envoyer'}
        </Button>
      </form>
    </GlassCard>
  )
}
