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
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="page-shell min-h-screen flex flex-col">
      <Header />
      {authStatus === 'checking' && (
        <main className="flex-1 flex items-center justify-center py-16">
          <p className="text-secondary-text">Comprobando sesión...</p>
        </main>
      )}
      {showContent && (
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="surface-panel-dark mb-6 flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="section-kicker mb-3 border-white/10 bg-white/10 text-blue-mist">Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-soft-white">Panel de administración</h1>
              <p className="mt-1 text-white/68">Participantes registrados y comprobantes</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-soft-white transition hover:bg-white/10"
              >
                Volver al inicio
              </Link>
              <DownloadReportButton usuarios={filtrados} />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
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
            <div className="surface-panel px-6 py-10">
              <p className="text-secondary-text">Cargando participantes...</p>
            </div>
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
        <div className="mx-auto max-w-sm">
          <div className="mb-6 rounded-[24px] bg-charcoal-ink px-6 py-7 text-soft-white">
            <p className="section-kicker mb-3 border-white/10 bg-white/10 text-blue-mist">Acceso seguro</p>
            <h2 className="mb-2 text-xl font-black tracking-tight text-soft-white">Acceso administración</h2>
            <p className="text-sm text-white/72">Ingresa usuario y contraseña para continuar.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-user" className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text">
                Usuario
              </label>
              <input
                id="admin-user"
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                autoComplete="username"
                className="input-field"
                placeholder="Usuario"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  className="input-field pr-12"
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-secondary-text transition-colors hover:text-primary-text"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.058.164-2.078.468-3.035m3.28-2.844A9.959 9.959 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.716 4.252-1.93 5.91M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
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
                className="btn-primary flex-1"
              >
                {loginSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
              <Link
                href="/"
                className="btn-secondary flex-1 text-center"
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
