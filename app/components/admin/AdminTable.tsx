'use client'

import type { UsuarioCompleto } from '@/app/hooks/useUsers'
import ApprovalSwitch from './ApprovalSwitch'
import DeleteButton from './DeleteButton'

interface AdminTableProps {
  usuarios: UsuarioCompleto[]
  onApprove: (id: string, comprobanteAprobado: boolean) => void
  onDelete: (id: string) => void
  onViewComprobante?: (id: string) => void
}

export default function AdminTable({ usuarios, onApprove, onDelete, onViewComprobante }: AdminTableProps) {
  const formatearFecha = (timestamp: string) => {
    try {
      const fecha = new Date(timestamp)
      return fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return timestamp
    }
  }

  const formatearTipoRegistro = (tipo: string) => {
    const tipos: Record<string, string> = {
      juvenil: 'Infantil y Juvenil',
      adultos: 'Adultos',
      masters: 'Masters',
    }
    return tipos[tipo] || tipo
  }

  if (usuarios.length === 0) {
    return (
      <div className="surface-panel text-center py-12">
        <p className="text-secondary-text text-lg">No hay participantes registrados</p>
      </div>
    )
  }

  return (
    <div className="surface-panel overflow-x-auto">
      <table className="w-full">
        <thead className="bg-charcoal-ink text-soft-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Categoría</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Fecha Registro</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Comprobante</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Registro</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-text/8">
          {usuarios.map((usuario) => (
            <tr
              key={usuario.id}
              className="transition-colors hover:bg-blue-mist/45"
            >
              <td className="px-4 py-3 text-sm font-semibold text-primary-text">
                {usuario.nombreCompleto}
              </td>
              <td className="px-4 py-3 text-sm text-secondary-text">
                {usuario.email || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-secondary-text">
                {usuario.equipo || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-secondary-text">
                {formatearTipoRegistro(usuario.tipoRegistro)}
              </td>
              <td className="px-4 py-3 text-sm text-secondary-text">
                {usuario.categoriaPeso || usuario.categoriaEdad || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-secondary-text">
                {formatearFecha(usuario.timestamp)}
              </td>
              <td className="px-4 py-3 text-center">
                {onViewComprobante ? (
                  <button
                    onClick={() => onViewComprobante(usuario.id)}
                    className="text-sm font-medium text-electric-blue underline transition-colors hover:text-steel-gray"
                  >
                    Ver
                  </button>
                ) : (
                  <span className="text-muted-text text-sm">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <ApprovalSwitch
                    isApproved={usuario.comprobanteAprobado || false}
                    onToggle={(nextApproved) => onApprove(usuario.id, nextApproved)}
                    participantName={usuario.nombreCompleto}
                  />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <DeleteButton
                  onDelete={() => onDelete(usuario.id)}
                  participantName={usuario.nombreCompleto}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
