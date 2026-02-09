'use client'

import Link from 'next/link'
import AppLogo from './AppLogo'

interface HeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  /** Centrar contenido cuando no hay botón volver */
  centered?: boolean
}

export default function Header({
  title = 'Aztlan 2026',
  subtitle,
  showBackButton = false,
  backHref = '/',
  centered = true,
}: HeaderProps) {
  return (
    <header className="bg-light-ash text-primary-text py-6 px-4 sm:px-6 lg:px-8 border-b border-steel-gray/30">
      <div
        className={`max-w-7xl mx-auto flex items-center gap-4 ${
          showBackButton ? 'justify-between' : centered ? 'justify-center' : 'justify-start'
        }`}
      >
        <div className="flex items-center gap-4">
          <AppLogo size={120} priority className="flex-shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm sm:text-base text-secondary-text mt-1">{subtitle}</p>}
          </div>
        </div>
        {showBackButton && (
          <Link
            href={backHref}
            className="text-sm sm:text-base text-primary-text hover:text-charcoal-ink transition-colors duration-300 flex-shrink-0"
          >
            ← Volver
          </Link>
        )}
      </div>
    </header>
  )
}
