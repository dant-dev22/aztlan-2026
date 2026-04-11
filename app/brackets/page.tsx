'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Modal from '@/app/components/Modal'
import BracketBoard from '@/app/components/brackets/BracketBoard'
import { useUsers } from '@/app/hooks/useUsers'
import { agruparListaFinal } from '@/app/lib/listaFinal'
import { createBracket, type BracketState } from '@/app/lib/bracketEngine'
import {
  clearBracketState,
  loadBracketState,
  parseBracketStateJson,
  saveBracketState,
} from '@/app/lib/bracketStorage'

const AUTH_CHECK_URL = '/admin/auth'

export default function BracketsPage() {
  const { usuarios, loading, error, cargarUsuarios } = useUsers()
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking')
  const [loginUser, setLoginUser] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('')
  const [bracketState, setBracketState] = useState<BracketState | null>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch(AUTH_CHECK_URL, { credentials: 'include' })
      .then((res) => {
        setAuthStatus(res.ok ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => setAuthStatus('unauthenticated'))
  }, [])

  const grupos = useMemo(() => {
    const aprobados = usuarios.filter((u) => u.comprobanteAprobado)
    return agruparListaFinal(aprobados)
  }, [usuarios])

  useEffect(() => {
    if (!categoriaSeleccionada) {
      setBracketState(null)
      return
    }
    const saved = loadBracketState(categoriaSeleccionada)
    if (saved) {
      setBracketState(saved)
      return
    }
    setBracketState(null)
  }, [categoriaSeleccionada])

  const participantesCategoria = useMemo(() => {
    const g = grupos.find((x) => x.titulo === categoriaSeleccionada)
    return g?.participantes ?? []
  }, [grupos, categoriaSeleccionada])

  useEffect(() => {
    if (!bracketState?.categoryTitle) return
    saveBracketState(bracketState)
  }, [bracketState])

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

  const generarAleatorio = useCallback(() => {
    if (!categoriaSeleccionada || participantesCategoria.length === 0) return
    const next = createBracket(participantesCategoria, categoriaSeleccionada, Math.random)
    setBracketState(next)
  }, [categoriaSeleccionada, participantesCategoria])

  const limpiarGuardado = useCallback(() => {
    if (!categoriaSeleccionada) return
    clearBracketState(categoriaSeleccionada)
    setBracketState(null)
    setImportMsg('Llave borrada del navegador para esta categoría.')
  }, [categoriaSeleccionada])

  const onImportJson = useCallback(
    (file: File | null) => {
      setImportMsg(null)
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const text = String(reader.result ?? '')
        const parsed = parseBracketStateJson(text)
        if (!parsed) {
          setImportMsg('El archivo no es un bracket válido.')
          return
        }
        if (categoriaSeleccionada && parsed.categoryTitle !== categoriaSeleccionada) {
          setImportMsg(
            `El JSON es de otra categoría (“${parsed.categoryTitle}”). Se cargó igualmente; revisa el selector.`
          )
        }
        setBracketState(parsed)
        setImportMsg('Bracket importado correctamente.')
      }
      reader.readAsText(file)
    },
    [categoriaSeleccionada]
  )

  const showLoginModal = authStatus === 'unauthenticated'
  const showContent = authStatus === 'authenticated'

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backHref="/admin" />
      {authStatus === 'checking' && (
        <main className="flex-1 flex items-center justify-center py-16">
          <p className="text-secondary-text">Comprobando sesión...</p>
        </main>
      )}
      {showContent && (
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Brackets por categoría</h1>
                <p className="text-secondary-text mt-1 max-w-2xl">
                  Solo participantes con pago aprobado. Se arma una eliminatoria simple con orden
                  aleatorio en la primera ronda (incluye byes si el número no es potencia de 2).
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg border-2 border-primary-text/20 text-primary-text hover:bg-light-ash/30 transition-colors text-center"
                >
                  Panel admin
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg border-2 border-primary-text/20 text-primary-text hover:bg-light-ash/30 transition-colors text-center"
                >
                  Inicio
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">
                <p>{error}</p>
                <button type="button" onClick={cargarUsuarios} className="mt-2 text-sm font-medium underline">
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <p className="text-secondary-text py-8">Cargando participantes...</p>
            ) : grupos.length === 0 ? (
              <p className="text-secondary-text py-8">
                No hay participantes aprobados para armar categorías. Aprueba comprobantes en el panel de
                administración.
              </p>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                  <div className="flex-1 min-w-0">
                    <label htmlFor="categoria-bracket" className="block text-sm font-medium text-primary-text mb-2">
                      Categoría (mismo criterio que lista final)
                    </label>
                    <select
                      id="categoria-bracket"
                      value={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                      className="w-full max-w-xl px-4 py-3 rounded-lg border-2 border-primary-text/20 bg-soft-white text-primary-text focus:border-charcoal-ink focus:outline-none focus:ring-2 focus:ring-charcoal-ink/20"
                    >
                      <option value="">Selecciona una categoría</option>
                      {grupos.map((g) => (
                        <option key={g.titulo} value={g.titulo}>
                          {g.titulo} ({g.participantes.length})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={!categoriaSeleccionada || participantesCategoria.length < 1}
                      onClick={generarAleatorio}
                      className="px-4 py-3 rounded-lg bg-charcoal-ink text-soft-white font-medium hover:bg-graphite transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        participantesCategoria.length < 1
                          ? 'No hay participantes en esta categoría'
                          : undefined
                      }
                    >
                      Generar llave aleatoria
                    </button>
                    <button
                      type="button"
                      disabled={!categoriaSeleccionada || !bracketState}
                      onClick={limpiarGuardado}
                      className="px-4 py-3 rounded-lg border-2 border-primary-text/20 text-primary-text font-medium hover:bg-light-ash/30 transition-colors disabled:opacity-50"
                    >
                      Borrar guardado
                    </button>
                  </div>
                </div>

                {categoriaSeleccionada && (
                  <p className="text-sm text-secondary-text">
                    Participantes en esta categoría:{' '}
                    <strong className="text-primary-text">{participantesCategoria.length}</strong>
                    {participantesCategoria.length === 1 && (
                      <span className="ml-2">(un solo competidor: se muestra como campeón de la categoría)</span>
                    )}
                  </p>
                )}

                <div className="rounded-xl border border-primary-text/10 bg-light-ash/20 p-4">
                  <p className="text-sm font-medium text-primary-text mb-2">Importar bracket (JSON)</p>
                  <p className="text-xs text-secondary-text mb-3">
                    Si descargaste un JSON antes, puedes volver a cargarlo aquí. Se guarda de nuevo en este
                    navegador al cambiar la llave.
                  </p>
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={(e) => onImportJson(e.target.files?.[0] ?? null)}
                    className="text-sm text-primary-text file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-2 file:border-primary-text/20 file:bg-soft-white file:text-primary-text"
                  />
                  {importMsg && <p className="mt-2 text-sm text-secondary-text">{importMsg}</p>}
                </div>

                {bracketState && bracketState.rounds.length > 0 && (
                  <BracketBoard state={bracketState} onChange={setBracketState} />
                )}

                {categoriaSeleccionada && participantesCategoria.length >= 1 && !bracketState && (
                  <p className="text-secondary-text text-sm">
                    No hay llave guardada para esta categoría. Pulsa &quot;Generar llave aleatoria&quot; para
                    {participantesCategoria.length >= 2
                      ? ' crear el primer enfrentamiento al azar.'
                      : ' registrar al único competidor aprobado como campeón de la categoría.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      <Modal isOpen={showLoginModal} onClose={() => {}} showCloseButton={false}>
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-primary-text mb-2">Acceso brackets</h2>
          <p className="text-secondary-text text-sm mb-6">
            Usa las mismas credenciales que el panel de administración.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="bracket-user" className="block text-sm font-medium text-primary-text mb-1">
                Usuario
              </label>
              <input
                id="bracket-user"
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
              <label htmlFor="bracket-password" className="block text-sm font-medium text-primary-text mb-1">
                Contraseña
              </label>
              <input
                id="bracket-password"
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
