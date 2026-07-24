type MaintenanceBannerProps = {
  message?: string | null
}

export function MaintenanceBanner({ message }: MaintenanceBannerProps) {
  const text =
    message?.trim() ||
    'Le site est en cours de maintenance. Certaines fonctionnalités peuvent être temporairement indisponibles.'

  return (
    <div
      className="border-b border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-3 text-center text-sm text-[var(--foreground)]"
      role="status"
    >
      {text}
    </div>
  )
}
