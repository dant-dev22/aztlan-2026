'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import { useUsers, type UsuarioCompleto } from '@/app/hooks/useUsers'

const TIPO_REGISTRO_ORDER: Record<string, number> = { juvenil: 0, adultos: 1, masters: 2 }

const EDAD_ORDER: Record<string, number> = {
  'infantil-1': 0,
  'infantil-2': 1,
  adolescentes: 2,
  juveniles: 3,
}

const EDAD_LABELS: Record<string, string> = {
  'infantil-1': 'Infantil 1 (6-9 años)',
  'infantil-2': 'Infantil 2 (10-12 años)',
  adolescentes: 'Adolescentes (13-14 años)',
  juveniles: 'Juveniles (15-17 años)',
}

const NIVEL_ORDER: Record<string, number> = {
  principiante: 0,
  intermedio: 1,
  avanzado: 2,
}

const CINTA_ORDER_ADULTOS = ['blanca', 'azul', 'morada', 'cafe', 'negra']
const CINTA_ORDER_JUVENIL = ['blanca', 'gris', 'amarilla', 'naranja', 'verde', 'azul', 'morada']

function pesoSortValue(peso: string | undefined): number {
  if (!peso) return 0
  const t = peso.trim()
  if (t.startsWith('+')) {
    return 1000 + parseInt(t.slice(1), 10)
  }
  const n = parseInt(t, 10)
  return Number.isNaN(n) ? 0 : n
}

function nivelOrder(nivel: string | undefined): number {
  if (!nivel) return 99
  return NIVEL_ORDER[nivel.toLowerCase()] ?? 99
}

function cintaOrderIndex(u: UsuarioCompleto): number {
  const raw = (u.cinta || '').toLowerCase().trim()
  const order = u.tipoRegistro === 'juvenil' ? CINTA_ORDER_JUVENIL : CINTA_ORDER_ADULTOS
  const idx = order.indexOf(raw)
  return idx === -1 ? 999 : idx
}

/** Encabezado de categoría para agrupar y mostrar */
function etiquetaCategoria(u: UsuarioCompleto): string {
  if (u.tipoRegistro === 'juvenil') {
    const edad = u.categoriaEdad ? EDAD_LABELS[u.categoriaEdad] ?? u.categoriaEdad : ''
    const peso = u.categoriaPeso ? `${u.categoriaPeso} kg` : ''
    const nivel = u.nivelExperiencia?.toLowerCase() ?? ''
    return [edad, peso, nivel].filter(Boolean).join(' · ')
  }
  const peso = u.categoriaPeso ? `${u.categoriaPeso}kg` : ''
  const tipo = u.categoriaPesoTipo ?? ''
  const nivel = u.nivelExperiencia?.toLowerCase() ?? ''
  return [peso, tipo, nivel].filter(Boolean).join(' ')
}

function claveOrdenCategoria(a: UsuarioCompleto): number[] {
  const tipo = TIPO_REGISTRO_ORDER[a.tipoRegistro] ?? 9
  if (a.tipoRegistro === 'juvenil') {
    const edad = EDAD_ORDER[a.categoriaEdad ?? ''] ?? 99
    const peso = pesoSortValue(a.categoriaPeso)
    const nivel = nivelOrder(a.nivelExperiencia)
    return [tipo, edad, peso, nivel]
  }
  const peso = pesoSortValue(a.categoriaPeso)
  const division = a.categoriaPesoTipo === 'femenil' ? 1 : 0
  const nivel = nivelOrder(a.nivelExperiencia)
  return [tipo, peso, division, nivel]
}

function compararTuplas(x: number[], y: number[]): number {
  const len = Math.max(x.length, y.length)
  for (let i = 0; i < len; i++) {
    const vx = x[i] ?? 0
    const vy = y[i] ?? 0
    if (vx !== vy) return vx - vy
  }
  return 0
}

function compararParticipantes(a: UsuarioCompleto, b: UsuarioCompleto): number {
  const cat = compararTuplas(claveOrdenCategoria(a), claveOrdenCategoria(b))
  if (cat !== 0) return cat
  const cinta = cintaOrderIndex(a) - cintaOrderIndex(b)
  if (cinta !== 0) return cinta
  return (a.nombreCompleto || '').localeCompare(b.nombreCompleto || '', 'es', {
    sensitivity: 'base',
  })
}

type GrupoCategoria = {
  titulo: string
  participantes: UsuarioCompleto[]
}

export default function ListaFinalPage() {
  const { usuarios, loading, error, cargarUsuarios } = useUsers()

  const grupos = useMemo(() => {
    const aprobados = usuarios.filter((u) => u.comprobanteAprobado)
    aprobados.sort(compararParticipantes)

    const mapa = new Map<string, UsuarioCompleto[]>()
    for (const u of aprobados) {
      const titulo = etiquetaCategoria(u) || 'Sin categoría'
      if (!mapa.has(titulo)) mapa.set(titulo, [])
      mapa.get(titulo)!.push(u)
    }

    const titulosOrdenados = Array.from(mapa.keys()).sort((ta, tb) => {
      const ua = mapa.get(ta)![0]
      const ub = mapa.get(tb)![0]
      return compararParticipantes(ua, ub)
    })

    return titulosOrdenados.map((titulo) => ({
      titulo,
      participantes: mapa.get(titulo)!,
    })) as GrupoCategoria[]
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
              {grupos.map((grupo) => (
                <section key={grupo.titulo} className="border-b-2 border-primary-text/10 pb-10 last:border-0 last:pb-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-charcoal-ink mb-4">
                    {grupo.titulo}
                  </h2>
                  <ul className="space-y-2 text-primary-text list-none">
                    {grupo.participantes.map((p) => (
                      <li key={p.id} className="font-medium">
                        {p.nombreCompleto}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
