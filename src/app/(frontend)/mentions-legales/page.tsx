import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalList, LegalPageShell, LegalSection } from '@/components/legal/LegalPageShell'
import { getSiteSettingsContent } from '@/lib/content'
import { getSiteUrl } from '@/lib/site-url'
import { SITE_VERSION } from '@/lib/site-version'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent()
  const siteName = settings?.siteName || 'Portfolio'

  return {
    title: 'Mentions légales',
    description: `Mentions légales du site ${siteName} — éditeur, hébergement et propriété intellectuelle.`,
    alternates: { canonical: `${getSiteUrl()}/mentions-legales` },
    robots: { index: true, follow: true },
  }
}

export default async function LegalNoticePage() {
  const settings = await getSiteSettingsContent()
  const siteName = settings?.siteName || 'Portfolio'
  const email = settings?.email
  const phone = settings?.phone
  const location = settings?.location
  const siteUrl = getSiteUrl()

  return (
    <LegalPageShell
      eyebrow="Informations légales"
      subtitle={`Document relatif au site ${siteName}, conformément aux obligations d’information en ligne.`}
      title="Mentions légales"
      footer={
        <p className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-wider text-[var(--muted-subtle)] tabular-nums uppercase">
          Version du site · v{SITE_VERSION}
        </p>
      }
    >
      <LegalSection title="Éditeur du site">
        <p>
          Le présent site est édité par <strong className="text-[var(--foreground)]">{siteName}</strong>
          {location ? (
            <>
              , domicilié à <strong className="text-[var(--foreground)]">{location}</strong>
            </>
          ) : null}
          .
        </p>
        {email ? (
          <p>
            Contact :{' '}
            <Link className="text-[var(--accent-soft)] underline-offset-2 hover:underline" href={`mailto:${email}`}>
              {email}
            </Link>
            {phone ? <> · {phone}</> : null}
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="Directeur de la publication">
        <p>
          Le directeur de la publication est <strong className="text-[var(--foreground)]">{siteName}</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>Ce site est hébergé par :</p>
        <LegalList
          items={[
            'Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com',
            'Neon (base de données PostgreSQL) — neon.tech',
          ]}
        />
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L’ensemble des éléments composant ce site (textes, visuels, charte graphique, code, structure) est protégé
          par le droit de la propriété intellectuelle, sauf mention contraire explicite.
        </p>
        <p>
          Toute reproduction, représentation ou exploitation non autorisée, totale ou partielle, est interdite sans
          accord préalable écrit de l’éditeur.
        </p>
      </LegalSection>

      <LegalSection title="Crédits et stack technique">
        <p>Site réalisé avec une stack moderne orientée performance et maintenabilité :</p>
        <LegalList
          items={[
            'Next.js (App Router) · React · TypeScript',
            'Payload CMS · PostgreSQL (Neon)',
            'Hébergement et déploiement : Vercel',
          ]}
        />
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Les modalités de collecte et de traitement des données personnelles sont décrites dans la{' '}
          <Link className="text-[var(--accent-soft)] underline-offset-2 hover:underline" href="/confidentialite">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Limitation de responsabilité">
        <p>
          L’éditeur s’efforce d’assurer l’exactitude des informations publiées, sans garantir l’absence d’erreurs ou
          d’interruptions de service. L’utilisation du site se fait sous la responsabilité de l’utilisateur.
        </p>
      </LegalSection>

      <LegalSection title="Liens hypertextes">
        <p>
          Le site peut contenir des liens vers des sites tiers. L’éditeur n’exerce aucun contrôle sur leur contenu et
          décline toute responsabilité quant à leur utilisation.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes mentions sont régies par le droit français. En cas de litige, et à défaut de résolution amiable,
          les tribunaux compétents seront saisis conformément aux règles de droit commun.
        </p>
        <p className="text-sm text-[var(--muted)]">
          URL du site :{' '}
          <Link className="text-[var(--accent-soft)] underline-offset-2 hover:underline" href={siteUrl}>
            {siteUrl}
          </Link>
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
