import Link from 'next/link'

interface RegistroCerradoProps {
  /** En la portada usa más aire; en subrutas de registro un poco más compacto */
  variant?: 'home' | 'page'
}

export default function RegistroCerrado({ variant = 'home' }: RegistroCerradoProps) {
  const padding = variant === 'home' ? 'py-10 sm:py-14' : 'py-8 sm:py-10'

  return (
    <section
      className={`animate-fade-in ${padding}`}
      aria-labelledby="registro-cerrado-titulo"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-warm-white rounded-2xl shadow-lg border border-primary-text/10 p-6 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-light-ash text-primary-text mb-6" aria-hidden>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2
            id="registro-cerrado-titulo"
            className="text-2xl sm:text-3xl font-bold text-primary-text mb-4"
          >
            El registro para Aztlán 2026 se ha cerrado
          </h2>
          <p className="text-base sm:text-lg text-secondary-text leading-relaxed mb-8">
            Gracias por tu participación. Puedes consultar la lista final de participantes en el
            enlace de abajo. Para novedades y comunicados oficiales, sigue las redes del torneo.
          </p>
          <div className="flex justify-center mb-8">
            <Link
              href="/lista-final"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-charcoal-ink text-soft-white font-medium hover:bg-graphite transition-colors duration-300"
            >
              Ver lista final de participantes
            </Link>
          </div>
          <div className="pt-6 border-t border-primary-text/10">
            <p className="text-sm text-muted-text mb-4">Redes oficiales del torneo</p>
            <nav className="flex items-center justify-center gap-6" aria-label="Redes sociales de Aztlán">
              <a
                href="https://www.instagram.com/aztlan_bjj?igsh=MTNrMHMzMno5ZTgwdg=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-text hover:text-charcoal-ink transition-colors duration-300"
                aria-label="Instagram de Aztlán"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1KTzf6PiTf/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-text hover:text-charcoal-ink transition-colors duration-300"
                aria-label="Facebook de Aztlán"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
