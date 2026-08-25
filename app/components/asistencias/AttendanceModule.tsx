'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import AppLogo from '@/app/components/AppLogo'
import { AsistenciaCatalogoResponse, getAsistenciasCatalogo, postAsistencia } from '@/app/lib/api'
import { getInitials } from '@/app/lib/slug'

import QrScanner from './QrScanner'

interface AttendanceModuleProps {
  equipoSlug: string
  sucursalSlug: string
  equipoLabel: string
  sucursalLabel: string
}

type RequestStatus = 'idle' | 'loading' | 'submitting' | 'success' | 'error'

export default function AttendanceModule({
  equipoSlug,
  sucursalSlug,
  equipoLabel,
  sucursalLabel,
}: AttendanceModuleProps) {
  const [catalog, setCatalog] = useState<AsistenciaCatalogoResponse | null>(null)
  const [status, setStatus] = useState<RequestStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [aztlanId, setAztlanId] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [scannerKey, setScannerKey] = useState(0)
  const [lastAttendance, setLastAttendance] = useState<{
    nombreCompleto: string
    claseNombre: string
    fechaOperativa: string
  } | null>(null)

  const normalizedId = useMemo(() => aztlanId.trim().toUpperCase(), [aztlanId])
  const scannerEnabled = Boolean(normalizedId && selectedClassId && status !== 'submitting' && status !== 'loading')
  const selectedClass = catalog?.clases.find((clase) => clase.id === selectedClassId) ?? null
  const teamInitials = useMemo(() => getInitials(catalog?.equipo ?? equipoLabel), [catalog?.equipo, equipoLabel])

  const loadCatalog = useCallback(async () => {
    try {
      setStatus('loading')
      setError(null)
      const response = await getAsistenciasCatalogo(equipoSlug, sucursalSlug)
      setCatalog(response)
      setStatus('idle')
    } catch (loadError) {
      setStatus('error')
      setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar las clases disponibles.')
    }
  }, [equipoSlug, sucursalSlug])

  useEffect(() => {
    void loadCatalog()
  }, [loadCatalog])

  const handleDetected = useCallback(
    async (qrValue: string) => {
      if (!selectedClassId || !normalizedId) return

      try {
        setStatus('submitting')
        setError(null)
        const response = await postAsistencia({
          aztlan_id: normalizedId,
          equipo: catalog?.equipo ?? equipoLabel,
          sucursal: catalog?.sucursal ?? sucursalLabel,
          claseId: selectedClassId,
          qrContent: qrValue,
        })

        setLastAttendance({
          nombreCompleto: response.attendance.nombreCompleto,
          claseNombre: response.attendance.claseNombre,
          fechaOperativa: response.attendance.fechaOperativa,
        })
        setStatus('success')
        setAztlanId('')
        setScannerKey((current) => current + 1)
      } catch (submitError) {
        setStatus('error')
        setError(submitError instanceof Error ? submitError.message : 'No fue posible registrar la asistencia.')
        setScannerKey((current) => current + 1)
      }
    },
    [catalog?.equipo, catalog?.sucursal, equipoLabel, normalizedId, selectedClassId, sucursalLabel]
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="surface-panel overflow-hidden p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Asistencias</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-primary-text sm:text-4xl">
              Registro rapido por QR
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-secondary-text sm:text-base">
              Captura el Aztlan ID, selecciona la clase y escanea el QR del alumno para guardar su asistencia sin salir
              de esta pantalla.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-blue-mist p-3 shadow-sm">
            <AppLogo size={84} priority />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Equipo</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-charcoal-ink text-lg font-black text-soft-white">
                {teamInitials}
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-primary-text">{catalog?.equipo ?? equipoLabel}</p>
                <p className="text-sm text-secondary-text">Portal de asistencias activo</p>
              </div>
            </div>
          </div>

          <div className="surface-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Sucursal</p>
            <p className="mt-3 text-xl font-black tracking-tight text-primary-text">{catalog?.sucursal ?? sucursalLabel}</p>
            <p className="mt-2 text-sm text-secondary-text">
              Selecciona una clase para activar automaticamente la camara.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-primary-text">Aztlan ID del alumno</span>
            <input
              type="text"
              value={aztlanId}
              onChange={(event) => {
                setAztlanId(event.target.value.toUpperCase())
                if (status === 'success' || status === 'error') {
                  setStatus('idle')
                  setError(null)
                }
              }}
              placeholder="Ej. AZT1234"
              className="input-field uppercase tracking-[0.18em]"
              autoComplete="off"
              inputMode="text"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-primary-text">Clase disponible</span>
            <select
              value={selectedClassId}
              onChange={(event) => {
                setSelectedClassId(event.target.value)
                if (status === 'success' || status === 'error') {
                  setStatus('idle')
                  setError(null)
                }
              }}
              className="input-field"
              disabled={status === 'loading' || !catalog}
            >
              <option value="">{status === 'loading' ? 'Cargando clases...' : 'Selecciona una clase'}</option>
              {catalog?.clases.map((clase) => (
                <option key={clase.id} value={clase.id}>
                  {clase.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-[24px] border border-black/5 bg-light-ash/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary-text">Estado del flujo</p>
                <p className="mt-2 text-sm leading-6 text-secondary-text">
                  {scannerEnabled
                    ? 'La camara esta lista para escanear.'
                    : 'Ingresa el Aztlan ID y elige una clase para abrir la camara.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannerKey((current) => current + 1)
                  setStatus('idle')
                  setError(null)
                }}
                className="btn-secondary px-4 py-2 text-sm"
                disabled={!scannerEnabled && status !== 'error'}
              >
                Reiniciar escaner
              </button>
            </div>

            {selectedClass && (
              <div className="mt-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold text-primary-text">{selectedClass.nombre}</p>
                <p className="mt-1 text-sm text-secondary-text">{selectedClass.descripcion}</p>
              </div>
            )}
          </div>

          {status === 'loading' && (
            <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-secondary-text">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-silver-fog border-t-electric-blue" aria-hidden />
              <span>Cargando configuracion del portal...</span>
            </div>
          )}

          {status === 'submitting' && (
            <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-blue-mist px-4 py-3 text-sm text-electric-blue">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-electric-blue/20 border-t-electric-blue" aria-hidden />
              <span>Registrando asistencia...</span>
            </div>
          )}

          {status === 'success' && lastAttendance && (
            <div className="rounded-2xl border border-success-green/15 bg-green-50 px-4 py-4 text-success-green">
              <p className="text-base font-black">Tu asistencia ha sido registrada.</p>
              <p className="mt-2 text-sm">
                {lastAttendance.nombreCompleto} quedó registrado en {lastAttendance.claseNombre} el {lastAttendance.fechaOperativa}.
              </p>
            </div>
          )}

          {status === 'error' && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
              <p className="text-base font-black">No pudimos registrar la asistencia.</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <QrScanner key={scannerKey} enabled={scannerEnabled} onDetected={handleDetected} />

        <div className="surface-panel p-5 sm:p-6">
          <p className="text-sm font-semibold text-primary-text">Sugerencias para el operador</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-secondary-text">
            <li>Verifica que el Aztlan ID escrito coincida con el del alumno antes de activar la camara.</li>
            <li>Si el QR no se detecta, mejora la iluminacion o acerca el codigo al centro del recuadro.</li>
            <li>El sistema evita duplicados por alumno, clase y dia para reducir registros accidentales.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
