'use client'

import { useState, useMemo } from 'react'
import { useUsers } from '@/app/hooks/useUsers'
import AdminTable from '@/app/components/admin/AdminTable'
import SearchBar from '@/app/components/admin/SearchBar'
import type { UsuarioCompleto } from '@/app/hooks/useUsers'

export default function AdminDashboard() {
  const { usuarios, loading, eliminarUsuario, aprobarComprobante } = useUsers()
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar usuarios según la búsqueda
  const usuariosFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return usuarios

    const query = searchQuery.toLowerCase()
    return usuarios.filter((usuario) => {
      const nombre = usuario.nombreCompleto?.toLowerCase() || ''
      const email = usuario.email?.toLowerCase() || ''
      const tipo = usuario.tipoRegistro?.toLowerCase() || ''
      const categoria = (usuario.categoriaPeso || usuario.categoriaEdad || '').toLowerCase()
      const fecha = usuario.timestamp?.toLowerCase() || ''

      return (
        nombre.includes(query) ||
        email.includes(query) ||
        tipo.includes(query) ||
        categoria.includes(query) ||
        fecha.includes(query)
      )
    })
  }, [usuarios, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleViewComprobante = (id: string) => {
    // Por ahora no hacemos nada con la imagen, como indicó el usuario
    console.log('Ver comprobante para usuario:', id)
    // TODO: Implementar cuando haya servidor
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-charcoal-ink/20 border-t-charcoal-ink animate-spin mx-auto mb-4"
            role="status"
            aria-label="Cargando"
          />
          <p className="text-secondary-text">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <header className="bg-charcoal-ink text-soft-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Dashboard de Administración
          </h1>
          <p className="text-sm sm:text-base text-silver-fog mt-2">
            Gestión de participantes registrados
          </p>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-warm-white rounded-lg p-6 border-2 border-primary-text/10">
              <p className="text-sm text-secondary-text mb-1">Total de Participantes</p>
              <p className="text-3xl font-bold text-primary-text">{usuarios.length}</p>
            </div>
            <div className="bg-warm-white rounded-lg p-6 border-2 border-primary-text/10">
              <p className="text-sm text-secondary-text mb-1">Comprobantes Aprobados</p>
              <p className="text-3xl font-bold text-success-green">
                {usuarios.filter((u) => u.comprobanteAprobado).length}
              </p>
            </div>
            <div className="bg-warm-white rounded-lg p-6 border-2 border-primary-text/10">
              <p className="text-sm text-secondary-text mb-1">Pendientes de Aprobación</p>
              <p className="text-3xl font-bold text-charcoal-ink">
                {usuarios.filter((u) => !u.comprobanteAprobado).length}
              </p>
            </div>
          </div>

          {/* Buscador */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Tabla de usuarios */}
          <div className="animate-fade-in">
            <AdminTable
              usuarios={usuariosFiltrados}
              onApprove={aprobarComprobante}
              onDelete={eliminarUsuario}
              onViewComprobante={handleViewComprobante}
            />
          </div>

          {usuariosFiltrados.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-secondary-text text-lg">
                No se encontraron participantes que coincidan con "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
