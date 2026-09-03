'use client'

import { useState, useEffect, useMemo } from 'react'
import { getUsuarios, type UsuarioApi } from '@/app/lib/api'

const ADMIN_TOURNAMENT = '2026-b'

const formatearTipoRegistro = (tipo: string) => {
  const tipos: Record<string, string> = {
    juvenil: 'Infantil y Juvenil',
    adultos: 'Adultos',
    masters: 'Masters',
  }
  return tipos[tipo] || tipo
}

const formatearCategoriaEdad = (cat: string) => {
  const categorias: Record<string, string> = {
    'infantil-1': 'Infantil 1 (6-9)',
    'infantil-2': 'Infantil 2 (10-12)',
    adolescentes: 'Adolescentes (13-15)',
    juveniles: 'Juveniles (16-17)',
  }
  return categorias[cat] || cat
}

export default function ListaParticipantes() {
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getUsuarios()
        setUsuarios(data.filter((u) => u.torneo === ADMIN_TOURNAMENT && u.comprobanteAprobado === true))
      } catch (err) {
        console.error('Error al cargar participantes:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const tiposDisponibles = useMemo(() => {
    const tipos = new Set(usuarios.map((u) => u.tipoRegistro))
    return ['todos', ...Array.from(tipos)]
  }, [usuarios])

  const categoriasDisponibles = useMemo(() => {
    const cats = new Set<string>()
    usuarios.forEach((u) => {
      if (u.categoriaEdad) cats.add(u.categoriaEdad)
      if (u.categoriaPeso) cats.add(u.categoriaPeso)
    })
    return ['todos', ...Array.from(cats)]
  }, [usuarios])

  const filtrados = useMemo(() => {
    let lista = usuarios
    if (filtroTipo !== 'todos') {
      lista = lista.filter((u) => u.tipoRegistro === filtroTipo)
    }
    if (filtroCategoria !== 'todos') {
      lista = lista.filter(
        (u) => u.categoriaEdad === filtroCategoria || u.categoriaPeso === filtroCategoria
      )
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim()
      lista = lista.filter(
        (u) =>
          u.nombreCompleto?.toLowerCase().includes(q) ||
          u.equipo?.toLowerCase().includes(q) ||
          u.aztlan_id?.toLowerCase().includes(q)
      )
    }
    return lista.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto))
  }, [usuarios, busqueda, filtroTipo, filtroCategoria])

  return (
    <section id="lista-participantes" className="surface-panel animate-fade-in scroll-mt-6 px-6 py-10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(11,18,32,0.12)] sm:px-8 lg:px-12" aria-labelledby="lista-titulo">
      <div className="mb-8 text-center">
        <p className="section-kicker mb-4">Confirmados</p>
        <h2 id="lista-titulo" className="mb-4 text-3xl font-black tracking-tight text-primary-text sm:text-4xl">
          Lista de participantes
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-secondary-text sm:text-xl">
          Participantes confirmados con pago aprobado. Total: <span className="font-bold text-signal-orange">{filtrados.length}</span>
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="surface-muted relative w-full p-1.5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-steel-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, equipo o ID..."
            className="input-field border-0 bg-transparent pl-10 pr-4 shadow-none focus:ring-0"
          />
        </div>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="input-field"
        >
          {tiposDisponibles.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo === 'todos' ? 'Todos los tipos' : formatearTipoRegistro(tipo)}
            </option>
          ))}
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="input-field"
        >
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'todos' ? 'Todas las categorías' : formatearCategoriaEdad(cat) || `${cat} kg`}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-secondary-text">Cargando lista de participantes...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-secondary-text text-lg">Aún no hay participantes confirmados.</p>
        </div>
      ) : (
        <div className="surface-muted overflow-hidden rounded-2xl border border-primary-text/8">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-charcoal-ink text-soft-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Categoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-text/8">
                {filtrados.map((usuario, idx) => (
                  <tr key={usuario.id} className="transition-colors hover:bg-blue-mist/45">
                    <td className="px-4 py-3 text-sm text-muted-text">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-primary-text">
                      {usuario.nombreCompleto}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-text">
                      {usuario.equipo || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-text">
                      {formatearTipoRegistro(usuario.tipoRegistro)}
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary-text">
                      {usuario.categoriaEdad
                        ? formatearCategoriaEdad(usuario.categoriaEdad)
                        : usuario.categoriaPeso
                          ? `${usuario.categoriaPeso} kg`
                          : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
