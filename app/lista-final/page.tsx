'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import { useUsers } from '@/app/hooks/useUsers'
import { agruparListaFinal } from '@/app/lib/listaFinal'

const ENCABEZADO_CATEGORIA_CLASSES = [
  'bg-blue-mist border-l-4 border-steel-gray',
  'bg-signal-orange-soft border-l-4 border-signal-orange',
  'bg-light-ash border-l-4 border-electric-blue/50',
  'bg-[#F2F4F7] border-l-4 border-secondary-text/40',
  'bg-[#EFF3FF] border-l-4 border-steel-gray/55',
  'bg-[#FFF4EC] border-l-4 border-signal-orange/45',
] as const

export default function ListaFinalPage() {
  const { usuarios, loading, error, cargarUsuarios } = useUsers()

  const grupos = useMemo(() => {
    const aprobados = usuarios.filter((u) => u.comprobanteAprobado)
    return agruparListaFinal(aprobados)
  }, [usuarios])

  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="surface-panel-dark mb-8 flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="section-kicker mb-3 border-white/10 bg-white/10 text-blue-mist">Resultados confirmados</p>
              <h1 className="text-2xl font-black tracking-tight text-soft-white sm:text-3xl">Lista final</h1>
              <p className="mt-1 text-white/68">
                Participantes con pago aprobado, por categoría y cinta
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center font-medium text-soft-white transition hover:bg-white/10"
            >
              Volver al inicio
            </Link>
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

          {loading ? (
            <div className="surface-panel px-6 py-10">
              <p className="text-secondary-text">Cargando lista...</p>
            </div>
          ) : grupos.length === 0 ? (
            <div className="surface-panel px-6 py-10">
              <p className="text-secondary-text">
                No hay participantes con pago aprobado por el momento.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {grupos.map((grupo, groupIndex) => {
                const headerClass =
                  ENCABEZADO_CATEGORIA_CLASSES[groupIndex % ENCABEZADO_CATEGORIA_CLASSES.length]
                return (
                  <section
                    key={grupo.titulo}
                    className="surface-panel border border-primary-text/8 p-6 pb-8 last:pb-8 sm:p-8"
                  >
                    <h2
                      className={`mb-5 rounded-r-2xl py-3 px-4 text-lg font-black tracking-tight text-primary-text shadow-sm sm:text-xl ${headerClass}`}
                    >
                      {grupo.titulo}
                    </h2>
                    <ul className="space-y-2.5 text-primary-text list-none">
                      {grupo.participantes.map((p, i) => {
                        const academia = p.equipo?.trim() || '—'
                        return (
                          <li
                            key={p.id}
                            className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-2xl px-3 py-2 text-primary-text transition hover:bg-light-ash/35"
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
