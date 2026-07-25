import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalList, LegalPageShell, LegalSection } from '@/components/legal/LegalPageShell'
import { ContactLink } from '@/components/ui/ContactLink'
import { getSeoDefaultsContent, getSiteSettingsContent } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo-metadata'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

const PRIVACY_LAST_UPDATED = '24 juillet 2026'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettingsContent(), getSeoDefaultsContent()])
  const siteName = settings?.siteName || 'Portfolio'

  return buildPageMetadata(seo, settings, {
    title: 'Politique de confidentialité',
    description: `Politique de confidentialité du site ${siteName} — données collectées, mesure d’audience Vercel, formulaire de contact et droits RGPD.`,
    path: '/confidentialite',
  })
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettingsContent()
  const siteName = settings?.siteName || 'Portfolio'
  const email = settings?.email
  const siteUrl = getSiteUrl()

  return (
    <LegalPageShell
      eyebrow="Protection des données"
      icon="privacy"
      subtitle={`Comment ${siteName} traite vos données lors de la visite du site, de la mesure d’audience et de l’utilisation du formulaire de contact.`}
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
          <p className="flex flex-wrap items-center gap-2">
            <span>Pour toute question relative à vos données :</span>
            <ContactLink size="sm" type="email" value={email} />
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="Périmètre — situation actuelle du site">
        <p>Ce site est un portfolio professionnel. À la date de la dernière mise à jour de cette page :</p>
        <LegalList
          items={[
            'Aucun cookie publicitaire ni traceur marketing tiers (Meta Pixel, Google Ads, etc.).',
            'Aucune inscription ou création de compte côté visiteur.',
            'Mesure d’audience et performance activées via Vercel Web Analytics et Vercel Speed Insights (voir ci-dessous).',
            'Formulaire de contact optionnel : les données saisies sont conservées pour répondre à votre message.',
            'Backoffice CMS Payload réservé à l’administrateur du site (accès authentifié).',
          ]}
        />
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>Selon votre utilisation du site, les données suivantes peuvent être traitées :</p>
        <LegalList
          items={[
            'Données de navigation techniques : adresse IP (souvent tronquée ou agrégée côté hébergeur), user-agent, horodatage, pages consultées, journaux serveur Vercel.',
            'Mesure d’audience (Vercel Web Analytics) : pages vues, chemins visités, provenance (referrer), type d’appareil, navigateur, pays — de manière agrégée et anonymisée, sans profilage publicitaire.',
            'Mesure de performance (Vercel Speed Insights) : indicateurs Core Web Vitals (ex. LCP, INP, CLS), type d’appareil et route consultée, afin d’améliorer la vitesse perçue du site.',
            'Formulaire de contact : nom, adresse e-mail et contenu du message.',
            'Administration (backoffice CMS uniquement) : identifiants de connexion, cookies de session Payload et, le cas échéant, cookie d’appareil de confiance (`portfolio-admin-device`) — réservés aux administrateurs autorisés.',
          ]}
        />
        <p className="text-sm text-[var(--muted)]">
          Aucun événement personnalisé (custom events) n’est envoyé à Vercel Analytics sur le site public à ce jour.
        </p>
      </LegalSection>

      <LegalSection title="Mesure d’audience et performance (Vercel)">
        <p>
          Le site intègre les composants <strong className="text-[var(--foreground)]">Vercel Web Analytics</strong> et{' '}
          <strong className="text-[var(--foreground)]">Vercel Speed Insights</strong> dans son layout global. Ils sont
          activés sur l’ensemble des pages publiques.
        </p>
        <p>Ces outils servent exclusivement à :</p>
        <LegalList
          items={[
            'Comprendre le volume de visites et les pages les plus consultées.',
            'Identifier les parcours d’entrée (referrers) et la répartition géographique agrégée.',
            'Surveiller la performance réelle (Core Web Vitals) et corriger les régressions techniques.',
          ]}
        />
        <p>
          Vercel Web Analytics est conçu pour fonctionner sans cookies de suivi publicitaire et sans revente de
          données à des annonceurs. Les scripts sont chargés depuis l’infrastructure Vercel (`/_vercel/insights/` et
          `/_vercel/speed-insights/`). Pour plus de détail :{' '}
          <a
            className="text-link"
            href="https://vercel.com/docs/analytics"
            rel="noopener noreferrer"
            target="_blank"
          >
            documentation Vercel Analytics
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Finalités et bases légales">
        <LegalList
          items={[
            'Répondre aux demandes envoyées via le formulaire de contact (exécution de mesures précontractuelles / intérêt légitime).',
            'Mesurer l’audience et la performance du site afin d’en améliorer le contenu et la technique (intérêt légitime).',
            'Assurer la sécurité, la maintenance et le bon fonctionnement du site (intérêt légitime).',
            'Gérer l’accès au backoffice Payload CMS (intérêt légitime / obligation de sécurité).',
          ]}
        />
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <p>Les données peuvent être traitées par les prestataires techniques suivants, dans la limite de leurs missions :</p>
        <LegalList
          items={[
            'Vercel — hébergement, exécution serverless, CDN, Web Analytics et Speed Insights.',
            'Neon — hébergement de la base de données PostgreSQL (contenu CMS et messages de contact).',
            'Resend — envoi des notifications e-mail liées au formulaire de contact, lorsque configuré.',
            'Vercel Blob — stockage des médias uploadés via le CMS, lorsque configuré.',
          ]}
        />
        <p className="text-sm text-[var(--muted)]">
          Certains sous-traitants peuvent être situés hors Union européenne (ex. États-Unis pour Vercel). Leurs
          transferts s’appuient sur les garanties contractuelles et mécanismes prévus par la réglementation applicable
          (clauses types, certifications, etc.).
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <LegalList
          items={[
            'Messages de contact : conservés le temps nécessaire au traitement de la demande, puis archivés ou supprimés selon les obligations légales applicables.',
            'Données d’audience et de performance Vercel : conservées selon la politique de rétention de Vercel, généralement sous forme agrégée.',
            'Journaux techniques serveur : durée limitée, conformément aux pratiques d’hébergement.',
            'Sessions administrateur Payload : environ 4 heures ; appareil de confiance admin : jusqu’à 90 jours, révocable à tout moment depuis le backoffice.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Cookies et traceurs">
        <p>
          Le site public <strong className="text-[var(--foreground)]">n’utilise pas de cookies publicitaires</strong>{' '}
          et ne dépose pas de bandeau cookies marketing tiers.
        </p>
        <p>Les traceurs ou cookies suivants peuvent toutefois intervenir :</p>
        <LegalList
          items={[
            'Vercel Web Analytics et Speed Insights — scripts de mesure d’audience/performance, sans finalité publicitaire (voir section dédiée ci-dessus).',
            'Session Payload CMS (`payload-token` ou équivalent) — uniquement lors d’une connexion administrateur au backoffice.',
            'Appareil de confiance admin (`portfolio-admin-device`) — uniquement si un administrateur enregistre explicitement son navigateur.',
          ]}
        />
        <p>
          Vous pouvez configurer votre navigateur pour bloquer les scripts ou cookies ; cela n’empêche généralement pas
          la consultation du site public, mais peut limiter la mesure d’audience côté éditeur et désactiver l’accès
          admin.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au Règlement général sur la protection des données (RGPD), vous disposez des droits d’accès, de
          rectification, d’effacement, de limitation, d’opposition et de portabilité, lorsque applicable.
        </p>
        <p>
          Vous pouvez vous opposer au traitement fondé sur l’intérêt légitime (notamment la mesure d’audience), sous
          réserve des obligations légales du responsable du traitement.
        </p>
        <p>
          Pour exercer vos droits, contactez le responsable du traitement
          {email ? (
            <>
              {' '}
              à <ContactLink className="align-middle" size="sm" type="email" value={email} />
            </>
          ) : null}
          . Vous pouvez également introduire une réclamation auprès de la CNIL (
          <a
            className="text-link"
            href="https://www.cnil.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Des mesures techniques et organisationnelles raisonnables sont mises en œuvre (HTTPS, secrets d’environnement,
          accès admin authentifié avec mot de passe, appareils de confiance optionnels, limitation de débit sur les
          routes sensibles) afin de protéger vos données contre l’accès non autorisé.
        </p>
      </LegalSection>

      <LegalSection title="Mises à jour">
        <p>
          La présente politique peut être modifiée pour refléter l’évolution du site, des outils de mesure ou de la
          réglementation. Dernière mise à jour : {PRIVACY_LAST_UPDATED}.
        </p>
        <p className="text-sm text-[var(--muted)]">
          Voir aussi les{' '}
          <Link className="text-link" href="/mentions-legales">
            mentions légales
          </Link>{' '}
          · {siteUrl}
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
