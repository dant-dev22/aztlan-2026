'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useUsers } from '@/app/hooks/useUsers'
import AdminTable from '@/app/components/admin/AdminTable'
import SearchBar from '@/app/components/admin/SearchBar'
import DownloadReportButton from '@/app/components/admin/DownloadReportButton'
import Header from '@/app/components/Header'
import Modal from '@/app/components/Modal'

const AUTH_CHECK_URL = '/admin/auth'

export default function AdminPage() {
  const { usuarios, loading, error, aprobarComprobante, eliminarUsuario, cargarUsuarios } = useUsers()
  const [busqueda, setBusqueda] = useState('')
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking')
  const [loginUser, setLoginUser] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  useEffect(() => {
    fetch(AUTH_CHECK_URL, { credentials: 'include' })
      .then((res) => {
        setAuthStatus(res.ok ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => setAuthStatus('unauthenticated'))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginSubmitting(true)
    try {
      const res = await fetch(AUTH_CHECK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: loginUser.trim(), password: loginPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setAuthStatus('authenticated')
        setLoginUser('')
        setLoginPassword('')
      } else {
        setLoginError(data.error || 'Usuario o contraseña incorrectos')
      }
    } catch {
      setLoginError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoginSubmitting(false)
    }
  }

  const showLoginModal = authStatus === 'unauthenticated'
  const showContent = authStatus === 'authenticated'

  const filtrados = useMemo(() => {
    if (!busqueda.trim()) return usuarios
    const q = busqueda.toLowerCase().trim()
    return usuarios.filter(
      (u) =>
        u.nombreCompleto?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.aztlan_id?.toLowerCase().includes(q)
    )
  }, [usuarios, busqueda])

  const verComprobante = (id: string) => {
    const u = usuarios.find((x) => x.id === id)
    if (u?.comprobanteUrl) window.open(u.comprobanteUrl!, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {authStatus === 'checking' && (
        <main className="flex-1 flex items-center justify-center py-16">
          <p className="text-secondary-text">Comprobando sesión...</p>
        </main>
      )}
      {showContent && (
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Panel de administración</h1>
              <p className="text-secondary-text mt-1">Participantes registrados y comprobantes</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg border-2 border-primary-text/20 text-primary-text hover:bg-light-ash/30 transition-colors"
              >
                Volver al inicio
              </Link>
              <DownloadReportButton usuarios={filtrados} />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">
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

          <div className="mb-4">
            <SearchBar onSearch={setBusqueda} placeholder="Buscar por nombre, email o Aztlan ID..." />
          </div>

          {loading ? (
            <p className="text-secondary-text py-8">Cargando participantes...</p>
          ) : (
            <AdminTable
              usuarios={filtrados}
              onApprove={aprobarComprobante}
              onDelete={eliminarUsuario}
              onViewComprobante={verComprobante}
            />
          )}
        </div>
      </main>
      )}
      <Modal isOpen={showLoginModal} onClose={() => {}} showCloseButton={false}>
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-primary-text mb-2">Acceso administración</h2>
          <p className="text-secondary-text text-sm mb-6">Ingresa usuario y contraseña para continuar.</p>
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
                autoComplete="username"
                className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 bg-soft-white text-primary-text placeholder-secondary-text/60 focus:border-charcoal-ink focus:outline-none focus:ring-2 focus:ring-charcoal-ink/20"
                placeholder="Usuario"
                required
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
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 bg-soft-white text-primary-text placeholder-secondary-text/60 focus:border-charcoal-ink focus:outline-none focus:ring-2 focus:ring-charcoal-ink/20"
                placeholder="Contraseña"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600" role="alert">
                {loginError}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loginSubmitting}
                className="flex-1 px-4 py-3 rounded-lg bg-charcoal-ink text-soft-white font-medium hover:bg-graphite transition-colors disabled:opacity-60"
              >
                {loginSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
              <Link
                href="/"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-primary-text/20 text-primary-text font-medium hover:bg-light-ash/30 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
