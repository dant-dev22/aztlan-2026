'use client'

import { useState, useMemo } from 'react'
import Modal from '@/app/components/Modal'
import type { UsuarioCompleto } from '@/app/hooks/useUsers'
import type { TipoRegistro } from '@/app/lib/api'
import { buildListaFinal, buildCsvListaFinal } from '@/app/lib/listaFinal'

const TIPOS_PARTICIPANTE: { value: TipoRegistro; label: string }[] = [
  { value: 'juvenil', label: 'Infantil y Juvenil' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'masters', label: 'Masters' },
]

type FiltroComprobante = 'todos' | 'aprobados' | 'pendientes'
type ModoExportacion = 'reporte' | 'lista-final'

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

function buildCsvReporte(usuarios: UsuarioCompleto[]): string {
  const headers = [
    'ID',
    'Aztlan ID',
    'Tipo de registro',
    'Nombre completo',
    'Email',
    'Equipo',
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
    escapeCsvCell(u.equipo),
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
  const [modo, setModo] = useState<ModoExportacion>('reporte')
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

  const participantesReporte = useMemo(() => {
    return usuarios.filter((u) => {
      if (!tiposSeleccionados.has(u.tipoRegistro)) return false
      if (filtroComprobante === 'aprobados' && !u.comprobanteAprobado) return false
      if (filtroComprobante === 'pendientes' && u.comprobanteAprobado) return false
      return true
    })
  }, [usuarios, tiposSeleccionados, filtroComprobante])

  const categoriasListaFinal = useMemo(() => buildListaFinal(usuarios), [usuarios])
  const totalListaFinal = useMemo(
    () => categoriasListaFinal.reduce((sum, c) => sum + c.participantes.length, 0),
    [categoriasListaFinal]
  )

  const contarParaDescarga = modo === 'reporte' ? participantesReporte.length : totalListaFinal

  const handleDescargar = () => {
    const fecha = new Date().toISOString().slice(0, 10)
    if (modo === 'reporte') {
      const csv = buildCsvReporte(participantesReporte)
      triggerDownload(csv, `reporte-participantes-aztlan-2026-${fecha}.csv`)
    } else {
      const csv = buildCsvListaFinal(categoriasListaFinal)
      triggerDownload(csv, `lista-final-aztlan-2026-${fecha}.csv`)
    }
    setModalOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="btn-accent"
        aria-label="Descargar reporte de participantes en CSV"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Descargar reporte de participantes
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} showCloseButton>
        <div className="space-y-6">
          <div className="rounded-[24px] bg-charcoal-ink px-6 py-6 text-soft-white">
            <p className="section-kicker mb-3 border-white/10 bg-white/10 text-blue-mist">Exportar datos</p>
            <h2 id="modal-reporte-titulo" className="pr-10 text-xl font-black tracking-tight text-soft-white">
              Opciones del reporte
            </h2>
            <p className="mt-2 text-sm text-white/72">
              Elige qué formato quieres exportar y qué participantes incluir.
            </p>
          </div>

          <div role="radiogroup" aria-labelledby="modo-exportacion-label">
            <span id="modo-exportacion-label" className="block text-sm font-semibold text-primary-text mb-3">
              Formato de exportación
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  modo === 'reporte'
                    ? 'border-charcoal-ink bg-blue-mist/30'
                    : 'border-primary-text/10 bg-light-ash/35 hover:border-primary-text/20'
                }`}
              >
                <input
                  type="radio"
                  name="modo-exportacion"
                  checked={modo === 'reporte'}
                  onChange={() => setModo('reporte')}
                  className="mt-1 w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                />
                <span className="flex-1">
                  <span className="block text-sm font-bold text-primary-text">Reporte completo</span>
                  <span className="block text-xs text-secondary-text mt-1">
                    Todos los campos del registro: email, fecha, comprobante, datos completos.
                  </span>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  modo === 'lista-final'
                    ? 'border-charcoal-ink bg-blue-mist/30'
                    : 'border-primary-text/10 bg-light-ash/35 hover:border-primary-text/20'
                }`}
              >
                <input
                  type="radio"
                  name="modo-exportacion"
                  checked={modo === 'lista-final'}
                  onChange={() => setModo('lista-final')}
                  className="mt-1 w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                />
                <span className="flex-1">
                  <span className="block text-sm font-bold text-primary-text">Lista final</span>
                  <span className="block text-xs text-secondary-text mt-1">
                    Solo participantes con pago aprobado, agrupados por categoría y ordenados por cinta.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {modo === 'reporte' && (
            <>
              <div role="group" aria-labelledby="filtro-tipo-label">
                <span id="filtro-tipo-label" className="block text-sm font-semibold text-primary-text mb-3">
                  Tipo de participante
                </span>
                <div className="flex flex-wrap gap-3">
                  {TIPOS_PARTICIPANTE.map(({ value, label }) => (
                    <label
                      key={value}
                      className="inline-flex items-center gap-2 rounded-full border border-primary-text/10 bg-light-ash/45 px-4 py-2 cursor-pointer text-secondary-text hover:text-primary-text"
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
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-full border border-primary-text/10 bg-light-ash/45 px-4 py-2 cursor-pointer text-secondary-text hover:text-primary-text">
                    <input
                      type="radio"
                      name="filtro-comprobante"
                      checked={filtroComprobante === 'todos'}
                      onChange={() => setFiltroComprobante('todos')}
                      className="w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                    />
                    <span>Todos</span>
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-primary-text/10 bg-light-ash/45 px-4 py-2 cursor-pointer text-secondary-text hover:text-primary-text">
                    <input
                      type="radio"
                      name="filtro-comprobante"
                      checked={filtroComprobante === 'aprobados'}
                      onChange={() => setFiltroComprobante('aprobados')}
                      className="w-4 h-4 border-2 border-graphite text-charcoal-ink focus:ring-charcoal-ink"
                    />
                    <span>Solo con comprobante aprobado</span>
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-full border border-primary-text/10 bg-light-ash/45 px-4 py-2 cursor-pointer text-secondary-text hover:text-primary-text">
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
            </>
          )}

          <p className="text-sm text-secondary-text">
            <strong className="text-primary-text">{contarParaDescarga}</strong> participante
            {contarParaDescarga !== 1 ? 's' : ''} en la descarga
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleDescargar}
              disabled={contarParaDescarga === 0}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Descargar CSV
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
