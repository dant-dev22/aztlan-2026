'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUsuarios, deleteUsuario, patchUsuarioAprobar, type UsuarioApi } from '@/app/lib/api'

export type UsuarioCompleto = UsuarioApi

function normalizeUsuario(api: UsuarioApi): UsuarioCompleto {
  return {
    ...api,
    comprobanteAprobado: api.comprobanteAprobado ?? false,
    comprobanteUrl: api.comprobanteUrl ?? null,
  }
}

export function useUsers() {
  const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarUsuarios = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsuarios()
      setUsuarios(data.map(normalizeUsuario))
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar la lista')
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const eliminarUsuario = useCallback(async (id: string) => {
    try {
      await deleteUsuario(id)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      console.error('Error al eliminar usuario:', err)
    }
  }, [])

  const aprobarComprobante = useCallback(async (id: string) => {
    try {
      const actualizado = await patchUsuarioAprobar(id)
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? normalizeUsuario(actualizado) : u))
      )
    } catch (err) {
      console.error('Error al aprobar comprobante:', err)
    }
  }, [])

  const actualizarUsuarios = useCallback((nuevosUsuarios: UsuarioCompleto[]) => {
    setUsuarios(nuevosUsuarios)
  }, [])

  return {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    eliminarUsuario,
    aprobarComprobante,
    actualizarUsuarios,
  }
}
