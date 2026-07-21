import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EditorialTitle } from '@/components/ui/EditorialTitle'

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="font-[family-name:var(--font-space-grotesk)] text-sm tracking-[0.28em] text-[var(--accent-soft)] uppercase">
        Erreur 404
      </p>
      <EditorialTitle as="h1" text="Page introuvable" />
      <p className="max-w-md text-[var(--muted)]">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/">Retour à l’accueil</Button>
        <Button href="/projets" variant="glass">
          Voir les projets
        </Button>
      </div>
    </Container>
  )
}
