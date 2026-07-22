'use client'

import { useMemo, useState, useTransition, type FormEvent } from 'react'

type SetupResult = {
  ok: boolean
  error?: string
  applied?: string[]
  redeployId?: string | null
  healthUrl?: string
  adminUrl?: string
  hint?: string
}

function randomSecret(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function AdminSetupForm() {
  const [vercelToken, setVercelToken] = useState('')
  const [databaseUri, setDatabaseUri] = useState('')
  const [payloadSecret, setPayloadSecret] = useState(() => randomSecret())
  const [siteUrl, setSiteUrl] = useState('https://modern-portfolio-two-orcin.vercel.app')
  const [seedAdminEmail, setSeedAdminEmail] = useState('bertrandwebdesigner@proton.me')
  const [seedAdminPassword, setSeedAdminPassword] = useState('')
  const [enableAdminTestLogin, setEnableAdminTestLogin] = useState(true)
  const [result, setResult] = useState<SetupResult | null>(null)
  const [pending, startTransition] = useTransition()

  const canSubmit = useMemo(
    () => Boolean(vercelToken.trim() && databaseUri.trim() && payloadSecret.trim().length >= 32),
    [vercelToken, databaseUri, payloadSecret],
  )

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      try {
        const response = await fetch('/api/setup/vercel-env', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vercelToken,
            databaseUri,
            payloadSecret,
            siteUrl,
            enableAdminTestLogin,
            seedAdminEmail,
            seedAdminPassword,
          }),
        })
        const data = (await response.json()) as SetupResult
        setResult(data)
      } catch (error) {
        setResult({
          ok: false,
          error: error instanceof Error ? error.message : 'Erreur réseau',
        })
      }
    })
  }

  return (
    <form className="mx-auto flex w-full max-w-xl flex-col gap-5" onSubmit={onSubmit}>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-white">Token Vercel</span>
        <input
          autoComplete="off"
          className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-[var(--accent)]"
          onChange={(event) => setVercelToken(event.target.value)}
          placeholder="vercel_xxxxxxxx"
          required
          type="password"
          value={vercelToken}
        />
        <span className="text-xs text-[var(--muted)]">
          Créer un token :{' '}
          <a
            className="text-[var(--accent-soft)] underline"
            href="https://vercel.com/account/tokens"
            rel="noreferrer"
            target="_blank"
          >
            vercel.com/account/tokens
          </a>{' '}
          (scope Full Account, une fois suffit).
        </span>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-white">DATABASE_URI (Neon pooler)</span>
        <textarea
          className="min-h-[88px] rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none focus:border-[var(--accent)]"
          onChange={(event) => setDatabaseUri(event.target.value)}
          placeholder="postgresql://…-pooler…/neondb?sslmode=require"
          required
          value={databaseUri}
        />
        <span className="text-xs text-[var(--muted)]">
          Neon → projet <code className="text-white/70">modern-portfolio</code> → Connection
          string → <strong className="font-medium text-white/80">Pooled</strong>.
        </span>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-white">PAYLOAD_SECRET</span>
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none focus:border-[var(--accent)]"
            onChange={(event) => setPayloadSecret(event.target.value)}
            required
            value={payloadSecret}
          />
          <button
            className="rounded-lg border border-white/15 px-3 text-xs text-[var(--muted)] hover:text-white"
            onClick={() => setPayloadSecret(randomSecret())}
            type="button"
          >
            Régénérer
          </button>
        </div>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-white">URL du site</span>
        <input
          className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-[var(--accent)]"
          onChange={(event) => setSiteUrl(event.target.value)}
          value={siteUrl}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-white">
        <input
          checked={enableAdminTestLogin}
          onChange={(event) => setEnableAdminTestLogin(event.target.checked)}
          type="checkbox"
        />
        Connexion admin 1 clic (footer)
      </label>

      {enableAdminTestLogin ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white">Email admin</span>
            <input
              className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-[var(--accent)]"
              onChange={(event) => setSeedAdminEmail(event.target.value)}
              type="email"
              value={seedAdminEmail}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white">Mot de passe admin</span>
            <input
              className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-[var(--accent)]"
              onChange={(event) => setSeedAdminPassword(event.target.value)}
              type="password"
              value={seedAdminPassword}
            />
          </label>
        </div>
      ) : null}

      <button
        className="rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSubmit || pending}
        type="submit"
      >
        {pending ? 'Configuration en cours…' : 'Configurer Vercel + redeploy'}
      </button>

      {result ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            result.ok
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
              : 'border-red-500/40 bg-red-500/10 text-red-100'
          }`}
        >
          {result.ok ? (
            <div className="space-y-2">
              <p>Variables appliquées : {result.applied?.join(', ')}</p>
              <p>{result.hint}</p>
              {result.healthUrl ? (
                <p>
                  <a className="underline" href={result.healthUrl}>
                    Vérifier /payload-health
                  </a>
                </p>
              ) : null}
            </div>
          ) : (
            <p>{result.error || 'Échec'}</p>
          )}
        </div>
      ) : null}
    </form>
  )
}
