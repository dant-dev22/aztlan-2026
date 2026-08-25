'use client'

import Link from 'next/link'
import AppLogo from './AppLogo'

interface NavLink {
  href: string
  label: string
}

interface HeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  /** Centrar contenido cuando no hay botón volver ni navLinks */
  centered?: boolean
  /** Links de navegación que aparecen a la derecha */
  navLinks?: NavLink[]
}

export default function Header({
  title = 'Aztlan 2026',
  subtitle,
  showBackButton = false,
  backHref = '/',
  centered = true,
  navLinks,
}: HeaderProps) {
  const hasRightSlot = showBackButton || (navLinks && navLinks.length > 0)

  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-charcoal-ink text-soft-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,109,246,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,122,26,0.18),transparent_26%)]" aria-hidden />
      <div
        className={`relative max-w-7xl mx-auto flex items-center gap-4 px-4 py-6 sm:px-6 lg:px-8 ${
          hasRightSlot ? 'justify-between' : centered ? 'justify-center' : 'justify-start'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/70 bg-warm-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
            <AppLogo size={108} priority className="flex-shrink-0" />
          </div>
          <div>
            <p className="section-kicker mb-2 border-white/10 bg-white/10 text-blue-mist">
              Aztlan BJJ 2026
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm sm:text-base text-white/70">{subtitle}</p>}
          </div>
        </div>
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm sm:text-base text-white/80 transition duration-300 hover:border-white/20 hover:bg-white/10 hover:text-soft-white"
          >
            ← Volver
          </Link>
        )}
        {!showBackButton && navLinks && navLinks.length > 0 && (
          <nav className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:gap-3" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm sm:text-base text-white/80 transition duration-300 hover:border-white/20 hover:bg-white/10 hover:text-soft-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
