'use client'

import { useState, useMemo } from 'react'
import { useUsers } from '@/app/hooks/useUsers'
import AdminTable from '@/app/components/admin/AdminTable'
import SearchBar from '@/app/components/admin/SearchBar'
import type { UsuarioCompleto } from '@/app/hooks/useUsers'

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD = 'x7k2'

export default function AdminDashboard() {
  const { usuarios, loading, error, cargarUsuarios, eliminarUsuario, aprobarComprobante } = useUsers()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (loginUser === ADMIN_USER && loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos.')
    }
  }

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

  // Popup de login: mostrar hasta que se autentique
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-ink/90 p-4">
        <div className="w-full max-w-sm bg-soft-white rounded-2xl shadow-2xl p-8 animate-fade-in">
          <h2 className="text-xl font-bold text-primary-text mb-6 text-center">
            Acceso de administración
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-user" className="block text-sm font-medium text-primary-text mb-1">
                Usuario
              </label>
              <input
                id="admin-user"
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-graphite focus:border-charcoal-ink focus:outline-none text-primary-text"
                placeholder="Usuario"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-primary-text mb-1">
                Contraseña
              </label>
              <input
                id="admin-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-graphite focus:border-charcoal-ink focus:outline-none text-primary-text"
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600 font-medium">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-charcoal-ink text-soft-white font-semibold hover:bg-graphite transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading && usuarios.length === 0) {
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

  if (error && usuarios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            type="button"
            onClick={() => cargarUsuarios()}
            className="px-6 py-2 rounded-lg bg-charcoal-ink text-soft-white hover:bg-graphite transition-colors"
          >
            Reintentar
          </button>
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
