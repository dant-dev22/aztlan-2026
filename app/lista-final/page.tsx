'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import { useUsers } from '@/app/hooks/useUsers'
import { agruparListaFinal } from '@/app/lib/listaFinal'

/** Estilos de encabezado que rotan: grises y neutros distintos por bloque */
const ENCABEZADO_CATEGORIA_CLASSES = [
  'bg-light-ash border-l-4 border-charcoal-ink/30',
  'bg-warm-white border-l-4 border-steel-gray',
  'bg-[#DCDCD8] border-l-4 border-graphite/35',
  'bg-silver-fog/50 border-l-4 border-secondary-text/50',
  'bg-[#E4E4E0] border-l-4 border-charcoal-ink/25',
  'bg-light-ash/90 border-l-4 border-muted-text',
] as const

export default function ListaFinalPage() {
  const { usuarios, loading, error, cargarUsuarios } = useUsers()

  const grupos = useMemo(() => {
    const aprobados = usuarios.filter((u) => u.comprobanteAprobado)
    return agruparListaFinal(aprobados)
  }, [usuarios])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Lista final</h1>
              <p className="text-secondary-text mt-1">
                Participantes con pago aprobado, por categoría y cinta
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border-2 border-primary-text/20 text-primary-text hover:bg-light-ash/30 transition-colors shrink-0 text-center"
            >
              Volver al inicio
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">
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

          {loading ? (
            <p className="text-secondary-text py-8">Cargando lista...</p>
          ) : grupos.length === 0 ? (
            <p className="text-secondary-text py-8">
              No hay participantes con pago aprobado por el momento.
            </p>
          ) : (
            <div className="space-y-10">
              {grupos.map((grupo, groupIndex) => {
                const headerClass =
                  ENCABEZADO_CATEGORIA_CLASSES[groupIndex % ENCABEZADO_CATEGORIA_CLASSES.length]
                return (
                  <section
                    key={grupo.titulo}
                    className="border-b-2 border-primary-text/10 pb-10 last:border-0 last:pb-0"
                  >
                    <h2
                      className={`text-lg sm:text-xl font-semibold text-primary-text mb-4 rounded-r-lg py-3 px-4 shadow-sm ${headerClass}`}
                    >
                      {grupo.titulo}
                    </h2>
                    <ul className="space-y-2.5 text-primary-text list-none">
                      {grupo.participantes.map((p, i) => {
                        const academia = p.equipo?.trim() || '—'
                        return (
                          <li
                            key={p.id}
                            className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-primary-text"
                          >
                            <span className="inline-flex min-w-[1.75rem] shrink-0 justify-end tabular-nums text-secondary-text font-semibold text-sm sm:text-base">
                              {i + 1}
                            </span>
                            <span className="font-medium">{p.nombreCompleto}</span>
                            <span className="text-muted-text" aria-hidden>
                              ·
                            </span>
                            <span className="text-secondary-text font-normal">{academia}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
