'use client'

import { useMemo, useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useUsers } from '../hooks/useUsers'
import { buildListaFinal, type CategoriaListaFinal } from '../lib/listaFinal'

const ESTILOS_CATEGORIAS: {
  header: string
  badge: string
}[] = [
  {
    header: 'bg-light-ash text-charcoal-ink',
    badge: 'bg-charcoal-ink/8 border-charcoal-ink/15 text-charcoal-ink/80',
  },
  {
    header: 'bg-light-ash text-charcoal-ink',
    badge: 'bg-charcoal-ink/8 border-charcoal-ink/15 text-charcoal-ink/80',
  },
  {
    header: 'bg-light-ash text-charcoal-ink',
    badge: 'bg-charcoal-ink/8 border-charcoal-ink/15 text-charcoal-ink/80',
  },
  {
    header: 'bg-light-ash text-charcoal-ink',
    badge: 'bg-charcoal-ink/8 border-charcoal-ink/15 text-charcoal-ink/80',
  },
  {
    header: 'bg-light-ash text-charcoal-ink',
    badge: 'bg-charcoal-ink/8 border-charcoal-ink/15 text-charcoal-ink/80',
  },
  {
    header: 'bg-light-ash text-charcoal-ink',
    badge: 'bg-charcoal-ink/8 border-charcoal-ink/15 text-charcoal-ink/80',
  },
]

function formatearCinta(cinta?: string): string {
  if (!cinta) return ''
  return cinta.charAt(0).toUpperCase() + cinta.slice(1).replace(/-/g, ' ')
}

export default function ListaFinalPage() {
  const { usuarios, loading, error, cargarUsuarios } = useUsers()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const categorias: CategoriaListaFinal[] = useMemo(
    () => (isClient ? buildListaFinal(usuarios) : []),
    [usuarios, isClient]
  )

  const totalParticipantes = useMemo(
    () => categorias.reduce((sum, cat) => sum + cat.participantes.length, 0),
    [categorias]
  )

  return (
    <div className="page-shell min-h-screen flex flex-col bg-warm-white/95">
      <Header showBackButton backHref="/" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[28px] bg-charcoal-ink px-6 py-8 text-soft-white mb-8 sm:px-10 sm:py-10">
            <p className="section-kicker mb-4 border-white/10 bg-white/10 text-blue-mist">
              Aztlán 2026
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Lista final de participantes
            </h1>
            <p className="mt-3 text-white/72 text-base sm:text-lg leading-relaxed">
              Participantes con comprobante de pago aprobado, agrupados por categoría.
            </p>
            {isClient && !loading && categorias.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                  <span className="text-sm text-white/72">Categorías</span>
                  <span className="text-lg font-black text-soft-white">{categorias.length}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                  <span className="text-sm text-white/72">Participantes</span>
                  <span className="text-lg font-black text-soft-white">{totalParticipantes}</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
              <p>{error}</p>
              <button
                type="button"
                onClick={cargarUsuarios}
                className="mt-2 text-sm font-medium underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isClient || loading ? (
            <div className="surface-panel px-6 py-10 text-center">
              <p className="text-secondary-text text-base">Cargando lista...</p>
            </div>
          ) : categorias.length === 0 ? (
            <div className="surface-panel px-6 py-12 text-center">
              <p className="text-lg font-semibold text-primary-text mb-2">
                No hay participantes con pago aprobado por el momento.
              </p>
              <p className="text-secondary-text text-sm">
                Vuelve a consultar más tarde, cuando los comprobantes hayan sido validados.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {categorias.map((cat, catIdx) => {
                const estilo = ESTILOS_CATEGORIAS[catIdx % ESTILOS_CATEGORIAS.length]
                return (
                  <section
                    key={cat.key}
                    className="surface-panel overflow-hidden"
                    aria-labelledby={`cat-${catIdx}`}
                  >
                    <header
                      className={`${estilo.header} px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between gap-4`}
                    >
                      <h2
                        id={`cat-${catIdx}`}
                        className="text-base sm:text-lg font-black tracking-tight"
                      >
                        {cat.titulo}
                      </h2>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wider ${estilo.badge}`}
                      >
                        {cat.participantes.length}
                      </span>
                    </header>
                    <ol className="divide-y divide-primary-text/8">
                      {cat.participantes.map((p, idx) => (
                        <li
                          key={p.id}
                          className="flex items-center gap-4 px-5 py-3.5 sm:px-7 sm:py-4 transition-colors hover:bg-blue-mist/35"
                        >
                          <span
                            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-text/10 bg-light-ash/45 text-sm font-black text-charcoal-ink sm:h-10 sm:w-10"
                            aria-hidden="true"
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1 flex items-center gap-3">
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm sm:text-base font-bold text-primary-text truncate">
                                {p.nombreCompleto}
                              </span>
                              <span className="block text-xs sm:text-sm text-secondary-text truncate mt-0.5">
                                {p.equipo || 'Sin academia'}
                              </span>
                            </span>
                            {p.cinta && (
                              <span className="shrink-0 inline-flex items-center rounded-full border border-primary-text/10 bg-light-ash/35 px-3 py-1 text-xs font-semibold text-secondary-text">
                                {formatearCinta(p.cinta)}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
