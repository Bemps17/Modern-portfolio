import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalList, LegalPageShell, LegalSection } from '@/components/legal/LegalPageShell'
import { getSiteSettingsContent } from '@/lib/content'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent()
  const siteName = settings?.siteName || 'Portfolio'

  return {
    title: 'Politique de confidentialité',
    description: `Politique de confidentialité du site ${siteName} — données collectées, finalités et droits RGPD.`,
    alternates: { canonical: `${getSiteUrl()}/confidentialite` },
    robots: { index: true, follow: true },
  }
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettingsContent()
  const siteName = settings?.siteName || 'Portfolio'
  const email = settings?.email
  const siteUrl = getSiteUrl()

  return (
    <LegalPageShell
      eyebrow="Protection des données"
      subtitle={`Comment ${siteName} traite vos données personnelles lors de la visite du site et de l’utilisation du formulaire de contact.`}
      title="Politique de confidentialité"
    >
      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement est <strong className="text-[var(--foreground)]">{siteName}</strong>
          {settings?.location ? (
            <>
              {' '}
              ({settings.location})
            </>
          ) : null}
          .
        </p>
        {email ? (
          <p>
            Pour toute question relative à vos données :{' '}
            <Link className="text-[var(--accent-soft)] underline-offset-2 hover:underline" href={`mailto:${email}`}>
              {email}
            </Link>
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>Selon votre utilisation du site, les données suivantes peuvent être traitées :</p>
        <LegalList
          items={[
            'Données de navigation techniques : adresse IP, user-agent, horodatage, pages consultées (journaux serveur).',
            'Données transmises via le formulaire de contact : nom, adresse e-mail, message.',
            'Données d’administration (backoffice CMS) : identifiants de connexion, cookies de session et, le cas échéant, appareils de confiance enregistrés — réservés aux administrateurs autorisés.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Finalités et bases légales">
        <LegalList
          items={[
            'Répondre aux demandes envoyées via le formulaire de contact (exécution de mesures précontractuelles / intérêt légitime).',
            'Assurer la sécurité, la maintenance et le bon fonctionnement du site (intérêt légitime).',
            'Gérer l’accès au backoffice Payload CMS (intérêt légitime / obligation de sécurité).',
          ]}
        />
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <p>Les données peuvent être traitées par les prestataires techniques suivants, dans la limite de leurs missions :</p>
        <LegalList
          items={[
            'Vercel — hébergement, exécution serverless, analytics techniques.',
            'Neon — hébergement de la base de données PostgreSQL (contenu CMS et messages de contact).',
            'Resend — envoi des notifications e-mail liées au formulaire de contact, lorsque configuré.',
            'Vercel Blob — stockage des médias uploadés via le CMS, lorsque configuré.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <LegalList
          items={[
            'Messages de contact : conservés le temps nécessaire au traitement de la demande, puis archivés ou supprimés selon les obligations légales applicables.',
            'Journaux techniques : durée limitée, conformément aux pratiques d’hébergement.',
            'Sessions administrateur : durée courte (environ 4 heures) ; appareils de confiance : jusqu’à 90 jours, révocables à tout moment depuis le backoffice.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Cookies et traceurs">
        <p>
          Le site public n’utilise pas de cookies publicitaires. Des cookies strictement nécessaires peuvent être déposés
          pour :
        </p>
        <LegalList
          items={[
            'Maintenir une session d’administration Payload CMS (accès réservé).',
            'Mémoriser un appareil de confiance pour l’accès admin, uniquement après enregistrement explicite par un administrateur.',
          ]}
        />
        <p>
          Vous pouvez configurer votre navigateur pour refuser les cookies ; certaines fonctionnalités d’administration
          pourraient alors ne plus fonctionner.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au Règlement général sur la protection des données (RGPD), vous disposez des droits d’accès, de
          rectification, d’effacement, de limitation, d’opposition et de portabilité, lorsque applicable.
        </p>
        <p>
          Pour exercer vos droits, contactez le responsable du traitement
          {email ? (
            <>
              {' '}
              à{' '}
              <Link className="text-[var(--accent-soft)] underline-offset-2 hover:underline" href={`mailto:${email}`}>
                {email}
              </Link>
            </>
          ) : null}
          . Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Des mesures techniques et organisationnelles raisonnables sont mises en œuvre (HTTPS, secrets d’environnement,
          accès admin authentifié, limitation de débit sur les routes sensibles) afin de protéger vos données contre
          l’accès non autorisé.
        </p>
      </LegalSection>

      <LegalSection title="Mises à jour">
        <p>
          La présente politique peut être modifiée pour refléter l’évolution du site ou de la réglementation. Date de
          dernière mise à jour : {new Date().getFullYear()}.
        </p>
        <p className="text-sm text-[var(--muted)]">
          Voir aussi les{' '}
          <Link className="text-[var(--accent-soft)] underline-offset-2 hover:underline" href="/mentions-legales">
            mentions légales
          </Link>{' '}
          · {siteUrl}
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
