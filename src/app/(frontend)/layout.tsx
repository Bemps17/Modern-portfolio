import { Syne, DM_Sans, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { Footer } from '@/components/layout/Footer'
import { MaintenanceBanner } from '@/components/layout/MaintenanceBanner'
import { Sidebar } from '@/components/layout/Sidebar'
import { CommandPalette } from '@/components/motion/CommandPalette'
import { FunEffects } from '@/components/motion/FunEffects'
import { getAdminHref, getAdminLinkTitle, isAdminLinkVisible } from '@/lib/admin-test-access'
import { getPublishedProjects, getSiteSettingsContent } from '@/lib/content'
import { resolveMediaUrl } from '@/lib/media'
import { isPayloadConfigured } from '@/lib/payload-env'
import { SITE_IMAGES } from '@/lib/site-images'
import { getSiteUrl } from '@/lib/site-url'

import './styles.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getSiteUrl()),
    icons: {
      icon: [
        { url: SITE_IMAGES.favicon, type: 'image/svg+xml' },
        { url: SITE_IMAGES.faviconPng, type: 'image/png', sizes: '512x512' },
      ],
      apple: SITE_IMAGES.appleIcon,
    },
  }
}

function resolveThemeColor(settings: Awaited<ReturnType<typeof getSiteSettingsContent>>): string {
  const color = settings?.themeColor?.trim()
  if (color && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) return color
  return '#0a0a0a'
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSiteSettingsContent()
  return {
    themeColor: resolveThemeColor(settings),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, projects] = await Promise.all([getSiteSettingsContent(), getPublishedProjects()])
  const siteName = settings?.siteName || 'Portfolio'
  const email = settings?.email || null
  const socialLinks = settings?.socialLinks || []
  const logoUrl =
    resolveMediaUrl('logo' in settings ? settings.logo : null) || SITE_IMAGES.brandLogo
  const paletteProjects = projects.map((project) => ({ title: project.title, slug: project.slug }))
  const showAdminLink = isAdminLinkVisible()
  const adminHref = getAdminHref()
  const adminLinkTitle = getAdminLinkTitle()
  const adminConfigured = isPayloadConfigured()
  const footerExtraLine = settings?.footerExtraLine?.trim() || null
  const showMaintenance = Boolean(settings?.maintenanceMode)
  const journalNavLabel = settings?.journalNavLabel ?? 'Carnet'

  return (
    <html className={`${syne.variable} ${dmSans.variable} ${spaceGrotesk.variable}`} lang="fr">
      <body>
        <a
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-[var(--accent)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-black"
          href="#main"
        >
          Aller au contenu
        </a>
        <FunEffects />
        <CommandPalette projects={paletteProjects} />
        {showMaintenance ? (
          <MaintenanceBanner message={settings?.maintenanceMessage} />
        ) : null}
        <Sidebar
          journalNavLabel={journalNavLabel}
          logoUrl={logoUrl}
          siteName={siteName}
          socialLinks={socialLinks}
        />
        <div className="relative z-10 min-h-screen lg:pl-[72px]">
          <main className="min-h-screen pb-20 lg:pb-0" id="main">
            {children}
          </main>
          <Footer
            adminConfigured={adminConfigured}
            adminHref={adminHref}
            adminLinkTitle={adminLinkTitle}
            email={email}
            footerExtraLine={footerExtraLine}
            phone={settings?.phone}
            showAdminLink={showAdminLink}
            siteName={siteName}
          />
        </div>
        <BottomTabBar journalNavLabel={journalNavLabel} />
        <Toaster position="bottom-center" theme="dark" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
