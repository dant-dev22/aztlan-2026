'use client'

import { useState, useMemo } from 'react'
import Modal from '@/app/components/Modal'
import type { UsuarioCompleto } from '@/app/hooks/useUsers'
import type { TipoRegistro } from '@/app/lib/api'

const TIPOS_PARTICIPANTE: { value: TipoRegistro; label: string }[] = [
  { value: 'juvenil', label: 'Infantil y Juvenil' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'masters', label: 'Masters' },
]

type FiltroComprobante = 'todos' | 'aprobados' | 'pendientes'

interface DownloadReportButtonProps {
  usuarios: UsuarioCompleto[]
}

function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function buildCsv(usuarios: UsuarioCompleto[]): string {
  const headers = [
    'ID',
    'Aztlan ID',
    'Tipo de registro',
    'Nombre completo',
    'Email',
    'Fecha registro',
    'Sexo',
    'Cinta',
    'Nivel experiencia',
    'Categoría edad',
    'Categoría peso',
    'Edad',
    'Categoría peso tipo',
    'Comprobante aprobado',
  ]
  const rows = usuarios.map((u) => [
    escapeCsvCell(u.id),
    escapeCsvCell(u.aztlan_id),
    escapeCsvCell(u.tipoRegistro),
    escapeCsvCell(u.nombreCompleto),
    escapeCsvCell(u.email),
    escapeCsvCell(u.timestamp),
    escapeCsvCell(u.sexo),
    escapeCsvCell(u.cinta),
    escapeCsvCell(u.nivelExperiencia),
    escapeCsvCell(u.categoriaEdad),
    escapeCsvCell(u.categoriaPeso),
    escapeCsvCell(u.edad),
    escapeCsvCell(u.categoriaPesoTipo),
    escapeCsvCell(u.comprobanteAprobado ? 'Sí' : 'No'),
  ])
  const headerLine = headers.join(',')
  const dataLines = rows.map((row) => row.join(','))
  return [headerLine, ...dataLines].join('\r\n')
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function DownloadReportButton({ usuarios }: DownloadReportButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [tiposSeleccionados, setTiposSeleccionados] = useState<Set<TipoRegistro>>(
    () => new Set<TipoRegistro>(['juvenil', 'adultos', 'masters'])
  )
  const [filtroComprobante, setFiltroComprobante] = useState<FiltroComprobante>('todos')

  const toggleTipo = (tipo: TipoRegistro) => {
    setTiposSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(tipo)) next.delete(tipo)
      else next.add(tipo)
      return next
    })
  }

  const participantesFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (!tiposSeleccionados.has(u.tipoRegistro)) return false
      if (filtroComprobante === 'aprobados' && !u.comprobanteAprobado) return false
      if (filtroComprobante === 'pendientes' && u.comprobanteAprobado) return false
      return true
    })
  }, [usuarios, tiposSeleccionados, filtroComprobante])

  const handleDescargar = () => {
    const csv = buildCsv(participantesFiltrados)
    const fecha = new Date().toISOString().slice(0, 10)
    const filename = `reporte-participantes-aztlan-2026-${fecha}.csv`
    triggerDownload(csv, filename)
    setModalOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-charcoal-ink text-soft-white font-semibold hover:bg-graphite transition-colors border-2 border-charcoal-ink focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2 focus:ring-offset-soft-white"
        aria-label="Descargar reporte de participantes en CSV"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Descargar reporte de participantes
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} showCloseButton>
        <div className="space-y-6">
          <h2 id="modal-reporte-titulo" className="text-xl font-bold text-primary-text pr-10">
            Opciones del reporte
          </h2>
          <p className="text-secondary-text text-sm">
            El archivo CSV se descargará con los participantes que cumplan los filtros seleccionados.
          </p>

          <div role="group" aria-labelledby="filtro-tipo-label">
            <span id="filtro-tipo-label" className="block text-sm font-semibold text-primary-text mb-3">
              Tipo de participante
            </span>
            <div className="flex flex-wrap gap-4">
              {TIPOS_PARTICIPANTE.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer text-secondary-text hover:text-primary-text"
                >
                  <input
                    type="checkbox"
                    checked={tiposSeleccionados.has(value)}
                    onChange={() => toggleTipo(value)}
                    className="w-4 h-4 rounded border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div role="group" aria-labelledby="filtro-comprobante-label">
            <span id="filtro-comprobante-label" className="block text-sm font-semibold text-primary-text mb-3">
              Comprobante de pago
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-secondary-text hover:text-primary-text">
                <input
                  type="radio"
                  name="filtro-comprobante"
                  checked={filtroComprobante === 'todos'}
                  onChange={() => setFiltroComprobante('todos')}
                  className="w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                />
                <span>Todos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-secondary-text hover:text-primary-text">
                <input
                  type="radio"
                  name="filtro-comprobante"
                  checked={filtroComprobante === 'aprobados'}
                  onChange={() => setFiltroComprobante('aprobados')}
                  className="w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                />
                <span>Solo con comprobante aprobado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-secondary-text hover:text-primary-text">
                <input
                  type="radio"
                  name="filtro-comprobante"
                  checked={filtroComprobante === 'pendientes'}
                  onChange={() => setFiltroComprobante('pendientes')}
                  className="w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                />
                <span>Solo pendientes de aprobación</span>
              </label>
            </div>
          </div>

          <p className="text-sm text-secondary-text">
            <strong className="text-primary-text">{participantesFiltrados.length}</strong> participante
            {participantesFiltrados.length !== 1 ? 's' : ''} en el reporte
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleDescargar}
              disabled={participantesFiltrados.length === 0}
              className="px-5 py-2.5 rounded-lg bg-success-green text-soft-white font-semibold hover:bg-success-green-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-success-green focus:ring-offset-2"
            >
              Descargar CSV
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-lg border-2 border-graphite text-primary-text font-semibold hover:bg-light-ash transition-colors focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
