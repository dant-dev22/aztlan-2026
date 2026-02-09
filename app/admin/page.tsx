'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useUsers } from '@/app/hooks/useUsers'
import AdminTable from '@/app/components/admin/AdminTable'
import SearchBar from '@/app/components/admin/SearchBar'
import DownloadReportButton from '@/app/components/admin/DownloadReportButton'
import Header from '@/app/components/Header'

export default function AdminPage() {
  const { usuarios, loading, error, aprobarComprobante, eliminarUsuario, cargarUsuarios } = useUsers()
  const [busqueda, setBusqueda] = useState('')

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
    </div>
  )
}
