import Link from 'next/link'

import './(frontend)/styles.css'

/**
 * 404 racine pour les URLs qui ne correspondent à aucun segment.
 * Auto-portée (html/body) car les route groups n'exposent pas de root layout partagé.
 * Les `notFound()` internes à (frontend) utilisent `(frontend)/not-found.tsx`.
 */
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body>
        <main
          className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24 text-center"
          id="main"
        >
          <p className="text-sm tracking-[0.28em] text-[var(--accent-soft)] uppercase">Erreur 404</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Page introuvable</h1>
          <p className="max-w-md text-[var(--muted)]">
            La page que vous cherchez n’existe pas ou a été déplacée.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
              href="/"
            >
              Retour à l’accueil
            </Link>
            <Link
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5"
              href="/projets"
            >
              Voir les projets
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
